import React, { useState } from 'react';
import { Download, Maximize2, Sparkles, Image as ImageIcon, AlertCircle, Key, LayoutGrid, Layers, FileImage } from 'lucide-react';
import { AdHistoryItem } from '../types';
import { saveImageNative } from '../utils/nativeFileSystem';

interface ImageDisplayProps {
  currentAd: AdHistoryItem | null;
  isLoading: boolean;
  error: string | null;
  onOpenSettings: () => void;
  onOpenCanvasStudio?: () => void;
  onUseDemoKey?: () => void;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({
  currentAd,
  isLoading,
  error,
  onOpenSettings,
  onOpenCanvasStudio,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPNG = async () => {
    if (!currentAd) return;
    setIsExporting(true);

    try {
      const filename = `BOULT-AI-Ad-${Date.now()}.png`;

      // If imageUrl is a PNG base64 string, export directly
      if (currentAd.imageUrl.startsWith('data:image/png')) {
        await saveImageNative(currentAd.imageUrl, filename);
      } else {
        // Draw onto HTML Canvas to convert to guaranteed PNG format
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = currentAd.imageUrl;

        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width || 1024;
        canvas.height = img.naturalHeight || img.height || 1024;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const pngDataUrl = canvas.toDataURL('image/png');
          await saveImageNative(pngDataUrl, filename);
        } else {
          await saveImageNative(currentAd.imageUrl, filename);
        }
      }
    } catch (err) {
      console.warn('Canvas PNG export fallback:', err);
      const filename = `BOULT-AI-Ad-${Date.now()}.png`;
      await saveImageNative(currentAd.imageUrl, filename);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col items-center justify-center min-h-[420px] relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Label */}
      <div className="w-full flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-slate-200">
            તમારી AI જનરેટેડ એડ (Generated Ad Result)
          </h3>
        </div>
        {currentAd && (
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            {currentAd.provider}
          </span>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border border-amber-500/40 flex items-center justify-center animate-pulse">
              <Sparkles className="w-10 h-10 text-amber-400 animate-spin" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping"></span>
            </div>
          </div>
          <div>
            <h4 className="font-display font-bold text-lg text-amber-400">Rendering AI Masterpiece...</h4>
            <p className="text-xs text-slate-400 max-w-xs mt-1">
              Synthesizing lighting, typography, and BOULT audio gear aesthetics.
            </p>
          </div>
        </div>
      )}

      {/* Error / Key Setup State */}
      {!isLoading && error && (
        <div className="flex flex-col items-center justify-center py-10 px-4 text-center max-w-md">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h4 className="font-display font-bold text-base text-rose-300 mb-1">API Key Required / Generation Alert</h4>
          <p className="text-xs text-slate-400 mb-4">{error}</p>
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 hover:bg-amber-400 transition-all"
          >
            <Key className="w-4 h-4" />
            <span>Configure Replicate / Gemini Token</span>
          </button>
        </div>
      )}

      {/* Empty Initial State */}
      {!isLoading && !error && !currentAd && (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-500">
            <Layers className="w-8 h-8" />
          </div>
          <div>
            <h4 className="font-display font-semibold text-slate-300">Ready to Generate</h4>
            <p className="text-xs text-slate-500 max-w-xs mt-1">
              Enter your ad idea or choose a preset template on the left, then click Generate!
            </p>
          </div>
        </div>
      )}

      {/* Image Display */}
      {!isLoading && currentAd && (
        <div className="w-full flex flex-col items-center">
          <div className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-950 max-h-[500px] flex items-center justify-center">
            <img
              src={currentAd.imageUrl}
              alt={currentAd.prompt}
              className="max-h-[480px] w-auto object-contain rounded-xl transition-transform duration-300 group-hover:scale-[1.01]"
            />

            {/* Hover Actions */}
            <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-xs">
              <button
                onClick={() => setIsFullscreen(true)}
                className="p-3 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-100 border border-slate-700 transition-all shadow-xl"
                title="View Fullscreen"
              >
                <Maximize2 className="w-5 h-5 text-amber-400" />
              </button>

              {onOpenCanvasStudio && (
                <button
                  onClick={onOpenCanvasStudio}
                  className="p-3 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold transition-all shadow-xl"
                  title="Customize in 2D Canvas Editor"
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
              )}

              <button
                onClick={handleExportPNG}
                disabled={isExporting}
                className="px-4 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xl active:scale-95 disabled:opacity-50"
                title="Export image as PNG to local machine"
              >
                <Download className="w-4 h-4" />
                <span>{isExporting ? 'Exporting...' : 'Export to PNG'}</span>
              </button>
            </div>
          </div>

          {/* Quick Caption & Details Bar */}
          <div className="w-full mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 flex items-center justify-between text-xs text-slate-400 gap-3">
            <span className="truncate max-w-[200px] sm:max-w-[300px]" title={currentAd.prompt}>
              {currentAd.prompt}
            </span>

            <div className="flex items-center gap-2.5 shrink-0">
              {onOpenCanvasStudio && (
                <button
                  onClick={onOpenCanvasStudio}
                  className="flex items-center gap-1.5 font-bold text-sky-400 hover:text-sky-300 bg-sky-500/10 hover:bg-sky-500/20 px-3 py-1.5 rounded-lg border border-sky-500/30 transition-all"
                  title="Edit image in 2D Canvas Studio"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>2D Canvas</span>
                </button>
              )}

              <button
                onClick={handleExportPNG}
                disabled={isExporting}
                className="flex items-center gap-1.5 font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 px-3.5 py-1.5 rounded-lg shadow-md shadow-amber-500/20 transition-all active:scale-95 disabled:opacity-50"
                title="Export image as PNG to local machine"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isExporting ? 'Exporting...' : 'Export to PNG'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isFullscreen && currentAd && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center">
            <img
              src={currentAd.imageUrl}
              alt={currentAd.prompt}
              className="max-h-[80vh] w-auto object-contain rounded-2xl border border-slate-800 shadow-2xl"
            />
            <div className="mt-4 flex items-center gap-4">
              {onOpenCanvasStudio && (
                <button
                  onClick={() => {
                    setIsFullscreen(false);
                    onOpenCanvasStudio();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-sky-500/20"
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span>Edit in 2D Canvas Studio</span>
                </button>
              )}
              <button
                onClick={handleExportPNG}
                disabled={isExporting}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{isExporting ? 'Exporting...' : 'Export to PNG'}</span>
              </button>
              <button
                onClick={() => setIsFullscreen(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

