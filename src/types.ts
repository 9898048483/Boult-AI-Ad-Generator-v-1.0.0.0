export interface UserProfile {
  name: string;
  email: string;
  picture: string;
  idToken: string;
  sub: string;
  loginTime: number;
}

export type AIProvider = 'auto' | 'replicate-flux-schnell' | 'replicate-flux-dev' | 'replicate-sdxl' | 'gemini-imagen3' | 'huggingface';

export interface AdPromptConfig {
  prompt: string;
  negativePrompt?: string;
  aspectRatio: '1:1' | '16:9' | '9:16' | '4:3';
  primaryProvider?: AIProvider;
  fallbackProviders?: AIProvider[];
  brandTagline?: string;
  stylePreset?: string;
  replicateToken?: string;
  geminiKey?: string;
  hfToken?: string;
}

export interface MultiAspectOutput {
  '1:1'?: string;
  '16:9'?: string;
  '9:16'?: string;
  '4:3'?: string;
}

export interface AIProviderResponse {
  success: boolean;
  imageUrl?: string;
  providerUsed: string;
  attemptedProviders: string[];
  executionTimeMs?: number;
  error?: string;
  needsApiKey?: boolean;
}

export interface AdGenerationRequest {
  prompt: string;
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3';
  mode?: 'auto' | 'replicate' | 'gemini' | 'huggingface' | 'replicate-flux-dev' | 'replicate-sdxl';
  selectedModel?: 'gemini-3.1-flash-lite-image' | 'imagen-3.0-generate-002' | 'flux-schnell' | 'studio-svg-fallback';
  replicateToken?: string;
  geminiKey?: string;
  hfToken?: string;
  stylePreset?: string;
  brandTagline?: string;
  productImageBase64?: string; // For product placement/inpainting
  maskImageBase64?: string;
}

export interface AdGenerationResponse {
  imageUrl?: string;
  provider?: string;
  error?: string;
  needsApiKey?: boolean;
  message?: string;
  enhancedPrompt?: string;
  attemptedProviders?: string[];
}

export interface AdHistoryItem {
  id: string;
  prompt: string;
  imageUrl: string;
  provider: string;
  aspectRatio: string;
  createdAt: number;
  stylePreset?: string;
  hasProductOverlay?: boolean;
}

export interface PresetPrompt {
  id: string;
  title: string;
  category: string;
  filterCategory?: 'Indoor' | 'Outdoor' | 'Product-Focused' | string;
  prompt: string;
  iconName: string;
}

export interface PromptItem {
  id: string;
  label: string;
  prompt: string;
  tags?: string[];
}

export interface SubCategory {
  id: string;
  name: string;
  description: string;
  prompts: PromptItem[];
}

export interface MainCategory {
  id: string;
  name: string;
  iconName: string;
  description: string;
  subcategories: SubCategory[];
}

export interface InpaintingConfig {
  productImage: string; // Base64 or DataURL
  maskImage?: string; // Base64 or DataURL
  backgroundPrompt: string;
  lightingStyle: 'warm-studio' | 'neon-cyberpunk' | 'minimalist-concrete' | 'dramatic-rim' | 'outdoor-golden';
  position: { x: number; y: number; scale: number; rotation: number };
}

