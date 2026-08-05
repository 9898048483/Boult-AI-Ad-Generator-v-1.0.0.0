/**
 * Native File System & Export Helpers for Cross-Platform File Handling
 * (Windows, macOS, Linux, Web, Android - Tauri / Capacitor / Web APIs)
 */

export async function saveFileNative(
  dataUrlOrBlob: string | Blob,
  suggestedFilename: string,
  mimeType: string = 'image/png'
): Promise<boolean> {
  try {
    let blob: Blob;
    let dataUrl: string;

    if (typeof dataUrlOrBlob === 'string') {
      dataUrl = dataUrlOrBlob;
      const res = await fetch(dataUrlOrBlob);
      blob = await res.blob();
    } else {
      blob = dataUrlOrBlob;
      dataUrl = URL.createObjectURL(blob);
    }

    // 1. Check for Tauri Desktop API (Windows / macOS / Linux)
    if ((window as any).__TAURI__?.dialog && (window as any).__TAURI__?.fs) {
      try {
        const tauri = (window as any).__TAURI__;
        const filePath = await tauri.dialog.save({
          defaultPath: suggestedFilename,
          filters: [{ name: 'Export File', extensions: [suggestedFilename.split('.').pop() || 'png'] }],
        });

        if (filePath) {
          const buffer = await blob.arrayBuffer();
          await tauri.fs.writeBinaryFile(filePath, new Uint8Array(buffer));
          return true;
        }
        return false;
      } catch (err) {
        console.warn('Tauri native dialog failed, falling back:', err);
      }
    }

    // 2. Check for File System Access API (Chrome/Edge/macOS/Linux Chromium browsers)
    if ('showSaveFilePicker' in window) {
      try {
        const ext = suggestedFilename.split('.').pop() || 'png';
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: suggestedFilename,
          types: [
            {
              description: `${ext.toUpperCase()} File`,
              accept: { [mimeType]: [`.${ext}`] },
            },
          ],
        });

        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return true;
      } catch (err: any) {
        if (err.name === 'AbortError') return false;
        console.warn('File System Access API failed, falling back:', err);
      }
    }

    // 3. Fallback standard anchor element download
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = suggestedFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (err) {
    console.error('Error saving file natively:', err);
    return false;
  }
}

export async function saveImageNative(dataUrlOrBlobUrl: string, suggestedFilename: string): Promise<boolean> {
  return saveFileNative(dataUrlOrBlobUrl, suggestedFilename, 'image/png');
}

export function downloadJsonFile(data: any, filename: string) {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  saveFileNative(blob, filename, 'application/json');
}

