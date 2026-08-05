import React, { useState } from 'react';
import { Download, Maximize2, Sparkles, Image as ImageIcon, AlertCircle, Key, LayoutGrid, Layers } from 'lucide-react';
import { AdHistoryItem } from '../types';

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

  const handleDownload = () => {
    if (!currentAd) return;
    const link = document.createElement('a');
    link.href = currentAd.imageUrl;
    link.download = `BOULT-AI-Ad-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                onClick={handleDownload}
                className="p-3 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all shadow-xl"
                title="Download High Quality Ad Image"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Caption & Details Bar */}
          <div className="w-full mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
            <span className="truncate max-w-[240px]" title={currentAd.prompt}>
              {currentAd.prompt}
            </span>

            <div className="flex items-center gap-3 shrink-0">
              {onOpenCanvasStudio && (
                <button
                  onClick={onOpenCanvasStudio}
                  className="flex items-center gap-1 font-bold text-sky-400 hover:text-sky-300 transition-colors"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>2D Canvas Editor</span>
                </button>
              )}

              <button
                onClick={handleDownload}
                className="flex items-center gap-1 font-bold text-amber-400 hover:text-amber-300 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
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
                onClick={handleDownload}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <Download className="w-4 h-4" />
                <span>Download Image</span>
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

