import React, { useState } from 'react';
import { Sparkles, Zap, Activity, Crown, Watch, Music, ArrowRight, Filter } from 'lucide-react';
import { PRESET_PROMPTS } from '../data/presets';
import { PresetPrompt } from '../types';

interface PresetSelectorProps {
  onSelectPreset: (preset: PresetPrompt) => void;
  selectedId?: string;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Sparkles,
  Zap,
  Activity,
  Crown,
  Watch,
  Music,
};

const FILTER_CATEGORIES = ['All', 'Indoor', 'Outdoor', 'Product-Focused'] as const;

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  onSelectPreset,
  selectedId,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filteredPresets = PRESET_PROMPTS.filter((preset) => {
    if (activeCategory === 'All') return true;
    return preset.filterCategory === activeCategory;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Header and Category Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-800/80">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>BOULT Ad Style Templates (પ્રોમ્પ્ટ ટેમ્પલેટ્સ)</span>
        </h3>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0 mr-1" />
          {FILTER_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`text-xs font-semibold px-3 py-1 rounded-lg border transition-all shrink-0 ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-850'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {filteredPresets.map((preset) => {
          const IconComponent = ICON_MAP[preset.iconName] || Sparkles;
          const isSelected = selectedId === preset.id;

          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                isSelected
                  ? 'bg-amber-500/10 border-amber-500/50 text-amber-200 ring-1 ring-amber-500/30'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  {preset.category}
                </span>
                <IconComponent className="w-4 h-4 text-amber-400" />
              </div>

              <div>
                <h4 className="font-display font-semibold text-xs text-slate-200">{preset.title}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                  {preset.prompt}
                </p>
              </div>

              <div className="flex items-center text-[10px] text-amber-400 font-bold gap-1 pt-1">
                <span>Use Template</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
