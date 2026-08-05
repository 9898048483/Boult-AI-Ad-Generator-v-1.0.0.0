import React, { useState, useEffect } from 'react';
import {
  Type,
  Tag,
  Sliders,
  Download,
  Eye,
  EyeOff,
  Trash2,
  Sparkles,
  Layers,
  LayoutGrid,
  RotateCw,
  Sun,
  ShieldCheck,
  ImagePlus
} from 'lucide-react';
import {
  CanvasLayer,
  ImageAdjustments,
  renderAdToCanvas,
  batchExportCanvas,
  AspectRatioType,
  ASPECT_RATIO_PRESETS,
} from '../utils/canvasExporter';

interface CanvasEditorProps {
  bgImageUrl?: string;
  onSaveOutput?: (imageUrl: string) => void;
  className?: string;
}

export const CanvasEditor: React.FC<CanvasEditorProps> = ({
  bgImageUrl = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1024&q=80',
  onSaveOutput,
  className = '',
}) => {
  // Layer Stack State
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

  // Canvas preview URL
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const activeLayer = layers.find((l) => l.id === activeLayerId);

  // Re-render canvas preview whenever state changes
  useEffect(() => {
    const preset = ASPECT_RATIO_PRESETS.find((p) => p.id === previewAspect) || ASPECT_RATIO_PRESETS[0];

    renderAdToCanvas(bgImageUrl, layers, adjustments, preset.width, preset.height)
      .then((canvas) => {
        setPreviewDataUrl(canvas.toDataURL('image/png'));
      })
      .catch((err) => console.error('Canvas render error:', err));
  }, [bgImageUrl, layers, adjustments, previewAspect]);

  // Layer Management Functions
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

  const handleExportBatch = async () => {
    if (selectedAspects.length === 0) return;
    setIsExporting(true);
    try {
      await batchExportCanvas(bgImageUrl, layers, adjustments, exportFormat, selectedAspects);
      if (previewDataUrl && onSaveOutput) {
        onSaveOutput(previewDataUrl);
      }
    } catch (err) {
      console.error('Batch export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4 ${className}`}>
      {/* Editor Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-slate-100">
              Interactive 2D Canvas Editor
            </h3>
            <p className="text-xs text-slate-400">
              Multi-layer brand composition, dynamic typography overlays & parallel batch export
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Stage Preview */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col items-center justify-between">
          <div className="flex items-center justify-between w-full border-b border-slate-800 pb-2 mb-2">
            <span className="text-[11px] font-semibold text-slate-400">Aspect Ratio Preview:</span>
            <div className="flex items-center gap-1">
              {ASPECT_RATIO_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPreviewAspect(p.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    previewAspect === p.id
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-900 border border-slate-800 text-slate-400'
                  }`}
                >
                  {p.id}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center p-2 min-h-[320px] max-h-[420px] w-full">
            {previewDataUrl ? (
              <img
                src={previewDataUrl}
                alt="2D Canvas Ad Preview"
                className="max-h-[380px] w-auto object-contain rounded-lg shadow-2xl border border-slate-800"
              />
            ) : (
              <div className="flex items-center gap-2 text-slate-500 text-xs animate-pulse">
                <Sparkles className="w-5 h-5" /> Rendering Canvas...
              </div>
            )}
          </div>

          {/* Quick Filter Sliders */}
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

        {/* Right Control Panel */}
        <div className="lg:col-span-5 space-y-3.5 flex flex-col justify-between">
          <div className="space-y-1.5">
            <span className="block text-[11px] font-semibold text-slate-400">Inject Layer Overlays:</span>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                onClick={handleAddTextLayer}
                className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium border border-slate-700 flex items-center justify-center gap-1 transition-colors"
              >
                <Type className="w-3.5 h-3.5 text-amber-400" />
                <span>Text</span>
              </button>
              <button
                onClick={handleAddPriceTag}
                className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium border border-slate-700 flex items-center justify-center gap-1 transition-colors"
              >
                <Tag className="w-3.5 h-3.5 text-emerald-400" />
                <span>Price</span>
              </button>
              <button
                onClick={handleAddLogoBadge}
                className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium border border-slate-700 flex items-center justify-center gap-1 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Emblem</span>
              </button>
            </div>
          </div>

          {/* Layer Stack */}
          <div className="bg-slate-950 rounded-xl border border-slate-800 p-2.5 space-y-2">
            <span className="block text-[11px] font-semibold text-slate-400">Active Layers:</span>
            <div className="space-y-1 max-h-[120px] overflow-y-auto text-xs">
              {layers.map((layer) => (
                <div
                  key={layer.id}
                  onClick={() => setActiveLayerId(layer.id)}
                  className={`p-2 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                    activeLayerId === layer.id
                      ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-semibold'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Layers className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span className="truncate">{layer.text || layer.type}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={(e) => toggleLayerVisibility(layer.id, e)} className="p-1 hover:text-amber-400 text-slate-500">
                      {layer.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={(e) => deleteLayer(layer.id, e)} className="p-1 hover:text-rose-400 text-slate-500">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inspector */}
          {activeLayer && (
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-xs">
              <span className="block font-semibold text-slate-200 border-b border-slate-800 pb-1">
                Property Inspector
              </span>

              {(activeLayer.type === 'text' || activeLayer.type === 'badge' || activeLayer.type === 'price') && (
                <div>
                  <label className="block text-slate-400 mb-0.5">Content:</label>
                  <input
                    type="text"
                    value={activeLayer.text || ''}
                    onChange={(e) => updateActiveLayer({ text: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-100 font-semibold focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}

              <div>
                <div className="flex justify-between text-slate-400 mb-0.5">
                  <span>Position X:</span>
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

              <div>
                <div className="flex justify-between text-slate-400 mb-0.5">
                  <span>Position Y:</span>
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
            </div>
          )}

          {/* Batch Export */}
          <button
            onClick={handleExportBatch}
            disabled={isExporting || selectedAspects.length === 0}
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 disabled:opacity-50 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Exporting Batch Files...' : 'Batch Export (PNG/WebP/PDF)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
