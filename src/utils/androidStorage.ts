export interface SaveImageResult {
  success: boolean;
  path?: string;
  message: string;
}

/**
 * Checks if the current app is running within an Android Capacitor Container
 */
export function isCapacitorAndroid(): boolean {
  if (typeof window === 'undefined') return false;
  const capacitor = (window as any).Capacitor;
  return Boolean(capacitor && capacitor.isNativePlatform && capacitor.getPlatform() === 'android');
}

/**
 * Checks storage permissions on Android (API 33+ Scoped Storage vs Legacy API < 33)
 */
export async function checkAndroidStoragePermissions(): Promise<boolean> {
  if (!isCapacitorAndroid()) return true;

  try {
    const capacitor = (window as any).Capacitor;
    const permissions = capacitor.Plugins?.Permissions || capacitor.Plugins?.Filesystem;
    if (permissions && typeof permissions.checkPermissions === 'function') {
      const status = await permissions.checkPermissions();
      return status?.publicStorage === 'granted' || status?.storage === 'granted';
    }
  } catch (err) {
    console.warn('[AndroidStorage] Permission check fallback:', err);
  }
  return true;
}

/**
 * Requests Android Scoped Storage / MediaStore permissions
 */
export async function requestAndroidStoragePermissions(): Promise<boolean> {
  if (!isCapacitorAndroid()) return true;

  try {
    const capacitor = (window as any).Capacitor;
    const permissions = capacitor.Plugins?.Permissions || capacitor.Plugins?.Filesystem;
    if (permissions && typeof permissions.requestPermissions === 'function') {
      const res = await permissions.requestPermissions();
      return res?.publicStorage === 'granted' || res?.storage === 'granted';
    }
  } catch (err) {
    console.warn('[AndroidStorage] Permission request fallback:', err);
  }
  return true;
}

/**
 * Writes image stream directly to Pictures/BOULT_Ads/ folder in Android Gallery,
 * Tauri filesystem, or browser file download stream.
 */
export async function saveToAndroidGallery(
  base64Data: string,
  fileName: string = `BOULT_Ad_${Date.now()}.png`
): Promise<SaveImageResult> {
  // Strip data URL header if present
  const base64Clean = base64Data.replace(/^data:image\/(png|jpeg|webp|jpg);base64,/, '');

  // 1. Android Capacitor Native Scoped Storage Path
  if (isCapacitorAndroid()) {
    try {
      const hasPermission = await requestAndroidStoragePermissions();
      if (!hasPermission) {
        return {
          success: false,
          message: 'Storage permission denied on Android device',
        };
      }

      const capacitor = (window as any).Capacitor;
      const filesystem = capacitor.Plugins?.Filesystem;

      if (filesystem) {
        const targetDirectory = 'Pictures/BOULT_Ads';
        const fullFilePath = `${targetDirectory}/${fileName}`;

        // Ensure target directory exists
        try {
          await filesystem.mkdir({
            path: targetDirectory,
            directory: 'DOCUMENTS',
            recursive: true,
          });
        } catch (_) {
          // Folder already exists or scoped storage handles creation
        }

        const writeResult = await filesystem.writeFile({
          path: fullFilePath,
          data: base64Clean,
          directory: 'DOCUMENTS',
          recursive: true,
        });

        // Trigger MediaStore broadcast scan if available
        if (capacitor.Plugins?.Media) {
          try {
            await capacitor.Plugins.Media.savePhoto({
              path: writeResult.uri,
              album: 'BOULT_Ads',
            });
          } catch (_) {}
        }

        return {
          success: true,
          path: writeResult.uri || fullFilePath,
          message: `Saved directly to Android Gallery (${fullFilePath})`,
        };
      }
    } catch (err: any) {
      console.error('[AndroidStorage] Capacitor native save failed:', err);
    }
  }

  // 2. Tauri Native Desktop Path
  if (typeof window !== 'undefined' && (window as any).__TAURI__) {
    try {
      const invoke = (window as any).__TAURI__.core?.invoke || (window as any).__TAURI__.invoke;
      if (invoke) {
        const savedPath = `BOULT_Ads/${fileName}`;
        await invoke('save_image_to_disk', {
          path: savedPath,
          base64Data: base64Clean,
        });
        return {
          success: true,
          path: savedPath,
          message: `Saved natively via Tauri to ${savedPath}`,
        };
      }
    } catch (err: any) {
      console.warn('[AndroidStorage] Tauri save fallback:', err);
    }
  }

  // 3. HTML5 Standard Browser Download Fallback
  try {
    const byteCharacters = atob(base64Clean);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/png' });

    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);

    return {
      success: true,
      message: `Downloaded file: ${fileName}`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Failed to download file: ${err?.message || 'Unknown error'}`,
    };
  }
}
