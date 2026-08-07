import React, { useState } from 'react';
import { Sparkles, Layers, ImagePlus, LayoutGrid, LogOut, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  userProfile: UserProfile | null;
  hasReplicate: boolean;
  hasGemini: boolean;
  onSignInWithGoogle: () => void;
  onSignOut: () => void;
  onOpenSettings: () => void;
  onOpenBatch: () => void;
  onOpenInpainting: () => void;
  onOpenCanvasStudio: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  userProfile,
  hasReplicate,
  hasGemini,
  onSignInWithGoogle,
  onSignOut,
  onOpenSettings,
  onOpenBatch,
  onOpenInpainting,
  onOpenCanvasStudio,
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
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
            <p className="text-xs text-slate-400 hidden sm:block">Define Your Vibe • High-End Cinematic Ad Generator</p>
          </div>
        </div>

        {/* Navigation & Auth Actions */}
        <div className="flex items-center gap-2.5">
          {/* Action Buttons */}
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

          {/* Account Settings / Google Auth State */}
          {userProfile ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <button
                onClick={onOpenSettings}
                className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition-all text-left"
                title="Google Account & System Settings"
              >
                {!imgError && userProfile.picture ? (
                  <img
                    src={userProfile.picture}
                    alt={userProfile.name}
                    onError={() => setImgError(true)}
                    className="w-7 h-7 rounded-full border border-amber-400/50 object-cover shrink-0"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center shrink-0">
                    {userProfile.name?.charAt(0) || 'G'}
                  </div>
                )}
                <div className="hidden md:block pr-1">
                  <div className="text-xs font-bold text-slate-100 leading-none truncate max-w-[110px]">
                    {userProfile.name}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>Google Signed In</span>
                  </div>
                </div>
              </button>

              <button
                onClick={onSignOut}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
                title="Sign Out from Google"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onSignInWithGoogle}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign in with Google</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
