import React, { useState } from 'react';
import { Sparkles, Wand2, Image, Monitor, Smartphone, LayoutGrid, Cpu } from 'lucide-react';
import { AdGenerationRequest } from '../types';

interface PromptFormProps {
  onSubmit: (request: AdGenerationRequest) => void;
  isLoading: boolean;
  prompt: string;
  setPrompt: (p: string) => void;
  onEnhancePrompt: () => void;
  isEnhancing: boolean;
}

export const PromptForm: React.FC<PromptFormProps> = ({
  onSubmit,
  isLoading,
  prompt,
  setPrompt,
  onEnhancePrompt,
  isEnhancing,
}) => {
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3'>('1:1');
  const [mode, setMode] = useState<'auto' | 'replicate' | 'gemini'>('auto');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onSubmit({
      prompt,
      aspectRatio,
      mode,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
      {/* Label and Enhancer */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-slate-200">
            તમારો પ્રોમ્પ્ટ અહીં લખો / Ad Prompt Text:
          </label>
          <button
            type="button"
            onClick={onEnhancePrompt}
            disabled={isEnhancing || !prompt.trim()}
            className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 disabled:opacity-50 transition-all"
            title="Enhance prompt with cinematic luxury details"
          >
            <Wand2 className={`w-3.5 h-3.5 ${isEnhancing ? 'animate-spin' : ''}`} />
            {isEnhancing ? 'Enhancing...' : 'AI Prompt Magic'}
          </button>
        </div>

        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            placeholder="A high-end cinematic advertisement photo of..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500/80 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all resize-none font-sans"
          />
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 border-t border-slate-800/80">
        {/* Aspect Ratio Picker */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-2">
            Aspect Ratio (પરિમાણ):
          </label>
          <div className="grid grid-cols-4 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {[
              { id: '1:1', label: '1:1 Square', icon: LayoutGrid },
              { id: '16:9', label: '16:9 Wide', icon: Monitor },
              { id: '9:16', label: '9:16 Story', icon: Smartphone },
              { id: '4:3', label: '4:3 Standard', icon: Image },
            ].map((item) => {
              const Icon = item.icon;
              const isSelected = aspectRatio === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setAspectRatio(item.id as any)}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 mb-1" />
                  <span>{item.id}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Model Mode Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-2">
            AI Generator Model:
          </label>
          <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {[
              { id: 'auto', label: 'Auto Best' },
              { id: 'replicate', label: 'Flux Schnell' },
              { id: 'gemini', label: 'Gemini Imagen' },
            ].map((item) => {
              const isSelected = mode === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setMode(item.id as any)}
                  className={`py-2 px-1 rounded-lg text-xs font-medium transition-all text-center ${
                    isSelected
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        type="submit"
        disabled={isLoading || !prompt.trim()}
        className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-display font-extrabold text-base tracking-wide shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
      >
        <Sparkles className={`w-5 h-5 fill-slate-950 ${isLoading ? 'animate-bounce' : ''}`} />
        <span>{isLoading ? 'તમારો AI Ad બન્યા કરે છે... (Generating)' : 'Generate Premium Ad ✨'}</span>
      </button>
    </form>
  );
};
