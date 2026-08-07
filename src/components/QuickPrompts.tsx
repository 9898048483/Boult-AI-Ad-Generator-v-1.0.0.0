import React, { useState, useMemo } from 'react';
import {
  Zap,
  Bookmark,
  Search,
  ChevronRight,
  Sparkles,
  Layers,
  FolderOpen,
  SlidersHorizontal,
  Check,
  Building,
  Palette,
  Trees,
  Compass,
  Dumbbell,
  Gamepad2,
  Crown,
  Coffee,
  X,
  Copy,
  ExternalLink,
  Camera,
  Sun,
  Plus
} from 'lucide-react';
import { MAIN_CATEGORIES_DATA } from '../data/promptLibrary';
import { PromptItem, SubCategory, MainCategory } from '../types';

export { MAIN_CATEGORIES_DATA };

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Building,
  Palette,
  Trees,
  Compass,
  Dumbbell,
  Gamepad2,
  Crown,
  Coffee
};

// Studio Photography Lighting & Camera Modifier Chips inspired by Nano Banana Pro repo
const CAMERA_LIGHTING_MODIFIERS = [
  { label: '📸 35mm f/1.4 Lens', snippet: 'shot on 35mm f/1.4 prime lens, shallow depth of field, sharp foreground focus' },
  { label: '💡 Softbox Key Light', snippet: 'soft diffused softbox studio key lighting, balanced fill light, subtle drop shadows' },
  { label: '📐 45° Hero Angle', snippet: '45-degree isometric hero shot angle, dynamic composition, cinematic framing' },
  { label: '✨ Volumetric Fog', snippet: 'atmospheric volumetric haze, subtle light beams, raytraced shadows' },
  { label: '💎 High Key White', snippet: 'pure seamless high-key white studio background, clean commercial shadows' },
  { label: '🎞️ Anamorphic Flare', snippet: 'subtle horizontal anamorphic lens flare, cinematic color grade, 8k resolution' },
  { label: '🔍 100mm Macro Detail', snippet: 'extreme 100mm macro lens closeup, intricate surface texture details' },
  { label: '🌅 Golden Hour', snippet: 'warm directional golden hour sunlight, soft natural lens flare' },
  { label: '🌃 Neon Rim Light', snippet: 'dramatic dual-tone cyan and magenta neon rim lights, high contrast' }
];

interface QuickPromptsProps {
  onSelect?: (promptText: string) => void;
  onSelectPrompt?: (promptText: string) => void;
  currentPrompt?: string;
  className?: string;
}

export const QuickPrompts: React.FC<QuickPromptsProps> = ({
  onSelect,
  onSelectPrompt,
  currentPrompt = '',
  className = ''
}) => {
  const [selectedMainCat, setSelectedMainCat] = useState<string>(MAIN_CATEGORIES_DATA[0].id);
  const [selectedSubCat, setSelectedSubCat] = useState<string>(MAIN_CATEGORIES_DATA[0].subcategories[0].id);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isExpandedModal, setIsExpandedModal] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleTriggerSelect = (promptText: string) => {
    if (onSelect) onSelect(promptText);
    if (onSelectPrompt) onSelectPrompt(promptText);
    if (isExpandedModal) setIsExpandedModal(false);
  };

  const handleAppendModifier = (snippet: string) => {
    let newText = currentPrompt.trim();
    if (newText) {
      newText = `${newText}, ${snippet}`;
    } else {
      newText = snippet;
    }
    handleTriggerSelect(newText);
  };

  const handleCopyPrompt = (e: React.MouseEvent, id: string, text: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const currentMainCatObj = useMemo(() => {
    return MAIN_CATEGORIES_DATA.find((c) => c.id === selectedMainCat) || MAIN_CATEGORIES_DATA[0];
  }, [selectedMainCat]);

  const currentSubCatObj = useMemo(() => {
    return (
      currentMainCatObj.subcategories.find((sc) => sc.id === selectedSubCat) || currentMainCatObj.subcategories[0]
    );
  }, [currentMainCatObj, selectedSubCat]);

  // Global search across all categories
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const results: { mainName: string; subName: string; item: PromptItem }[] = [];

    MAIN_CATEGORIES_DATA.forEach((main) => {
      main.subcategories.forEach((sub) => {
        sub.prompts.forEach((p) => {
          if (
            p.label.toLowerCase().includes(q) ||
            p.prompt.toLowerCase().includes(q) ||
            p.tags?.some((t) => t.toLowerCase().includes(q))
          ) {
            results.push({
              mainName: main.name,
              subName: sub.name,
              item: p
            });
          }
        });
      });
    });

    return results;
  }, [searchQuery]);

  const handleMainCatChange = (mainId: string) => {
    setSelectedMainCat(mainId);
    const mainObj = MAIN_CATEGORIES_DATA.find((m) => m.id === mainId);
    if (mainObj && mainObj.subcategories.length > 0) {
      setSelectedSubCat(mainObj.subcategories[0].id);
    }
  };

  return (
    <div className={`space-y-2.5 ${className}`}>
      {/* Top Controls: Preset Dropdown & Quick Camera/Lighting Modifiers */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        {/* Dropdown for Quick Scene Selection */}
        <div className="relative w-full sm:w-auto flex items-center gap-2">
          <select
            onChange={(e) => {
              if (e.target.value) {
                handleTriggerSelect(e.target.value);
                e.target.value = '';
              }
            }}
            defaultValue=""
            className="w-full sm:w-auto text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-950 text-slate-200 border border-slate-800 hover:border-amber-500/50 focus:border-amber-500 outline-none transition-all cursor-pointer shadow-sm"
          >
            <option value="" disabled>
              ⚡ Select Quick Scene Preset...
            </option>
            {MAIN_CATEGORIES_DATA.map((main) => (
              <optgroup key={main.id} label={`📂 ${main.name}`} className="bg-slate-900 text-amber-400 font-bold">
                {main.subcategories.map((sub) =>
                  sub.prompts.map((p) => (
                    <option key={p.id} value={p.prompt} className="bg-slate-950 text-slate-200 font-normal">
                      {sub.name} → {p.label}
                    </option>
                  ))
                )}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Studio Lighting & Lens Quick Add Modifiers */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 no-scrollbar">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Camera className="w-3 h-3 text-amber-400" />
            Modifiers:
          </span>
          {CAMERA_LIGHTING_MODIFIERS.slice(0, 5).map((mod, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleAppendModifier(mod.snippet)}
              className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-950 hover:bg-slate-800 border border-slate-800/80 hover:border-amber-500/40 text-slate-300 hover:text-amber-300 transition-all shrink-0 flex items-center gap-0.5"
              title={`Append '${mod.snippet}' to prompt`}
            >
              <Plus className="w-2.5 h-2.5 text-amber-400" />
              <span>{mod.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Categories Navigation Tabs Bar */}
      <div className="bg-slate-950/90 border border-slate-800/80 rounded-xl p-2.5 space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            Scene Categories
          </span>
          <button
            type="button"
            onClick={() => setIsExpandedModal(!isExpandedModal)}
            className="text-[10px] font-semibold text-slate-400 hover:text-amber-400 underline transition-all"
          >
            {isExpandedModal ? 'Hide Explorer' : 'Browse Full Library'}
          </button>
        </div>

        {/* Main Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {MAIN_CATEGORIES_DATA.map((main) => {
            const IconComponent = ICON_MAP[main.iconName] || FolderOpen;
            const isActive = selectedMainCat === main.id;
            return (
              <button
                key={main.id}
                type="button"
                onClick={() => handleMainCatChange(main.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:bg-slate-850 hover:text-slate-200'
                }`}
              >
                <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{main.name}</span>
              </button>
            );
          })}
        </div>

        {/* Subcategories Selector Pills */}
        {currentMainCatObj && (
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1.5 border-t border-slate-800/60 no-scrollbar">
            <span className="text-[10px] text-slate-500 font-bold shrink-0 uppercase tracking-wider">Subcategory:</span>
            {currentMainCatObj.subcategories.map((sub) => {
              const isSubActive = selectedSubCat === sub.id;
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setSelectedSubCat(sub.id)}
                  className={`text-[11px] font-medium px-2.5 py-0.5 rounded-md transition-all whitespace-nowrap border ${
                    isSubActive
                      ? 'bg-slate-800 text-amber-300 border-amber-500/40 font-bold'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800/80 hover:text-slate-200 hover:bg-slate-850'
                  }`}
                >
                  {sub.name} ({sub.prompts.length})
                </button>
              );
            })}
          </div>
        )}

        {/* Prompt Cards Grid for Selected Subcategory */}
        {currentSubCatObj && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
            {currentSubCatObj.prompts.map((p) => (
              <div
                key={p.id}
                onClick={() => handleTriggerSelect(p.prompt)}
                className="group p-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all flex flex-col justify-between space-y-1.5"
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-slate-200 group-hover:text-amber-300 transition-all flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400 opacity-80" />
                    {p.label}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleCopyPrompt(e, p.id, p.prompt)}
                      className="p-1 rounded text-slate-500 hover:text-amber-300 hover:bg-slate-800 transition-colors"
                      title="Copy Prompt Text"
                    >
                      {copiedId === p.id ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                    <span className="text-[10px] font-bold text-amber-400/80 group-hover:text-amber-300 group-hover:translate-x-0.5 transition-all">
                      Inject +
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{p.prompt}</p>
                {p.tags && p.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {p.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="text-[9px] px-1.5 py-0.2 rounded bg-slate-950 text-slate-500 font-mono">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Full Explorer Modal Drawer */}
      {isExpandedModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-base font-bold text-slate-100">Commercial Studio Scene Library</h3>
                  <p className="text-[11px] text-slate-400">Curated Collection for Studio Photography, Ads & Scenes</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsExpandedModal(false)}
                className="p-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Camera & Lighting Modifier Toolbar in Modal */}
            <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
                <Sun className="w-3.5 h-3.5" /> Studio Camera & Lighting Injectors:
              </span>
              {CAMERA_LIGHTING_MODIFIERS.map((mod, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleAppendModifier(mod.snippet)}
                  className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-slate-300 hover:text-amber-300 transition-all whitespace-nowrap shrink-0 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3 text-amber-400" />
                  <span>{mod.label}</span>
                </button>
              ))}
            </div>

            {/* Modal Search Bar */}
            <div className="p-4 border-b border-slate-800 bg-slate-900">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search prompts by keyword or tag (e.g., office, neon, beach, gym, luxury, macro)..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-4 overflow-y-auto flex-1 space-y-6">
              {searchQuery.trim() ? (
                /* Search Results View */
                <div>
                  <h4 className="text-xs font-bold text-amber-400 mb-3 uppercase tracking-wider">
                    Search Results ({searchResults.length})
                  </h4>
                  {searchResults.length === 0 ? (
                    <p className="text-sm text-slate-500 py-6 text-center">No matching prompt scenes found for "{searchQuery}".</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {searchResults.map(({ mainName, subName, item }) => (
                        <div
                          key={item.id}
                          onClick={() => handleTriggerSelect(item.prompt)}
                          className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500 cursor-pointer transition-all group space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-[10px] text-amber-400 font-semibold">
                            <span>{mainName} → {subName}</span>
                            <span className="group-hover:translate-x-1 transition-all">Select Prompt →</span>
                          </div>
                          <h5 className="text-xs font-bold text-slate-200 group-hover:text-amber-300">{item.label}</h5>
                          <p className="text-xs text-slate-400 leading-relaxed">{item.prompt}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Full Category Breakdown */
                MAIN_CATEGORIES_DATA.map((main) => (
                  <div key={main.id} className="space-y-3">
                    <div className="flex items-center gap-2 text-amber-400 border-b border-slate-800/80 pb-2">
                      <h4 className="text-sm font-extrabold text-slate-100">{main.name}</h4>
                      <span className="text-xs text-slate-500">• {main.description}</span>
                    </div>

                    <div className="space-y-4">
                      {main.subcategories.map((sub) => (
                        <div key={sub.id} className="bg-slate-950/60 p-3 rounded-xl border border-slate-850 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-amber-300/90 flex items-center gap-1.5">
                              <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                              {sub.name}
                            </span>
                            <span className="text-[10px] text-slate-500">{sub.description}</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {sub.prompts.map((p) => (
                              <button
                                key={p.id}
                                type="button"
                                onClick={() => handleTriggerSelect(p.prompt)}
                                className="text-left p-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/60 transition-all space-y-1 group"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-slate-200 group-hover:text-amber-300">
                                    {p.label}
                                  </span>
                                  <span className="text-[10px] text-amber-400 opacity-0 group-hover:opacity-100 transition-all">
                                    Inject +
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">{p.prompt}</p>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

