import { PresetPrompt } from '../types';

export const DEFAULT_PROMPT = "A high-end cinematic advertisement photo of a luxury studio loft room. A beautiful model girl is sitting in an armchair on the left, reading a book. In the foreground, on a modern curved wooden table, premium sleek wireless neckband earbuds are placed under soft golden warm lighting. On the clean wall, 'BOULT: DEFINE YOUR VIBE' is written cleanly in a luxury font.";

export const PRESET_PROMPTS: PresetPrompt[] = [
  {
    id: 'boult-default',
    title: 'BOULT Original Studio Loft',
    category: 'Cinematic Studio',
    iconName: 'Sparkles',
    prompt: DEFAULT_PROMPT
  },
  {
    id: 'cyberpunk-neon',
    title: 'Cyberpunk Neon Street',
    category: 'Urban Vibes',
    iconName: 'Zap',
    prompt: "Ultra-detailed 8K cyberpunk advertisement photo of sleek futuristic BOULT true wireless gaming earbuds hovering inside a glowing glass pod. Rainy Tokyo street background at night with intense cyan and neon purple reflections. Neon typography on billboard reading 'BOULT UNLEASH THE SOUND'."
  },
  {
    id: 'fitness-runner',
    title: 'High-Energy Fitness & Sports',
    category: 'Fitness & Action',
    iconName: 'Activity',
    prompt: "Dynamic commercial photography of a athletic runner during golden hour sunset on a high-tech running track, wearing matte black BOULT waterproof sports neckband. Sweat droplets captured in ultra motion-blur, atmospheric sunlight lens flare. Clean modern text in background: 'BOULT: UNSTOPPABLE BEATS'."
  },
  {
    id: 'luxury-minimalist',
    title: 'Minimalist Luxury Matte White',
    category: 'Luxury Minimal',
    iconName: 'Crown',
    prompt: "Commercial luxury product shot of BOULT active noise cancelling over-ear headphones rest on a polished black marble slab surrounded by architectural concrete forms and dramatic soft studio lighting with warm champagne accents. Elegant tagline 'BOULT PURE AUDIO' carved smoothly on wall."
  },
  {
    id: 'smartwatch-vibes',
    title: 'BOULT Luxury Smartwatch Pod',
    category: 'Wearables',
    iconName: 'Watch',
    prompt: "Close-up macro advertisement photo of a BOULT metallic bezel smartwatch with vivid AMOLED display floating over swirling deep blue silk fabric. Warm rim lights highlighting precision metallic edges and subtle water droplets. Sleek floating text: 'BOULT TIME FOR PERFECTION'."
  },
  {
    id: 'party-boombox',
    title: 'Neon RGB Party Speaker',
    category: 'Lifestyle',
    iconName: 'Music',
    prompt: "Atmospheric nightlife ad shot of a powerful BOULT wireless RGB party speaker placed on a DJ console in a rooftop lounge. Dynamic purple and amber smoke particle effects, energetic crowd bokeh in background. Crisp lighting on speaker mesh with brand tagline 'BOULT: AMP YOUR VIBE'."
  }
];
