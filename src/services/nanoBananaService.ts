import { dbService } from './dbService';
import { NANO_BANANA_PROMPTS, NanoPrompt } from '../data/nanoBananaPrompts';

export type { NanoPrompt };

function classifyPromptCategory(title: string, desc: string, promptText: string): string {
  const text = (title + ' ' + desc + ' ' + promptText).toLowerCase();

  if (text.includes('cinematic') || text.includes('commercial') || text.includes('movie') || text.includes('film') || text.includes('hollywood') || text.includes('trailer')) return 'cinematic';
  if (text.includes('podium') || text.includes('e-commerce') || text.includes('packshot') || text.includes('amazon') || text.includes('display') || text.includes('showcase')) return 'ecommerce';
  if (text.includes('cyberpunk') || text.includes('3d') || text.includes('neon') || text.includes('future') || text.includes('robot') || text.includes('sci-fi') || text.includes('hologram')) return 'cyberpunk';
  if (text.includes('fashion') || text.includes('model') || text.includes('portrait') || text.includes('clothing') || text.includes('vogue') || text.includes('runway') || text.includes('outfit')) return 'fashion';
  if (text.includes('luxury') || text.includes('jewelry') || text.includes('gold') || text.includes('diamond') || text.includes('watch') || text.includes('crystal') || text.includes('high-end')) return 'luxury';
  if (text.includes('food') || text.includes('coffee') || text.includes('gourmet') || text.includes('drink') || text.includes('dish') || text.includes('recipe') || text.includes('bakery') || text.includes('restaurant')) return 'food';
  if (text.includes('car') || text.includes('automotive') || text.includes('speed') || text.includes('vehicle') || text.includes('supercar') || text.includes('driving')) return 'automotive';
  if (text.includes('cosmetic') || text.includes('beauty') || text.includes('skincare') || text.includes('makeup') || text.includes('perfume') || text.includes('serum') || text.includes('lotion')) return 'cosmetics';
  if (text.includes('audio') || text.includes('headphone') || text.includes('gadget') || text.includes('smartphone') || text.includes('device') || text.includes('tech') || text.includes('electronics')) return 'tech';
  if (text.includes('architecture') || text.includes('interior') || text.includes('room') || text.includes('building') || text.includes('house') || text.includes('decor') || text.includes('villa')) return 'architecture';
  if (text.includes('sport') || text.includes('fitness') || text.includes('gym') || text.includes('athlete') || text.includes('runner') || text.includes('workout') || text.includes('sneaker')) return 'sports';
  if (text.includes('real estate') || text.includes('staging') || text.includes('apartment') || text.includes('property')) return 'realestate';
  if (text.includes('game') || text.includes('gaming') || text.includes('esports') || text.includes('character') || text.includes('unreal engine')) return 'gaming';
  if (text.includes('social media') || text.includes('banner') || text.includes('card') || text.includes('poster') || text.includes('infographic') || text.includes('quote') || text.includes('thumbnail') || text.includes('header')) return 'socialmedia';

  return 'product';
}

class NanoBananaService {
  /**
   * Helper method to parse GitHub raw Markdown repository into structured NanoPrompt objects
   */
  private parseMarkdownDataset(markdownText: string): NanoPrompt[] {
    const sections = markdownText.split(/^### No\. /m);
    const parsed: NanoPrompt[] = [];
    const seenPrompts = new Set<string>();
    const seenIds = new Set<string>();

    for (let i = 1; i < sections.length; i++) {
      const sec = sections[i];
      const firstLineEnd = sec.indexOf('\n');
      const headerLine = sec.slice(0, firstLineEnd > -1 ? firstLineEnd : undefined).trim();
      const numTitleMatch = headerLine.match(/^(\d+):\s*(.+)$/);
      const idNum = numTitleMatch ? numTitleMatch[1] : String(i);
      const title = numTitleMatch ? numTitleMatch[2].trim() : headerLine;

      // Extract Prompt from ``` codeblock
      const promptMatch = sec.match(/#### 📝 Prompt[\s\S]*?```(?:[a-zA-Z]*\n)?([\s\S]*?)```/);
      const promptText = promptMatch ? promptMatch[1].trim() : '';

      if (!promptText) continue;

      // Skip duplicate prompt text (e.g. Featured section repeating in All section)
      const promptKey = promptText.toLowerCase().replace(/\s+/g, ' ');
      if (seenPrompts.has(promptKey)) continue;
      seenPrompts.add(promptKey);

      // Extract Description
      const descMatch = sec.match(/#### 📖 Description\s*([\s\S]*?)(?=####|\n---|$\n)/);
      let description = descMatch ? descMatch[1].replace(/!\[.*?\]\(.*?\)/g, '').trim() : '';
      description = description.replace(/\s+/g, ' ');

      // Extract Image preview if available
      const imgMatch = sec.match(/<img\s+src=["']([^"']+)["']/);
      const imageUrl = imgMatch ? imgMatch[1] : undefined;

      // Categorize
      const category = classifyPromptCategory(title, description, promptText);

      // Build tags
      const tags = ['nano-banana-pro', category];
      const lowerText = (title + ' ' + description).toLowerCase();
      if (lowerText.includes('zh') || lowerText.includes('chinese')) tags.push('bilingual');
      if (lowerText.includes('infographic')) tags.push('infographic');
      if (lowerText.includes('bento')) tags.push('bento-grid');
      if (lowerText.includes('quote')) tags.push('quote-card');

      // Guarantee unique ID
      let uniqueId = `nb-gh-${idNum}`;
      if (seenIds.has(uniqueId)) {
        uniqueId = `nb-gh-${idNum}-${i}`;
      }
      seenIds.add(uniqueId);

      parsed.push({
        id: uniqueId,
        title,
        category,
        tags,
        promptText,
        description: description || title,
        imageUrl,
      });
    }

    return parsed;
  }

  /**
   * Fetches full dataset directly from YouMind-OpenLab GitHub repository and caches in IndexedDB
   */
  public async fetchAndCacheFullDataset(): Promise<NanoPrompt[]> {
    const GITHUB_RAW_URL =
      'https://raw.githubusercontent.com/YouMind-OpenLab/awesome-nano-banana-pro-prompts/main/README.md';

    try {
      const res = await fetch(GITHUB_RAW_URL, { cache: 'no-cache' });
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      const text = await res.text();
      const fetchedPrompts = this.parseMarkdownDataset(text);

      if (fetchedPrompts.length > 0) {
        // Merge with static NANO_BANANA_PROMPTS so no curated items are ever missed
        const fetchedIds = new Set(fetchedPrompts.map((p) => p.id));
        const missingStatic = NANO_BANANA_PROMPTS.filter((p) => !fetchedIds.has(p.id));
        const combined = [...fetchedPrompts, ...missingStatic];

        // Store in IndexedDB
        await dbService.saveCachedBananaPrompts(combined);
        return combined;
      }
    } catch (err) {
      console.warn('Failed to fetch dataset from GitHub:', err);
    }

    // Fallback to IndexedDB cached data or initial static array
    const cached = await dbService.getCachedBananaPrompts();
    if (cached && cached.length > 0) {
      return cached;
    }

    return NANO_BANANA_PROMPTS;
  }

  /**
   * Returns authentic local / dynamic Nano Banana prompts dataset.
   * Loads from IndexedDB cache instantly, and triggers background fetch on demand.
   */
  public async getNanoBananaPrompts(forceRefresh = false): Promise<NanoPrompt[]> {
    try {
      const cached = await dbService.getCachedBananaPrompts();

      if (cached && cached.length > 0 && !forceRefresh) {
        // Trigger silent background refresh
        this.fetchAndCacheFullDataset().catch((err) =>
          console.warn('Background sync warning:', err)
        );

        const cachedIds = new Set(cached.map((p) => p.id));
        const missingStatic = NANO_BANANA_PROMPTS.filter((p) => !cachedIds.has(p.id));
        return [...cached, ...missingStatic];
      }

      return await this.fetchAndCacheFullDataset();
    } catch (err) {
      console.warn('Error loading Nano Banana prompts:', err);
      return NANO_BANANA_PROMPTS;
    }
  }

  /**
   * Helper method to search prompts offline by query text and category
   */
  public searchLocalPrompts(
    prompts: NanoPrompt[],
    query: string,
    category: string,
    favoriteIds: string[] = []
  ): NanoPrompt[] {
    const q = query.toLowerCase().trim();

    return prompts.filter((item) => {
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.promptText.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.tags && item.tags.some((t) => t.toLowerCase().includes(q)));

      if (!matchesSearch) return false;

      if (category === 'all') return true;
      if (category === 'favorites') return favoriteIds.includes(item.id);
      if (category === 'custom') return !!item.isCustom;
      return item.category === category;
    });
  }
}

export const nanoBananaService = new NanoBananaService();
