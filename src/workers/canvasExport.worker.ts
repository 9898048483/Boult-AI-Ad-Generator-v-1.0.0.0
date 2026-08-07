/// <reference lib="webworker" />

export interface ExportWorkerPayload {
  id: string;
  title: string;
  tagline: string;
  brandName?: string;
  imageUrl?: string;
  ratios: Array<'1:1' | '9:16' | '16:9' | '4:3'>;
  format: 'png' | 'webp' | 'pdf';
  quality?: number;
  accentColor?: string;
  bgGradient?: [string, string];
}

export interface ExportWorkerResultItem {
  ratio: string;
  width: number;
  height: number;
  dataUrl: string;
}

export interface ExportWorkerResponse {
  id: string;
  status: 'success' | 'error';
  outputs?: ExportWorkerResultItem[];
  error?: string;
}

const RATIO_DIMENSIONS: Record<string, { width: number; height: number }> = {
  '1:1': { width: 1080, height: 1080 },
  '9:16': { width: 1080, height: 1920 },
  '16:9': { width: 1920, height: 1080 },
  '4:3': { width: 1440, height: 1080 },
};

self.addEventListener('message', async (event: MessageEvent<ExportWorkerPayload>) => {
  const {
    id,
    title,
    tagline,
    brandName = 'BOULT AI',
    imageUrl,
    ratios = ['1:1', '9:16', '16:9', '4:3'],
    format = 'png',
    quality = 0.92,
    accentColor = '#f97316',
    bgGradient = ['#0f172a', '#020617'],
  } = event.data;

  try {
    let imageBitmap: ImageBitmap | null = null;
    if (imageUrl) {
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        imageBitmap = await createImageBitmap(blob);
      } catch (err) {
        console.warn('Worker: Failed to load background image bitmap, falling back to gradient', err);
      }
    }

    const outputs: ExportWorkerResultItem[] = [];

    for (const ratio of ratios) {
      const dims = RATIO_DIMENSIONS[ratio] || RATIO_DIMENSIONS['1:1'];
      const width = dims.width;
      const height = dims.height;

      const canvas = new OffscreenCanvas(width, height);
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error(`Failed to initialize 2D context on OffscreenCanvas for ratio ${ratio}`);
      }

      // 1. Draw Background Gradient
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, bgGradient[0]);
      grad.addColorStop(1, bgGradient[1]);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Image if available
      if (imageBitmap) {
        const imgAspect = imageBitmap.width / imageBitmap.height;
        const canvasAspect = width / height;

        let renderW = width;
        let renderH = height;
        let renderX = 0;
        let renderY = 0;

        if (imgAspect > canvasAspect) {
          renderW = height * imgAspect;
          renderX = (width - renderW) / 2;
        } else {
          renderH = width / imgAspect;
          renderY = (height - renderH) / 2;
        }

        ctx.globalAlpha = 0.85;
        ctx.drawImage(imageBitmap, renderX, renderY, renderW, renderH);
        ctx.globalAlpha = 1.0;

        // Dark overlay gradient for text contrast
        const overlayGrad = ctx.createLinearGradient(0, height * 0.3, 0, height);
        overlayGrad.addColorStop(0, 'rgba(2, 6, 23, 0.1)');
        overlayGrad.addColorStop(0.6, 'rgba(2, 6, 23, 0.7)');
        overlayGrad.addColorStop(1, 'rgba(2, 6, 23, 0.95)');
        ctx.fillStyle = overlayGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // 3. Draw Brand Badge
      ctx.fillStyle = accentColor;
      const badgePaddingX = 24;
      const badgePaddingY = 12;
      const badgeY = height * 0.08;
      ctx.font = 'bold 24px sans-serif';
      const brandWidth = ctx.measureText(brandName.toUpperCase()).width;
      
      ctx.beginPath();
      ctx.roundRect(width * 0.08, badgeY, brandWidth + badgePaddingX * 2, 48, 24);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.fillText(brandName.toUpperCase(), width * 0.08 + badgePaddingX, badgeY + 32);

      // 4. Draw Main Headline
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.round(width * 0.055)}px sans-serif`;
      
      const maxTextWidth = width * 0.84;
      const words = title.split(' ');
      let line = '';
      let textY = height * 0.65;
      const lineHeight = Math.round(width * 0.065);

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxTextWidth && n > 0) {
          ctx.fillText(line.trim(), width * 0.08, textY);
          line = words[n] + ' ';
          textY += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line.trim(), width * 0.08, textY);

      // 5. Draw Tagline
      if (tagline) {
        textY += lineHeight * 0.8;
        ctx.fillStyle = '#94a3b8';
        ctx.font = `500 ${Math.round(width * 0.03)}px sans-serif`;
        ctx.fillText(tagline, width * 0.08, textY);
      }

      // 6. Draw Call-To-Action (CTA) Button
      const ctaY = textY + lineHeight * 0.9;
      const ctaText = 'EXPLORE NOW';
      ctx.font = 'bold 22px sans-serif';
      const ctaWidth = ctx.measureText(ctaText).width + 60;
      
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.roundRect(width * 0.08, ctaY, ctaWidth, 54, 12);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.fillText(ctaText, width * 0.08 + 30, ctaY + 34);

      // 7. Watermark
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.font = '14px sans-serif';
      ctx.fillText('BOULT AI STUDIO EXPORT', width * 0.08, height - 30);

      // Convert Canvas to Blob / DataURL
      const mimeType = format === 'webp' ? 'image/webp' : 'image/png';
      const blob = await canvas.convertToBlob({ type: mimeType, quality });

      const reader = new FileReader();
      const dataUrl = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      outputs.push({
        ratio,
        width,
        height,
        dataUrl,
      });
    }

    const response: ExportWorkerResponse = {
      id,
      status: 'success',
      outputs,
    };

    self.postMessage(response);
  } catch (error: any) {
    self.postMessage({
      id,
      status: 'error',
      error: error?.message || 'Unknown Web Worker rendering error',
    });
  }
});

export {};
