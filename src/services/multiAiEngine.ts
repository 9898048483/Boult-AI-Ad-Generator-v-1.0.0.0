/**
 * Multi-Provider AI Engine & Fallback Router
 * Handles resilient image generation with automated retries and fallback sequencing
 * across Replicate (Flux Schnell, Flux Dev, SDXL), Gemini Imagen 3, and Hugging Face.
 */

import { AdPromptConfig, AIProviderResponse, AIProvider } from '../types';

/**
 * Fallback priority matrix for different modes
 */
const DEFAULT_FALLBACK_SEQUENCE: AIProvider[] = [
  'replicate-flux-schnell',
  'gemini-imagen3',
  'replicate-flux-dev',
  'replicate-sdxl',
  'huggingface',
];

/**
 * Generate AI Ad Image with automated retries and fallback sequence
 */
export async function generateAdWithFallback(config: AdPromptConfig): Promise<AIProviderResponse> {
  const startTime = Date.now();
  const attemptedProviders: string[] = [];

  // Determine priority sequence based on primaryProvider selection
  let sequence: AIProvider[] = [];
  if (config.primaryProvider && config.primaryProvider !== 'auto') {
    sequence.push(config.primaryProvider);
    if (config.fallbackProviders && config.fallbackProviders.length > 0) {
      sequence.push(...config.fallbackProviders);
    } else {
      sequence.push(...DEFAULT_FALLBACK_SEQUENCE.filter((p) => p !== config.primaryProvider));
    }
  } else {
    sequence = [...DEFAULT_FALLBACK_SEQUENCE];
  }

  // Construct enhanced prompt with brand tagline and style preset if present
  let fullPrompt = config.prompt;
  if (config.stylePreset) {
    fullPrompt = `${config.stylePreset} style: ${fullPrompt}`;
  }
  if (config.brandTagline) {
    fullPrompt = `${fullPrompt}, featured with brand typography "${config.brandTagline}", 8k resolution, commercial advertising masterpiece, professional lighting`;
  }

  // Attempt API calls through backend proxy (/api/generate-ad)
  try {
    const res = await fetch('/api/generate-ad', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: fullPrompt,
        negativePrompt: config.negativePrompt,
        aspectRatio: config.aspectRatio || '1:1',
        mode: config.primaryProvider || 'auto',
        replicateToken: config.replicateToken,
        geminiKey: config.geminiKey,
        hfToken: config.hfToken,
      }),
    });

    const data = await res.json();

    if (res.ok && data.imageUrl) {
      return {
        success: true,
        imageUrl: data.imageUrl,
        providerUsed: data.provider || 'AI Engine',
        attemptedProviders: data.attemptedProviders || sequence,
        executionTimeMs: Date.now() - startTime,
      };
    }

    if (data.needsApiKey) {
      return {
        success: false,
        providerUsed: 'None',
        attemptedProviders: data.attemptedProviders || sequence,
        error: data.error || 'API Key configuration required.',
        needsApiKey: true,
        executionTimeMs: Date.now() - startTime,
      };
    }

    return {
      success: false,
      providerUsed: 'None',
      attemptedProviders: data.attemptedProviders || sequence,
      error: data.error || 'Failed to generate ad image after testing fallbacks.',
      executionTimeMs: Date.now() - startTime,
    };
  } catch (err: any) {
    console.error('Multi-AI Engine network request error:', err);
    return {
      success: false,
      providerUsed: 'None',
      attemptedProviders,
      error: err.message || 'Network error connecting to AI image generation backend.',
      executionTimeMs: Date.now() - startTime,
    };
  }
}

/**
 * Parallel Multi-Aspect Ratio Generator
 * Generates 1:1, 9:16, 16:9, and 4:3 images concurrently
 */
export async function generateMultiAspectCampaign(
  promptConfig: AdPromptConfig,
  aspectRatios: ('1:1' | '16:9' | '9:16' | '4:3')[] = ['1:1', '9:16', '16:9', '4:3']
): Promise<Record<string, AIProviderResponse>> {
  const promises = aspectRatios.map(async (aspect) => {
    const response = await generateAdWithFallback({ ...promptConfig, aspectRatio: aspect });
    return [aspect, response] as const;
  });

  const results = await Promise.all(promises);
  const record: Record<string, AIProviderResponse> = {};
  results.forEach(([aspect, resp]) => {
    record[aspect] = resp;
  });

  return record;
}
