import React, { useState, useRef } from 'react';
import { X, Upload, Sliders, Sparkles, Image as ImageIcon, RotateCw, ZoomIn, Sun, CheckCircle2, Layers } from 'lucide-react';
import { createProductMaskFromImage, compositeProductOnBackground } from '../services/aiInpainting';

interface InpaintingStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  bgImageUrl?: string;
  onApplyComposite: (compositeImageUrl: string) => void;
}

export const InpaintingStudioModal: React.FC<InpaintingStudioModalProps> = ({
  isOpen,
  onClose,
  bgImageUrl = 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1024&q=80',
  onApplyComposite,
}) => {
  const [productImgSrc, setProductImgSrc] = useState<string | null>(null);
  const [maskImgSrc, setMaskImgSrc] = useState<string | null>(null);
  const [isProcessingMask, setIsProcessingMask] = useState<boolean>(false);

  // Position and lighting state
  const [posX, setPosX] = useState<number>(50);
  const [posY, setPosY] = useState<number>(50);
  const [scale, setScale] = useState<number>(0.6);
  const [rotation, setRotation] = useState<number>(0);
  const [lightingStyle, setLightingStyle] = useState<'warm-studio' | 'neon-cyberpunk' | 'minimalist-concrete' | 'dramatic-rim'>('warm-studio');

  const [composedUrl, setComposedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const result = event.target?.result as string;
      setProductImgSrc(result);
      setIsProcessingMask(true);

      try {
        const maskDataUrl = await createProductMaskFromImage(result);
        setMaskImgSrc(maskDataUrl);

        // Generate initial composite
        const comp = await compositeProductOnBackground(bgImageUrl, result, {
          x: posX,
          y: posY,
          scale,
          rotation,
        }, lightingStyle);
        setComposedUrl(comp);
      } catch (err) {
        console.error('Failed to create mask:', err);
      } finally {
        setIsProcessingMask(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateComposite = async () => {
    if (!productImgSrc || !bgImageUrl) return;
    try {
      const comp = await compositeProductOnBackground(bgImageUrl, productImgSrc, {
        x: posX,
        y: posY,
        scale,
        rotation,
      }, lightingStyle);
      setComposedUrl(comp);
    } catch (err) {
      console.error('Failed updating composite:', err);
    }
  };

  const handleDone = () => {
    if (composedUrl) {
      onApplyComposite(composedUrl);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full p-6 shadow-2xl relative space-y-5 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-slate-100">
                Real Product Placement & Studio Inpainting
              </h3>
              <p className="text-xs text-slate-400">
                Overlay your real product image onto AI-generated background scenes with natural studio shadows
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1 overflow-y-auto">
          {/* Left Column: Studio Canvas Preview */}
          <div className="md:col-span-7 flex flex-col items-center justify-center bg-slate-950 border border-slate-800 rounded-xl p-3 min-h-[320px] relative overflow-hidden">
            {composedUrl ? (
              <img
                src={composedUrl}
                alt="Product Inpainting Preview"
                className="max-h-[360px] w-auto object-contain rounded-lg shadow-2xl"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-6 space-y-3 text-slate-500">
                <ImageIcon className="w-12 h-12" />
                <p className="text-xs max-w-xs">Upload a product PNG image on the right panel to place it onto the AI scene.</p>
              </div>
            )}

            {isProcessingMask && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center gap-2 text-amber-400 text-xs font-semibold">
                <Sparkles className="w-5 h-5 animate-spin" />
                <span>Extracting Product Mask & Shadows...</span>
              </div>
            )}
          </div>

          {/* Right Column: Controls & File Upload */}
          <div className="md:col-span-5 space-y-4 flex flex-col justify-between">
            {/* Upload Button */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                1. Upload Real Product PNG (Transparent BG)
              </label>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/png, image/webp"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 px-4 rounded-xl border border-dashed border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10 text-amber-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <Upload className="w-4 h-4" />
                <span>{productImgSrc ? 'Change Product Image' : 'Select Product PNG Image'}</span>
              </button>
            </div>

            {/* Position & Scale Adjustments */}
            {productImgSrc && (
              <div className="space-y-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-slate-200 border-b border-slate-800 pb-2">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <span>Product Position & Lighting</span>
                </div>

                {/* Scale */}
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Scale (Size):</span>
                    <span className="font-mono">{Math.round(scale * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="1.2"
                    step="0.05"
                    value={scale}
                    onChange={(e) => {
                      setScale(parseFloat(e.target.value));
                      handleUpdateComposite();
                    }}
                    className="w-full accent-amber-500"
                  />
                </div>

                {/* Pos Y */}
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Vertical Offset:</span>
                    <span className="font-mono">{posY}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={posY}
                    onChange={(e) => {
                      setPosY(parseInt(e.target.value));
                      handleUpdateComposite();
                    }}
                    className="w-full accent-amber-500"
                  />
                </div>

                {/* Rotation */}
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Rotation:</span>
                    <span className="font-mono">{rotation}°</span>
                  </div>
                  <input
                    type="range"
                    min="-45"
                    max="45"
                    value={rotation}
                    onChange={(e) => {
                      setRotation(parseInt(e.target.value));
                      handleUpdateComposite();
                    }}
                    className="w-full accent-amber-500"
                  />
                </div>

                {/* Lighting Style */}
                <div>
                  <label className="block text-slate-400 mb-1.5">Studio Light Tint:</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'warm-studio', label: 'Warm Amber' },
                      { id: 'neon-cyberpunk', label: 'Neon Cyber' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setLightingStyle(opt.id as any);
                          handleUpdateComposite();
                        }}
                        className={`py-1.5 px-2 rounded-lg text-[11px] font-medium border text-center transition-all ${
                          lightingStyle === opt.id
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Apply Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleDone}
                disabled={!composedUrl}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 disabled:opacity-50 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Apply Product Composite Ad</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
