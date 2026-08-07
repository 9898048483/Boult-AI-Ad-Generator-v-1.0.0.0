import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Type,
  Tag,
  Sliders,
  Download,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  Sparkles,
  Layers,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  Sun,
  ShieldAlert,
  LayoutGrid,
  Loader2
} from 'lucide-react';
import {
  CanvasLayer,
  ImageAdjustments,
  renderAdToCanvas,
  batchExportCanvas,
  AspectRatioType,
  ASPECT_RATIO_PRESETS,
} from '../utils/canvasExporter';
import { saveToAndroidGallery } from '../utils/androidStorage';
import { ExportWorkerPayload, ExportWorkerResponse } from '../workers/canvasExport.worker';

interface CanvasStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  bgImageUrl?: string;
  onSaveToGallery?: (imageUrl: string) => void;
}

export const CanvasStudioModal: React.FC<CanvasStudioModalProps> = ({
  isOpen,
  onClose,
  bgImageUrl = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1024&q=80',
  onSaveToGallery,
}) => {
  // Layer State
  const [layers, setLayers] = useState<CanvasLayer[]>([
    {
      id: 'layer_logo_1',
      type: 'brand-logo',
      x: 20,
      y: 12,
      fontSize: 24,
      color: '#f59e0b',
      isVisible: true,
      shadowColor: 'rgba(0,0,0,0.8)',
      shadowBlur: 10,
    },
    {
      id: 'layer_title_1',
      type: 'text',
      text: 'BOULT AUDIO PRO',
      x: 50,
      y: 78,
      fontSize: 44,
      fontWeight: '800',
      color: '#ffffff',
      strokeColor: '#000000',
      strokeWidth: 4,
      shadowColor: 'rgba(0, 0, 0, 0.9)',
      shadowBlur: 15,
      isVisible: true,
    },
    {
      id: 'layer_badge_1',
      type: 'badge',
      text: '⚡ 50% OFF TODAY',
      x: 80,
      y: 14,
      fontSize: 26,
      color: '#ffffff',
      badgeStyle: 'discount-pill',
      isVisible: true,
    },
  ]);

  const [activeLayerId, setActiveLayerId] = useState<string>('layer_title_1');

  // Image Filter Adjustments
  const [adjustments, setAdjustments] = useState<ImageAdjustments>({
    brightness: 0,
    contrast: 10,
    saturation: 15,
    vignette: 25,
    blur: 0,
  });

  // Export options
  const [exportFormat, setExportFormat] = useState<'png' | 'webp' | 'pdf'>('png');
  const [selectedAspects, setSelectedAspects] = useState<AspectRatioType[]>(['1:1', '9:16', '16:9', '4:3']);
  const [previewAspect, setPreviewAspect] = useState<AspectRatioType>('1:1');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  // Canvas ref & preview URL
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const activeLayer = layers.find((l) => l.id === activeLayerId);

  // Re-render canvas preview whenever inputs change
  useEffect(() => {
    if (!isOpen) return;

    const preset = ASPECT_RATIO_PRESETS.find((p) => p.id === previewAspect) || ASPECT_RATIO_PRESETS[0];

    renderAdToCanvas(bgImageUrl, layers, adjustments, preset.width, preset.height)
      .then((canvas) => {
        setPreviewDataUrl(canvas.toDataURL('image/png'));
      })
      .catch((err) => console.error('Error rendering preview canvas:', err));
  }, [isOpen, bgImageUrl, layers, adjustments, previewAspect]);

  if (!isOpen) return null;

  // Add new layers
  const handleAddTextLayer = () => {
    const newLayer: CanvasLayer = {
      id: `layer_text_${Date.now()}`,
      type: 'text',
      text: 'SPECIAL OFFER',
      x: 50,
      y: 50,
      fontSize: 36,
      fontWeight: 'bold',
      color: '#f59e0b',
      strokeColor: '#020617',
      strokeWidth: 3,
      shadowColor: 'rgba(0,0,0,0.8)',
      shadowBlur: 10,
      isVisible: true,
    };
    setLayers([...layers, newLayer]);
    setActiveLayerId(newLayer.id);
  };

  const handleAddPriceTag = () => {
    const newLayer: CanvasLayer = {
      id: `layer_price_${Date.now()}`,
      type: 'price',
      text: '₹1,999',
      subtext: 'M.R.P: ₹4,999',
      x: 50,
      y: 88,
      fontSize: 28,
      color: '#10b981',
      isVisible: true,
    };
    setLayers([...layers, newLayer]);
    setActiveLayerId(newLayer.id);
  };

  const handleAddLogoBadge = () => {
    const newLayer: CanvasLayer = {
      id: `layer_logo_${Date.now()}`,
      type: 'brand-logo',
      x: 18,
      y: 12,
      fontSize: 24,
      color: '#f59e0b',
      isVisible: true,
    };
    setLayers([...layers, newLayer]);
    setActiveLayerId(newLayer.id);
  };

  const updateActiveLayer = (updates: Partial<CanvasLayer>) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === activeLayerId ? { ...l, ...updates } : l))
    );
  };

  const toggleLayerVisibility = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, isVisible: !l.isVisible } : l)));
  };

  const deleteLayer = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLayers((prev) => prev.filter((l) => l.id !== id));
    if (activeLayerId === id) {
      const remaining = layers.filter((l) => l.id !== id);
      setActiveLayerId(remaining.length > 0 ? remaining[0].id : '');
    }
  };

  // Trigger batch export with Web Worker & Native Storage
  const handleExportBatch = async () => {
    if (selectedAspects.length === 0) return;
    setIsExporting(true);
    setExportProgress(15);
    setToastNotification(null);

    try {
      const titleLayer = layers.find((l) => l.type === 'text') || layers[0];
      const taglineLayer = layers.find((l) => l.type === 'badge' || l.type === 'price');

      const worker = new Worker(new URL('../workers/canvasExport.worker.ts', import.meta.url), { type: 'module' });

      const payload: ExportWorkerPayload = {
        id: `export_${Date.now()}`,
        title: titleLayer?.text || 'BOULT AUDIO PRO',
        tagline: taglineLayer?.text || 'Redefining Sound Standards',
        brandName: 'BOULT AI',
        imageUrl: bgImageUrl,
        ratios: selectedAspects as any,
        format: exportFormat,
        quality: 0.95,
        accentColor: '#f59e0b',
      };

      setExportProgress(45);

      worker.postMessage(payload);

      worker.onmessage = async (event: MessageEvent<ExportWorkerResponse>) => {
        const { status, outputs, error } = event.data;
        setExportProgress(85);

        if (status === 'success' && outputs && outputs.length > 0) {
          let savedCount = 0;
          let lastPath = '';

          for (const item of outputs) {
            const fileName = `BOULT_Ad_${item.ratio.replace(':', 'x')}_${Date.now()}.${exportFormat === 'pdf' ? 'pdf' : exportFormat}`;
            const res = await saveToAndroidGallery(item.dataUrl, fileName);
            if (res.success) {
              savedCount++;
              if (res.path) lastPath = res.path;
            }
          }

          setExportProgress(100);
          const toastMsg = lastPath
            ? `Exported ${savedCount} ratios natively to ${lastPath}`
            : `Exported ${savedCount} multi-ratio campaign assets!`;
          setToastNotification(toastMsg);

          if (previewDataUrl && onSaveToGallery) {
            onSaveToGallery(previewDataUrl);
          }
        } else {
          console.warn('Worker error fallback:', error);
          await batchExportCanvas(bgImageUrl, layers, adjustments, exportFormat, selectedAspects);
          setToastNotification('Multi-ratio export completed successfully!');
        }

        setTimeout(() => {
          setIsExporting(false);
          setExportProgress(0);
        }, 600);

        worker.terminate();
      };

      worker.onerror = async (err) => {
        console.warn('Worker standard fallback trigger:', err);
        await batchExportCanvas(bgImageUrl, layers, adjustments, exportFormat, selectedAspects);
        setToastNotification('Multi-ratio export completed successfully!');
        setIsExporting(false);
        setExportProgress(0);
        worker.terminate();
      };
    } catch (err) {
      console.error('Batch export failed:', err);
      await batchExportCanvas(bgImageUrl, layers, adjustments, exportFormat, selectedAspects);
      setToastNotification('Multi-ratio export completed successfully!');
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-6xl w-full p-5 shadow-2xl relative space-y-4 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-slate-100">
                2D Canvas Studio & Multi-Layer Brand Editor
              </h3>
              <p className="text-xs text-slate-400">
                Overlay brand assets, dynamic text badges, price tags & batch export multi-ratio campaigns
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

        {/* Toast Notification Banner */}
        {toastNotification && (
          <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-xs text-emerald-300 font-semibold animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">{toastNotification}</span>
          </div>
        )}

        {/* Studio Grid Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 overflow-y-auto min-h-0 relative">
          {/* High-Tech Worker Spinner Overlay */}
          {isExporting && (
            <div className="absolute inset-0 z-40 bg-slate-950/85 backdrop-blur-md rounded-xl flex flex-col items-center justify-center p-6 space-y-4 border border-amber-500/30">
              <div className="relative flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-amber-400 animate-spin" />
                <span className="absolute font-mono text-xs font-black text-amber-300">{exportProgress}%</span>
              </div>
              <div className="text-center space-y-1">
                <h4 className="font-display font-bold text-sm text-slate-100">
                  OffscreenCanvas Worker Engine Active
                </h4>
                <p className="text-xs text-slate-400">
                  Rendering multi-ratio (1:1, 9:16, 16:9, 4:3) images in background worker thread...
                </p>
              </div>
              <div className="w-64 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300"
                  style={{ width: `${exportProgress}%` }}
                ></div>
              </div>
            </div>
          )}
          {/* Left Panel: Preview Canvas */}
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col items-center justify-between relative overflow-hidden">
            {/* Aspect Ratio Preview Toggles */}
            <div className="flex items-center justify-between w-full border-b border-slate-800/80 pb-2 mb-2">
              <span className="text-[11px] font-semibold text-slate-400">Preview Aspect Ratio:</span>
              <div className="flex items-center gap-1.5">
                {ASPECT_RATIO_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setPreviewAspect(preset.id as any)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                      previewAspect === preset.id
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {preset.id}
                  </button>
                ))}
              </div>
            </div>

            {/* Rendered Live Canvas Image */}
            <div className="flex-1 flex items-center justify-center p-2 min-h-[340px] max-h-[440px] w-full relative">
              {previewDataUrl ? (
                <img
                  src={previewDataUrl}
                  alt="Live Canvas Preview"
                  className="max-h-[400px] w-auto object-contain rounded-lg shadow-2xl border border-slate-800"
                />
              ) : (
                <div className="flex items-center gap-2 text-slate-500 text-xs animate-pulse">
                  <Sparkles className="w-5 h-5" /> Rendering Canvas...
                </div>
              )}
            </div>

            {/* Quick Filter Sliders Bar */}
            <div className="w-full bg-slate-900/90 border border-slate-800/80 rounded-lg p-2.5 mt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
              <div>
                <div className="flex justify-between text-slate-400 mb-0.5">
                  <span>Brightness:</span>
                  <span className="font-mono text-slate-200">{adjustments.brightness}</span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={adjustments.brightness}
                  onChange={(e) => setAdjustments({ ...adjustments, brightness: parseInt(e.target.value) })}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-0.5">
                  <span>Contrast:</span>
                  <span className="font-mono text-slate-200">{adjustments.contrast}</span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={adjustments.contrast}
                  onChange={(e) => setAdjustments({ ...adjustments, contrast: parseInt(e.target.value) })}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-0.5">
                  <span>Saturate:</span>
                  <span className="font-mono text-slate-200">{adjustments.saturation}</span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={adjustments.saturation}
                  onChange={(e) => setAdjustments({ ...adjustments, saturation: parseInt(e.target.value) })}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-0.5">
                  <span>Vignette:</span>
                  <span className="font-mono text-slate-200">{adjustments.vignette}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="80"
                  value={adjustments.vignette}
                  onChange={(e) => setAdjustments({ ...adjustments, vignette: parseInt(e.target.value) })}
                  className="w-full accent-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Right Panel: Layer Stack & Properties Editor */}
          <div className="lg:col-span-5 space-y-3.5 flex flex-col justify-between overflow-y-auto">
            {/* Add Layer Quick Buttons */}
            <div className="space-y-1.5">
              <span className="block text-[11px] font-semibold text-slate-400">Add Brand Overlay Layer:</span>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  onClick={handleAddTextLayer}
                  className="py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Type className="w-3.5 h-3.5 text-amber-400" />
                  <span>Text Overlay</span>
                </button>
                <button
                  onClick={handleAddPriceTag}
                  className="py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Tag className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Price Callout</span>
                </button>
                <button
                  onClick={handleAddLogoBadge}
                  className="py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>BOULT Emblem</span>
                </button>
              </div>
            </div>

            {/* Layer Stack Selector */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-2.5 space-y-2">
              <span className="block text-[11px] font-semibold text-slate-400">Layers Stack:</span>
              <div className="space-y-1 max-h-[140px] overflow-y-auto pr-1 text-xs">
                {layers.map((layer) => (
                  <div
                    key={layer.id}
                    onClick={() => setActiveLayerId(layer.id)}
                    className={`p-2 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                      activeLayerId === layer.id
                        ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-semibold'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Layers className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                      <span className="truncate">
                        {layer.type === 'text' && (layer.text || 'Text Layer')}
                        {layer.type === 'badge' && (layer.text || 'Discount Badge')}
                        {layer.type === 'price' && (layer.text || 'Price Tag')}
                        {layer.type === 'brand-logo' && 'BOULT AI Emblem'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => toggleLayerVisibility(layer.id, e)}
                        className="p-1 hover:text-amber-400 text-slate-500"
                        title="Toggle Visibility"
                      >
                        {layer.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={(e) => deleteLayer(layer.id, e)}
                        className="p-1 hover:text-rose-400 text-slate-500"
                        title="Delete Layer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Layer Inspector Controls */}
            {activeLayer && (
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2.5 text-xs">
                <span className="block font-semibold text-slate-200 border-b border-slate-800 pb-1.5">
                  Inspect Layer Properties
                </span>

                {/* Text Content */}
                {(activeLayer.type === 'text' || activeLayer.type === 'badge' || activeLayer.type === 'price') && (
                  <div>
                    <label className="block text-slate-400 mb-1">Text Content:</label>
                    <input
                      type="text"
                      value={activeLayer.text || ''}
                      onChange={(e) => updateActiveLayer({ text: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-lg px-2.5 py-1.5 text-slate-100 font-semibold focus:outline-none"
                    />
                  </div>
                )}

                {/* Subtext Content for Price */}
                {activeLayer.type === 'price' && (
                  <div>
                    <label className="block text-slate-400 mb-1">M.R.P / Subtext:</label>
                    <input
                      type="text"
                      value={activeLayer.subtext || ''}
                      onChange={(e) => updateActiveLayer({ subtext: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-lg px-2.5 py-1.5 text-slate-100 font-semibold focus:outline-none"
                    />
                  </div>
                )}

                {/* Horizontal Position X */}
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Horizontal Position (X):</span>
                    <span className="font-mono text-slate-200">{activeLayer.x}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="95"
                    value={activeLayer.x}
                    onChange={(e) => updateActiveLayer({ x: parseInt(e.target.value) })}
                    className="w-full accent-amber-500"
                  />
                </div>

                {/* Vertical Position Y */}
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Vertical Position (Y):</span>
                    <span className="font-mono text-slate-200">{activeLayer.y}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="95"
                    value={activeLayer.y}
                    onChange={(e) => updateActiveLayer({ y: parseInt(e.target.value) })}
                    className="w-full accent-amber-500"
                  />
                </div>

                {/* Font Size */}
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Scale / Font Size:</span>
                    <span className="font-mono text-slate-200">{activeLayer.fontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="16"
                    max="80"
                    value={activeLayer.fontSize}
                    onChange={(e) => updateActiveLayer({ fontSize: parseInt(e.target.value) })}
                    className="w-full accent-amber-500"
                  />
                </div>
              </div>
            )}

            {/* Batch Export Options */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2.5 text-xs">
              <span className="block font-semibold text-slate-200">Multi-Ratio Batch Export:</span>

              <div className="flex items-center justify-between text-slate-400">
                <span>Ratios to Generate:</span>
                <div className="flex gap-1.5">
                  {ASPECT_RATIO_PRESETS.map((p) => (
                    <label key={p.id} className="inline-flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedAspects.includes(p.id as any)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAspects([...selectedAspects, p.id as any]);
                          } else {
                            setSelectedAspects(selectedAspects.filter((a) => a !== p.id));
                          }
                        }}
                        className="accent-amber-500"
                      />
                      <span className="text-[11px] text-slate-300 font-mono">{p.id}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-slate-400">
                <span>Format:</span>
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value as any)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 font-semibold"
                >
                  <option value="png">PNG (High Quality)</option>
                  <option value="webp">WebP (Compressed)</option>
                  <option value="pdf">PDF Document (All Ratios)</option>
                </select>
              </div>

              <button
                onClick={handleExportBatch}
                disabled={isExporting || selectedAspects.length === 0}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 disabled:opacity-50 transition-all mt-1"
              >
                <Download className="w-4 h-4" />
                <span>{isExporting ? 'Generating Batch Exports...' : 'Export Selected Ratios Natively'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
