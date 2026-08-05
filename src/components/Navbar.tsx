import React from 'react';
import { Sparkles, Key, Layers, ImagePlus, LayoutGrid } from 'lucide-react';

interface NavbarProps {
  hasReplicate: boolean;
  hasGemini: boolean;
  onOpenSettings: () => void;
  onOpenBatch: () => void;
  onOpenInpainting: () => void;
  onOpenCanvasStudio: () => void;
  isLoadingConfig: boolean;
  onRefreshConfig: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  hasReplicate,
  hasGemini,
  onOpenSettings,
  onOpenBatch,
  onOpenInpainting,
  onOpenCanvasStudio,
  isLoadingConfig,
  onRefreshConfig,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-orange-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
            <Sparkles className="w-6 h-6 fill-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-amber-200">
                BOULT
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                AI AD STUDIO
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Define Your Vibe • High-End Cinematic Image Generator</p>
          </div>
        </div>

        {/* API Status & Config */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs">
            <span className="text-slate-400">Backends:</span>
            <span className={`inline-flex items-center gap-1 font-medium ${hasReplicate ? 'text-emerald-400' : 'text-slate-500'}`}>
              <span className={`w-2 h-2 rounded-full ${hasReplicate ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
              Replicate
            </span>
            <span className="text-slate-600">|</span>
            <span className={`inline-flex items-center gap-1 font-medium ${hasGemini ? 'text-purple-400' : 'text-slate-500'}`}>
              <span className={`w-2 h-2 rounded-full ${hasGemini ? 'bg-purple-400' : 'bg-slate-600'}`}></span>
              Gemini
            </span>
          </div>

          <button
            onClick={onOpenCanvasStudio}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 transition-colors"
            title="2D Canvas Overlay Studio"
          >
            <LayoutGrid className="w-4 h-4 text-sky-400" />
            <span className="hidden sm:inline">2D Canvas Editor</span>
          </button>

          <button
            onClick={onOpenInpainting}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-colors"
            title="Real Product Placement Studio"
          >
            <ImagePlus className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Product Studio</span>
          </button>

          <button
            onClick={onOpenBatch}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors"
            title="Batch Ad Generator"
          >
            <Layers className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Batch Suite</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors"
            title="Configure API Keys"
          >
            <Key className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">API Config</span>
          </button>
        </div>
      </div>
    </header>
  );
};


