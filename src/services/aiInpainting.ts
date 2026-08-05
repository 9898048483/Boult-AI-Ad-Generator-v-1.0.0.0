/**
 * Product Inpainting & Studio Composition Service
 * Handles product masking, HTML5 Canvas shadow synthesis, and composite rendering
 */

import { InpaintingConfig } from '../types';

/**
 * Automatically creates an alpha threshold mask canvas from an uploaded product PNG image
 */
export async function createProductMaskFromImage(imageSrc: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject('Failed to get 2d canvas context');

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Convert alpha channel to high-contrast black & white mask
      // White (255, 255, 255) = Area to replace (Background)
      // Black (0, 0, 0) = Area to keep (Product)
      for (let i = 0; i < data.length; i += 4) {
        const alpha = data[i + 3];
        if (alpha < 50) {
          // Transparent pixel -> White mask (Inpaint region)
          data[i] = 255;
          data[i + 1] = 255;
          data[i + 2] = 255;
          data[i + 3] = 255;
        } else {
          // Opaque product pixel -> Black mask (Preserve product)
          data[i] = 0;
          data[i + 1] = 0;
          data[i + 2] = 0;
          data[i + 3] = 255;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = (err) => reject(err);
    img.src = imageSrc;
  });
}

/**
 * Composite the real product onto the AI-generated studio background with synthesized physical studio shadows
 */
export async function compositeProductOnBackground(
  backgroundImageUrl: string,
  productImageSrc: string,
  position: { x: number; y: number; scale: number; rotation: number },
  lightingStyle: string = 'warm-studio'
): Promise<string> {
  return new Promise((resolve, reject) => {
    const bgImg = new Image();
    const prodImg = new Image();

    bgImg.crossOrigin = 'anonymous';
    prodImg.crossOrigin = 'anonymous';

    let loadedCount = 0;
    const checkLoaded = () => {
      loadedCount++;
      if (loadedCount === 2) renderComposite();
    };

    bgImg.onload = checkLoaded;
    prodImg.onload = checkLoaded;
    bgImg.onerror = reject;
    prodImg.onerror = reject;

    bgImg.src = backgroundImageUrl;
    prodImg.src = productImageSrc;

    function renderComposite() {
      const canvas = document.createElement('canvas');
      canvas.width = bgImg.width || 1024;
      canvas.height = bgImg.height || 1024;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject('Failed to get 2d context');

      // 1. Draw AI Background
      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

      // Save context state
      ctx.save();

      // Calculate position
      const centerX = (canvas.width * position.x) / 100;
      const centerY = (canvas.height * position.y) / 100;
      const prodWidth = prodImg.width * position.scale;
      const prodHeight = prodImg.height * position.scale;

      // 2. Synthesize Studio Ambient Drop Shadow under product
      ctx.save();
      ctx.translate(centerX, centerY + prodHeight * 0.42);
      ctx.rotate((position.rotation * Math.PI) / 180);
      ctx.scale(1, 0.25); // Elliptical shadow squeeze

      const shadowGradient = ctx.createRadialGradient(0, 0, 10, 0, 0, prodWidth * 0.55);
      shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
      shadowGradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.3)');
      shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = shadowGradient;
      ctx.beginPath();
      ctx.arc(0, 0, prodWidth * 0.55, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 3. Draw Real Product Image
      ctx.translate(centerX, centerY);
      ctx.rotate((position.rotation * Math.PI) / 180);
      ctx.drawImage(
        prodImg,
        -prodWidth / 2,
        -prodHeight / 2,
        prodWidth,
        prodHeight
      );

      // 4. Apply Lighting Tone Overlay
      if (lightingStyle === 'neon-cyberpunk') {
        ctx.globalCompositeOperation = 'color-dodge';
        const neonGrad = ctx.createLinearGradient(-prodWidth / 2, -prodHeight / 2, prodWidth / 2, prodHeight / 2);
        neonGrad.addColorStop(0, 'rgba(6, 182, 212, 0.15)');
        neonGrad.addColorStop(1, 'rgba(168, 85, 247, 0.15)');
        ctx.fillStyle = neonGrad;
        ctx.fillRect(-prodWidth / 2, -prodHeight / 2, prodWidth, prodHeight);
      } else if (lightingStyle === 'warm-studio') {
        ctx.globalCompositeOperation = 'soft-light';
        const warmGrad = ctx.createRadialGradient(0, -prodHeight / 3, 10, 0, 0, prodWidth);
        warmGrad.addColorStop(0, 'rgba(251, 191, 36, 0.2)');
        warmGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = warmGrad;
        ctx.fillRect(-prodWidth / 2, -prodHeight / 2, prodWidth, prodHeight);
      }

      ctx.restore();

      resolve(canvas.toDataURL('image/png'));
    }
  });
}
