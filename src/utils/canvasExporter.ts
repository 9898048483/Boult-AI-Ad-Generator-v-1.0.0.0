import jsPDF from 'jspdf';
import { saveFileNative } from './nativeFileSystem';

export interface CanvasLayer {
  id: string;
  type: 'text' | 'badge' | 'price' | 'brand-logo';
  text?: string;
  subtext?: string;
  x: number; // Percentage (0 - 100)
  y: number; // Percentage (0 - 100)
  fontSize: number; // Base font size
  fontWeight?: 'normal' | 'bold' | '800';
  fontFamily?: string;
  color: string;
  strokeColor?: string;
  strokeWidth?: number;
  shadowColor?: string;
  shadowBlur?: number;
  badgeStyle?: 'discount-pill' | 'price-tag' | 'neon-banner' | 'boult-logo';
  isVisible: boolean;
}

export interface ImageAdjustments {
  brightness: number; // -100 to 100
  contrast: number; // -100 to 100
  saturation: number; // -100 to 100
  vignette: number; // 0 to 100
  blur: number; // 0 to 20
}

export const ASPECT_RATIO_PRESETS = [
  { id: '1:1', label: '1:1 Square (Feed / Product)', width: 1080, height: 1080 },
  { id: '9:16', label: '9:16 Vertical (Reels / Stories)', width: 1080, height: 1920 },
  { id: '16:9', label: '16:9 Landscape (Web Banner)', width: 1920, height: 1080 },
  { id: '4:3', label: '4:3 Standard (E-Commerce Catalog)', width: 1440, height: 1080 },
] as const;

export type AspectRatioType = '1:1' | '9:16' | '16:9' | '4:3';

/**
 * Render complete multi-layer ad canvas into HTMLCanvasElement
 */
export async function renderAdToCanvas(
  bgImageSrc: string,
  layers: CanvasLayer[],
  adjustments: ImageAdjustments,
  targetWidth: number = 1080,
  targetHeight: number = 1080
): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return reject('Failed to initialize 2D context');

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // 1. Draw and filter background image
      ctx.save();
      const filterStr = `brightness(${100 + adjustments.brightness}%) contrast(${
        100 + adjustments.contrast
      }%) saturate(${100 + adjustments.saturation}%) blur(${adjustments.blur}px)`;
      ctx.filter = filterStr;

      // Draw background scaled to fill
      const scale = Math.max(targetWidth / img.width, targetHeight / img.height);
      const x = (targetWidth - img.width * scale) / 2;
      const y = (targetHeight - img.height * scale) / 2;
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      ctx.restore();

      // 2. Draw Vignette effect if enabled
      if (adjustments.vignette > 0) {
        ctx.save();
        const outerRadius = Math.sqrt(Math.pow(targetWidth / 2, 2) + Math.pow(targetHeight / 2, 2));
        const grad = ctx.createRadialGradient(
          targetWidth / 2,
          targetHeight / 2,
          outerRadius * 0.3,
          targetWidth / 2,
          targetHeight / 2,
          outerRadius
        );
        const opacity = (adjustments.vignette / 100) * 0.8;
        grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        grad.addColorStop(1, `rgba(0, 0, 0, ${opacity})`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, targetWidth, targetHeight);
        ctx.restore();
      }

      // 3. Render Layers
      const baseScale = targetWidth / 1080;

      layers.forEach((layer) => {
        if (!layer.isVisible) return;

        ctx.save();
        const posX = (targetWidth * layer.x) / 100;
        const posY = (targetHeight * layer.y) / 100;

        ctx.translate(posX, posY);

        if (layer.shadowColor && layer.shadowBlur) {
          ctx.shadowColor = layer.shadowColor;
          ctx.shadowBlur = layer.shadowBlur * baseScale;
          ctx.shadowOffsetX = 2 * baseScale;
          ctx.shadowOffsetY = 4 * baseScale;
        }

        // Render specific layer types
        if (layer.type === 'brand-logo' || layer.badgeStyle === 'boult-logo') {
          // Draw BOULT AI Emblem Badge
          ctx.fillStyle = '#0f172a';
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 3 * baseScale;

          const w = 220 * baseScale;
          const h = 54 * baseScale;
          ctx.beginPath();
          ctx.roundRect(-w / 2, -h / 2, w, h, 12 * baseScale);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#f59e0b';
          ctx.font = `bold ${22 * baseScale}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('⚡ BOULT AI', 0, 0);

        } else if (layer.type === 'badge' || layer.badgeStyle === 'discount-pill') {
          // Draw Discount Badge Pill
          const text = layer.text || '50% OFF';
          ctx.font = `bold ${28 * baseScale}px sans-serif`;
          const textWidth = ctx.measureText(text).width;
          const padX = 24 * baseScale;
          const padY = 12 * baseScale;
          const w = textWidth + padX * 2;
          const h = 48 * baseScale;

          // Gradient fill
          const grad = ctx.createLinearGradient(-w / 2, 0, w / 2, 0);
          grad.addColorStop(0, '#ef4444');
          grad.addColorStop(1, '#f59e0b');
          ctx.fillStyle = grad;

          ctx.beginPath();
          ctx.roundRect(-w / 2, -h / 2, w, h, 24 * baseScale);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(text, 0, 0);

        } else if (layer.type === 'price') {
          // Draw Price Callout Tag
          const priceText = layer.text || '₹1,999';
          const mrpText = layer.subtext || 'M.R.P: ₹4,999';

          ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.8)';
          ctx.lineWidth = 2 * baseScale;

          const w = 260 * baseScale;
          const h = 64 * baseScale;

          ctx.beginPath();
          ctx.roundRect(-w / 2, -h / 2, w, h, 14 * baseScale);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#10b981';
          ctx.font = `bold ${26 * baseScale}px sans-serif`;
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillText(priceText, -w / 2 + 16 * baseScale, -6 * baseScale);

          ctx.fillStyle = '#94a3b8';
          ctx.font = `${14 * baseScale}px sans-serif`;
          ctx.fillText(mrpText, -w / 2 + 16 * baseScale, 18 * baseScale);

        } else {
          // Dynamic Text Layer
          const fontSize = (layer.fontSize || 36) * baseScale;
          ctx.font = `${layer.fontWeight || 'bold'} ${fontSize}px ${
            layer.fontFamily || 'sans-serif'
          }`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          if (layer.strokeColor && layer.strokeWidth) {
            ctx.strokeStyle = layer.strokeColor;
            ctx.lineWidth = layer.strokeWidth * baseScale;
            ctx.strokeText(layer.text || '', 0, 0);
          }

          ctx.fillStyle = layer.color || '#ffffff';
          ctx.fillText(layer.text || '', 0, 0);
        }

        ctx.restore();
      });

      resolve(canvas);
    };

    img.onerror = (err) => reject(err);
    img.src = bgImageSrc;
  });
}

/**
 * Batch Export Ad Canvas across multiple aspect ratios in parallel
 */
export async function batchExportCanvas(
  bgImageSrc: string,
  layers: CanvasLayer[],
  adjustments: ImageAdjustments,
  format: 'png' | 'webp' | 'pdf' = 'png',
  selectedAspects: AspectRatioType[] = ['1:1', '9:16', '16:9', '4:3']
): Promise<void> {
  const targets = ASPECT_RATIO_PRESETS.filter((p) => selectedAspects.includes(p.id as any));

  if (format === 'pdf') {
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    let isFirst = true;

    for (const preset of targets) {
      const canvas = await renderAdToCanvas(bgImageSrc, layers, adjustments, preset.width, preset.height);
      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      if (!isFirst) doc.addPage();
      isFirst = false;

      // Fit image inside A4 dimensions
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (preset.height / preset.width) * pdfWidth;
      doc.addImage(imgData, 'JPEG', 0, (297 - pdfHeight) / 2, pdfWidth, pdfHeight);
    }

    const pdfBlob = doc.output('blob');
    await saveFileNative(pdfBlob, `BOULT_Ad_Campaign_${Date.now()}.pdf`, 'application/pdf');
    return;
  }

  // PNG / WebP multi-ratio exports
  for (const preset of targets) {
    const canvas = await renderAdToCanvas(bgImageSrc, layers, adjustments, preset.width, preset.height);
    const mimeType = format === 'webp' ? 'image/webp' : 'image/png';
    const dataUrl = canvas.toDataURL(mimeType, 0.92);
    const fileName = `BOULT_Ad_${preset.id.replace(':', 'x')}_${Date.now()}.${format}`;
    await saveFileNative(dataUrl, fileName, mimeType);
  }
}
