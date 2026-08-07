import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Search,
  Sparkles,
  Copy,
  Check,
  Star,
  Plus,
  Trash2,
  Zap,
  Layers,
  ShoppingBag,
  Film,
  Monitor,
  User,
  Car,
  Coffee,
  Sparkle,
  Headphones,
  Building2,
  CheckCircle2,
  ChevronDown,
  Dumbbell,
  Home,
  Gamepad2,
  Share2,
  Gem
} from 'lucide-react';
import { dbService } from '../services/dbService';
import { nanoBananaService, NanoPrompt } from '../services/nanoBananaService';
import { NANO_BANANA_PROMPTS } from '../data/nanoBananaPrompts';

const CATEGORY_MAP: Record<string, { name: string; icon: any; color: string; bg: string; border: string }> = {
  all: {
    name: 'All Prompts',
    icon: Layers,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30'
  },
  product: {
    name: '🍌 Product Showcase',
    icon: Sparkles,
    color: 'text-amber-300',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/30'
  },
  cinematic: {
    name: '🎬 Cinematic Commercials',
    icon: Film,
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/30'
  },
  ecommerce: {
    name: '🛍️ E-Commerce Podiums',
    icon: ShoppingBag,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30'
  },
  cyberpunk: {
    name: '⚡ Cyberpunk & 3D Tech',
    icon: Monitor,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30'
  },
  fashion: {
    name: '👗 Fashion & Models',
    icon: User,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30'
  },
  luxury: {
    name: '💎 Luxury & Jewelry',
    icon: Gem,
    color: 'text-yellow-300',
    bg: 'bg-yellow-400/10',
    border: 'border-yellow-400/30'
  },
  food: {
    name: '☕ Food & Gourmet',
    icon: Coffee,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30'
  },
  automotive: {
    name: '🚗 Automotive & Speed',
    icon: Car,
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30'
  },
  cosmetics: {
    name: '💄 Cosmetics & Beauty',
    icon: Sparkle,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/30'
  },
  tech: {
    name: '🎧 Audio & Smart Tech',
    icon: Headphones,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/30'
  },
  architecture: {
    name: '🏛️ Architecture & Interior',
    icon: Building2,
    color: 'text-stone-300',
    bg: 'bg-stone-500/10',
    border: 'border-stone-500/30'
  },
  sports: {
    name: '🏃 Sports & Fitness',
    icon: Dumbbell,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30'
  },
  realestate: {
    name: '🏢 Real Estate & Staging',
    icon: Home,
    color: 'text-teal-400',
    bg: 'bg-teal-500/10',
    border: 'border-teal-500/30'
  },
  gaming: {
    name: '🎮 Gaming & Esports',
    icon: Gamepad2,
    color: 'text-fuchsia-400',
    bg: 'bg-fuchsia-500/10',
    border: 'border-fuchsia-500/30'
  },
  socialmedia: {
    name: '📱 Social Media Banners',
    icon: Share2,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30'
  },
  favorites: {
    name: '⭐ My Favorites',
    icon: Star,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30'
  },
  custom: {
    name: '✍️ My Custom Prompts',
    icon: Plus,
    color: 'text-teal-300',
    bg: 'bg-teal-500/10',
    border: 'border-teal-500/30'
  }
};

const ITEMS_PER_PAGE = 20;

interface NanoBananaPromptsGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPrompt: (promptText: string) => void;
}

export const NanoBananaPromptsGallery: React.FC<NanoBananaPromptsGalleryProps> = ({
  isOpen,
  onClose,
  onApplyPrompt
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [customPrompts, setCustomPrompts] = useState<NanoPrompt[]>([]);
  const [fetchedPrompts, setFetchedPrompts] = useState<NanoPrompt[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [appliedId, setAppliedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Pagination state
  const [visibleCount, setVisibleCount] = useState<number>(ITEMS_PER_PAGE);

  // Custom Prompt Form State
  const [isAddingCustom, setIsAddingCustom] = useState<boolean>(false);
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customCategory, setCustomCategory] = useState<string>('product');
  const [customPromptText, setCustomPromptText] = useState<string>('');
  const [customDesc, setCustomDesc] = useState<string>('');

  // Initial Load from Service & IndexedDB
  useEffect(() => {
    if (isOpen) {
      loadInitialData();
    }
  }, [isOpen]);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const [favs, customs, dynamicPrompts] = await Promise.all([
        dbService.getFavoriteBananaPrompts(),
        dbService.getCustomBananaPrompts(),
        nanoBananaService.getNanoBananaPrompts()
      ]);

      setFavoriteIds(favs);
      setCustomPrompts(customs);
      setFetchedPrompts(dynamicPrompts && dynamicPrompts.length > 0 ? dynamicPrompts : NANO_BANANA_PROMPTS);
    } catch (err) {
      console.warn('Error loading user custom/favorite prompts:', err);
      setFetchedPrompts(NANO_BANANA_PROMPTS);
    } finally {
      setIsLoading(false);
    }
  };

  // Combine authentic fetched repo prompts with user custom prompts ensuring 100% unique IDs
  const allPrompts = useMemo(() => {
    const map = new Map<string, NanoPrompt>();
    [...customPrompts, ...fetchedPrompts].forEach((p, idx) => {
      const baseId = p.id || `prompt-${idx}`;
      if (!map.has(baseId)) {
        map.set(baseId, p);
      } else {
        const uniqueId = `${baseId}-${idx}`;
        map.set(uniqueId, { ...p, id: uniqueId });
      }
    });
    return Array.from(map.values());
  }, [customPrompts, fetchedPrompts]);

  // Reset pagination on search or category filter change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [searchQuery, activeCategory]);

  // Toggle favorite status
  const handleToggleFavorite = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const updated = await dbService.toggleFavoriteBananaPrompt(id);
      setFavoriteIds(updated);
    } catch (err) {
      console.warn('Failed to toggle favorite:', err);
    }
  };

  // Copy prompt text
  const handleCopyPrompt = (text: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Apply to Studio Handler
  const handleApply = (promptText: string, id: string) => {
    onApplyPrompt(promptText);
    setAppliedId(id);
    setTimeout(() => {
      setAppliedId(null);
      onClose();
    }, 300);
  };

  // Create new custom prompt
  const handleCreateCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim() || !customPromptText.trim()) return;

    const newCustomItem: NanoPrompt = {
      id: `custom_${Date.now()}`,
      title: customTitle.trim(),
      category: customCategory,
      promptText: customPromptText.trim(),
      tags: ['custom', customCategory],
      description: customDesc.trim() || 'User created custom prompt template.',
      isCustom: true
    };

    try {
      const updated = await dbService.saveCustomBananaPrompt(newCustomItem);
      setCustomPrompts(updated);
      setCustomTitle('');
      setCustomPromptText('');
      setCustomDesc('');
      setIsAddingCustom(false);
      setActiveCategory('custom');
    } catch (err) {
      console.error('Failed to save custom prompt:', err);
    }
  };

  // Delete custom prompt
  const handleDeleteCustom = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const updated = await dbService.deleteCustomBananaPrompt(id);
      setCustomPrompts(updated);
    } catch (err) {
      console.error('Failed to delete custom prompt:', err);
    }
  };

  // Dynamic list of categories present in current prompts dataset
  const availableCategories = useMemo(() => {
    const defaultCats = [
      'all', 'product', 'cinematic', 'ecommerce', 'cyberpunk', 'fashion',
      'luxury', 'food', 'automotive', 'cosmetics', 'tech', 'architecture',
      'sports', 'realestate', 'gaming', 'socialmedia', 'favorites', 'custom'
    ];
    const present = new Set<string>(defaultCats);

    allPrompts.forEach((p) => {
      if (p.category) present.add(p.category);
    });

    return Array.from(present).map((catKey) => {
      if (CATEGORY_MAP[catKey]) return { id: catKey, ...CATEGORY_MAP[catKey] };
      return {
        id: catKey,
        name: `🏷️ ${catKey.toUpperCase()}`,
        icon: Sparkles,
        color: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30'
      };
    });
  }, [allPrompts]);

  // Filtered prompts based on category and search query
  const filteredPrompts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return allPrompts.filter((item) => {
      const textToSearch = (item.promptText || '').toLowerCase();
      const titleToSearch = (item.title || '').toLowerCase();
      const descToSearch = (item.description || '').toLowerCase();

      const matchesSearch =
        !q ||
        titleToSearch.includes(q) ||
        textToSearch.includes(q) ||
        descToSearch.includes(q) ||
        (item.tags && item.tags.some((t) => t.toLowerCase().includes(q)));

      if (!matchesSearch) return false;

      if (activeCategory === 'all') return true;
      if (activeCategory === 'favorites') return favoriteIds.includes(item.id);
      if (activeCategory === 'custom') return !!item.isCustom;
      return item.category === activeCategory;
    });
  }, [allPrompts, searchQuery, activeCategory, favoriteIds]);

  // Paginated visible slice
  const paginatedPrompts = useMemo(() => {
    return filteredPrompts.slice(0, visibleCount);
  }, [filteredPrompts, visibleCount]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl shadow-amber-500/10 overflow-hidden">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20 shrink-0">
              <Sparkles className="w-6 h-6 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2">
                  🍌 Nano Banana Pro Prompts Library
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  ⚡ Nano Banana Library ({allPrompts.length} Prompts Loaded)
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Showing {filteredPrompts.length} of {allPrompts.length} curated prompts from YouMind-OpenLab repository
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            title="Close Prompt Gallery"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Action Bar */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search prompts by keyword, product, lighting..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-slate-500 hover:text-slate-300"
              >
                Clear
              </button>
            )}
          </div>

          <button
            onClick={() => setIsAddingCustom(!isAddingCustom)}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{isAddingCustom ? 'Cancel Custom Prompt' : 'Create Custom Prompt'}</span>
          </button>
        </div>

        {/* Custom Prompt Creator Form */}
        {isAddingCustom && (
          <form
            onSubmit={handleCreateCustom}
            className="p-4 bg-slate-950 border-b border-amber-500/30 space-y-3 animate-in slide-in-from-top duration-200"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-amber-400" />
                Add Custom Prompt Template
              </span>
              <span className="text-[11px] text-slate-400">Saved to local browser IndexedDB</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="Template Title (e.g. Floating Cyberpunk Earbuds)"
                required
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <select
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              >
                <option value="product">🍌 Product Showcase</option>
                <option value="cinematic">🎬 Cinematic Commercials</option>
                <option value="ecommerce">🛍️ E-Commerce Podiums</option>
                <option value="cyberpunk">⚡ Cyberpunk & 3D Tech</option>
                <option value="fashion">👗 Fashion & Models</option>
                <option value="luxury">💎 Luxury & Jewelry</option>
                <option value="food">☕ Food & Gourmet</option>
                <option value="automotive">🚗 Automotive & Speed</option>
                <option value="cosmetics">💄 Cosmetics & Beauty</option>
                <option value="tech">🎧 Audio & Smart Tech</option>
                <option value="architecture">🏛️ Architecture & Interior</option>
                <option value="sports">🏃 Sports & Fitness</option>
                <option value="realestate">🏢 Real Estate & Staging</option>
                <option value="gaming">🎮 Gaming & Esports</option>
                <option value="socialmedia">📱 Social Media Banners</option>
              </select>
            </div>
            <textarea
              value={customPromptText}
              onChange={(e) => setCustomPromptText(e.target.value)}
              placeholder="Prompt template text with placeholders like [Product Name] or [Brand Color]..."
              required
              rows={2}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingCustom(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
              >
                Save Custom Template
              </button>
            </div>
          </form>
        )}

        {/* Dynamic Category Navigation Pills */}
        <div className="p-3 bg-slate-950/60 border-b border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {availableCategories.map((cat) => {
            const IconComp = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 border ${
                  isActive
                    ? `${cat.bg} ${cat.color} ${cat.border} shadow-md`
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-850'
                }`}
              >
                <IconComp className={`w-3.5 h-3.5 ${isActive ? cat.color : 'text-slate-400'}`} />
                <span>{cat.name}</span>
                {cat.id === 'favorites' && favoriteIds.length > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-yellow-500/20 text-yellow-300 ml-0.5">
                    {favoriteIds.length}
                  </span>
                )}
                {cat.id === 'custom' && customPrompts.length > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-teal-500/20 text-teal-300 ml-0.5">
                    {customPrompts.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Prompts Cards Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh] space-y-4 no-scrollbar">
          {isLoading ? (
            <div className="py-16 text-center text-slate-400 space-y-3">
              <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-semibold">Loading Full YouMind Nano Banana Dataset...</p>
              <p className="text-xs text-slate-500">Parsing community templates from GitHub raw endpoint...</p>
            </div>
          ) : filteredPrompts.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <Zap className="w-8 h-8 text-slate-600 mx-auto animate-bounce" />
              <p className="text-sm font-semibold">No prompts found matching your filter.</p>
              <p className="text-xs text-slate-600">Try clearing your search query or creating a custom prompt.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paginatedPrompts.map((p) => {
                  const isFav = favoriteIds.includes(p.id);
                  const isCopied = copiedId === p.id;
                  const isApplied = appliedId === p.id;
                  const pText = p.promptText || (p as any).prompt || '';

                  return (
                    <div
                      key={p.id}
                      className="group bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-amber-500/50 rounded-xl p-4 transition-all duration-200 flex flex-col justify-between space-y-3 relative overflow-hidden"
                    >
                      {/* Top Card Info */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                              {p.title}
                            </h3>
                            {p.isCustom && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                                Custom
                              </span>
                            )}
                          </div>
                          {p.description && (
                            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{p.description}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => handleToggleFavorite(p.id, e)}
                            className={`p-1.5 rounded-lg border transition-all ${
                              isFav
                                ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                                : 'text-slate-500 hover:text-yellow-400 border-transparent hover:border-slate-800'
                            }`}
                            title={isFav ? 'Remove from favorites' : 'Save to favorites'}
                          >
                            <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-yellow-400' : ''}`} />
                          </button>

                          {p.isCustom && (
                            <button
                              type="button"
                              onClick={(e) => handleDeleteCustom(p.id, e)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
                              title="Delete custom prompt"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Prompt Box Body */}
                      <div className="bg-slate-900 border border-slate-800/80 rounded-lg p-2.5 text-xs text-slate-300 font-mono leading-relaxed relative group-hover:border-slate-700 transition-colors max-h-32 overflow-y-auto no-scrollbar">
                        {pText}
                      </div>

                      {/* Tags & Action Buttons */}
                      <div className="flex items-center justify-between gap-2 pt-1">
                        <div className="flex flex-wrap gap-1">
                          {p.tags?.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => handleCopyPrompt(pText, p.id, e)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition-all flex items-center gap-1"
                            title="Copy prompt text"
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 text-slate-400" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleApply(pText, p.id)}
                            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition-all shadow-md flex items-center gap-1 active:scale-95"
                          >
                            {isApplied ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Applied!</span>
                              </>
                            ) : (
                              <>
                                <Zap className="w-3.5 h-3.5 fill-slate-950" />
                                <span>Apply to Studio</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Lazy Loading / Load More Control */}
              {visibleCount < filteredPrompts.length && (
                <div className="pt-4 text-center">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
                    className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-amber-300 text-xs font-bold border border-amber-500/30 transition-all flex items-center gap-2 mx-auto shadow-lg"
                  >
                    <span>
                      Load More Prompts ({filteredPrompts.length - visibleCount} remaining)
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Info Bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-center text-[11px] text-slate-500 flex items-center justify-between px-6">
          <span>⚡ Authentic YouMind-OpenLab Prompts Dataset & IndexedDB Offline Storage</span>
          <span>Click "Apply to Studio" to load directly into prompt box</span>
        </div>
      </div>
    </div>
  );
};
