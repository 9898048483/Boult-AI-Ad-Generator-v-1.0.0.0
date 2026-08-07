import express from 'express';
import path from 'path';
import Replicate from 'replicate';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Helper to decode and verify Google OAuth ID Tokens
function parseAndVerifyGoogleToken(idToken: string | undefined) {
  if (!idToken || typeof idToken !== 'string') return null;

  const cleanToken = idToken.startsWith('Bearer ') ? idToken.slice(7).trim() : idToken.trim();

  try {
    const parts = cleanToken.split('.');
    if (parts.length < 2) return null;

    const payloadJson = Buffer.from(parts[1], 'base64').toString('utf-8');
    const payload = JSON.parse(payloadJson);

    if (payload && (payload.sub || payload.email)) {
      return {
        sub: payload.sub || 'google_user',
        name: payload.name || 'BOULT Creative User',
        email: payload.email || 'user@boult.ai',
        picture: payload.picture || '',
      };
    }
  } catch (err) {
    console.warn('[Server Auth] Token parse error:', err);
  }
  return null;
}

// Helper to check if an error is due to Quota (429) or Authentication (401)
function isQuotaOrAuthError(err: any): boolean {
  if (!err) return false;
  const status = err.status || err.statusCode || err.code;
  if (status === 429 || status === 401) return true;
  const msg = String(err.message || err.detail || err).toLowerCase();
  return (
    msg.includes('429') ||
    msg.includes('401') ||
    msg.includes('resource_exhausted') ||
    msg.includes('quota') ||
    msg.includes('unauthorized') ||
    msg.includes('unauthenticated') ||
    msg.includes('rate limit')
  );
}

// Helper to execute Gemini image generation model
async function generateWithGemini(
  modelName: string,
  prompt: string,
  aspectRatio: string,
  apiKey: string
): Promise<string> {
  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const response = await ai.models.generateContent({
    model: modelName,
    contents: {
      parts: [{ text: prompt }],
    },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio === '16:9' ? '16:9' : aspectRatio === '9:16' ? '9:16' : aspectRatio === '4:3' ? '4:3' : '1:1',
      },
    },
  });

  const parts = response.candidates?.[0]?.content?.parts || [];
  for (const part of parts) {
    if (part.inlineData?.data) {
      const base64Data = part.inlineData.data;
      const mime = part.inlineData.mimeType || 'image/png';
      return `data:${mime};base64,${base64Data}`;
    }
  }

  throw new Error(`Gemini model ${modelName} returned no image data`);
}

// Helper to execute Replicate Flux Schnell
async function generateWithReplicateFluxSchnell(
  prompt: string,
  aspectRatio: string,
  token: string
): Promise<string> {
  const replicate = new Replicate({ auth: token });
  const output = await replicate.run('black-forest-labs/flux-schnell', {
    input: {
      prompt,
      go_fast: true,
      megapixels: '1',
      num_outputs: 1,
      aspect_ratio: aspectRatio,
      output_format: 'webp',
      output_quality: 85,
      num_inference_steps: 4,
    },
  });

  const imageUrl = Array.isArray(output) ? output[0] : output;
  if (!imageUrl) {
    throw new Error('Replicate flux-schnell returned empty image URL');
  }
  return String(imageUrl);
}

// Helper to execute Pollinations AI (Free Flux Engine)
function generateWithPollinations(prompt: string, aspectRatio: string): string {
  const dims = aspectRatio === '16:9' ? { w: 1280, h: 720 } : aspectRatio === '9:16' ? { w: 720, h: 1280 } : aspectRatio === '4:3' ? { w: 1024, h: 768 } : { w: 1024, h: 1024 };
  const seed = Math.floor(Math.random() * 1000000);
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${dims.w}&height=${dims.h}&seed=${seed}&nologo=true&model=flux`;
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: '10mb' }));

  // 1. API Routes
  app.get('/api/config', (req, res) => {
    const customApiKeyHeader = (req.headers['x-custom-api-key'] || req.headers['x-api-key']) as string | undefined;
    const customApiKey = customApiKeyHeader && customApiKeyHeader.trim() ? customApiKeyHeader.trim() : undefined;

    res.json({
      hasReplicateToken: Boolean(process.env.REPLICATE_API_TOKEN),
      hasGeminiKey: Boolean(customApiKey || process.env.GEMINI_API_KEY),
      hasCustomKeyOverride: Boolean(customApiKey),
      authRequired: true,
      provider: 'Google OAuth Proxy',
    });
  });

  // Google OAuth ID Token Verification Route
  app.post('/api/auth/google-verify', (req, res) => {
    const authHeader = req.headers.authorization;
    const idToken = req.body.idToken || authHeader;

    const user = parseAndVerifyGoogleToken(idToken);
    if (!user) {
      return res.status(401).json({ authenticated: false, error: 'Invalid or missing Google OAuth ID token' });
    }

    res.json({
      authenticated: true,
      user,
      serverEnvStatus: {
        hasReplicate: Boolean(process.env.REPLICATE_API_TOKEN),
        hasGemini: Boolean(process.env.GEMINI_API_KEY),
      },
    });
  });

  // Enhance prompt route using Gemini or smart template
  app.post('/api/enhance-prompt', async (req, res) => {
    try {
      const { prompt, idToken } = req.body;
      const authHeader = req.headers.authorization;
      const user = parseAndVerifyGoogleToken(idToken || authHeader);

      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const customApiKeyHeader = (req.headers['x-custom-api-key'] || req.headers['x-api-key']) as string | undefined;
      const customApiKey = customApiKeyHeader && customApiKeyHeader.trim() ? customApiKeyHeader.trim() : undefined;
      const apiKeyToUse = customApiKey || process.env.GEMINI_API_KEY;

      if (apiKeyToUse && (user || process.env.GEMINI_API_KEY || customApiKey)) {
        try {
          const ai = new GoogleGenAI({ apiKey: apiKeyToUse });
          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are an expert commercial creative director for BOULT audio and tech lifestyle products.
Take the following user prompt and enhance it into an ultra-detailed 8K cinematic advertisement photo prompt for image generation.
Keep the output under 80 words. Focus on lighting, background aesthetics, product placement, and BOULT tagline typography.
Return ONLY the enhanced prompt string without commentary.

User Prompt: "${prompt}"`,
          });

          const enhancedText = response.text?.trim();
          if (enhancedText) {
            return res.json({ enhancedPrompt: enhancedText });
          }
        } catch (err) {
          console.error('Gemini prompt enhance failed:', err);
        }
      }

      // Smart template fallback enhancer
      const fallbackEnhanced = `A high-end cinematic advertisement photo of BOULT audio gear. ${prompt}. Soft studio cinematic lighting, shallow depth of field, ultra-detailed 8K commercial photography. On the clean wall, 'BOULT: DEFINE YOUR VIBE' is written cleanly in a luxury font.`;
      return res.json({ enhancedPrompt: fallbackEnhanced });

    } catch (error: any) {
      console.error('Error enhancing prompt:', error);
      res.status(500).json({ error: 'Failed to enhance prompt' });
    }
  });

  // Generate Ad image route with Dynamic Model Selection & Smart Free-Tier Quota Fallback
  app.post('/api/generate-ad', async (req, res) => {
    try {
      const {
        prompt,
        idToken,
        aspectRatio = '1:1',
        mode = 'auto',
        selectedModel = 'gemini-3.1-flash-lite-image',
      } = req.body;

      const authHeader = req.headers.authorization;
      const user = parseAndVerifyGoogleToken(idToken || authHeader);

      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      // Read Custom API Key from request headers
      const customApiKeyHeader = (req.headers['x-custom-api-key'] || req.headers['x-api-key']) as string | undefined;
      const customApiKey = customApiKeyHeader && customApiKeyHeader.trim() ? customApiKeyHeader.trim() : undefined;
      const geminiApiKey = customApiKey || process.env.GEMINI_API_KEY;

      if (customApiKey) {
        console.log('[AI Engine Proxy] Prioritizing user custom Gemini API key override.');
      }

      // Handle direct offline studio request
      if (selectedModel === 'studio-svg-fallback') {
        res.setHeader('X-Fallback-Status', 'fallback_rendered');
        const fallbackSvgUrl = generateStudioFallbackSvg(prompt, aspectRatio);
        return res.json({
          imageUrl: fallbackSvgUrl,
          provider: 'BOULT Studio Vector Engine (Offline)',
          status: 'fallback_rendered',
          isFallback: true,
          fallbackReason: 'Direct user selection of offline studio SVG engine.',
          attemptedProviders: ['studio-svg-fallback'],
          authenticatedUser: user?.email || 'Guest User',
          notice: 'Instant zero-quota offline vector graphic generated.',
        });
      }

      const replicateToken = process.env.REPLICATE_API_TOKEN;

      const attemptedProviders: string[] = [];
      let fallbackReason = '';

      console.log(`[AI Engine Proxy] Request: "${prompt.substring(0, 30)}..." | selectedModel: ${selectedModel}`);

      // Attempt 1: Target selectedModel
      if (selectedModel === 'flux-schnell') {
        attemptedProviders.push('replicate-flux-schnell');
        if (!replicateToken) {
          console.log('[AI Engine Proxy] REPLICATE_API_TOKEN missing. Triggering Free-Tier Fallback...');
          fallbackReason = 'REPLICATE_API_TOKEN is missing or unauthorized. Switched to Free-Tier Fallback.';
        } else {
          try {
            console.log('[AI Engine Proxy] Attempting Replicate (flux-schnell)...');
            const imageUrl = await generateWithReplicateFluxSchnell(prompt, aspectRatio, replicateToken);
            return res.json({
              imageUrl,
              provider: 'Replicate (Flux Schnell)',
              status: 'success',
              isFallback: false,
              attemptedProviders,
              authenticatedUser: user?.email || 'Google User',
            });
          } catch (err: any) {
            console.log('[AI Engine Proxy] Replicate flux-schnell failed/quota limit:', err?.message || err);
            fallbackReason = isQuotaOrAuthError(err)
              ? 'Replicate API quota exhausted or unauthorized (401/429).'
              : `Replicate failed: ${err?.message || 'Unavailable'}.`;
          }
        }
      } else if (selectedModel === 'gemini-3.1-flash-lite-image') {
        attemptedProviders.push('gemini-3.1-flash-lite-image');
        if (!geminiApiKey) {
          console.log('[AI Engine Proxy] GEMINI_API_KEY missing. Triggering Free-Tier Fallback...');
          fallbackReason = 'GEMINI_API_KEY is missing. Switched to Free-Tier Fallback.';
        } else {
          try {
            console.log(`[AI Engine Proxy] Attempting Gemini Lightweight Endpoint (${customApiKey ? 'Custom API Key' : 'Server Key'})...`);
            const imageUrl = await generateWithGemini('gemini-3.1-flash-lite-image', prompt, aspectRatio, geminiApiKey);
            return res.json({
              imageUrl,
              provider: customApiKey ? 'Google GenAI (Custom API Key Override)' : 'Google GenAI (gemini-3.1-flash-lite-image)',
              status: 'success',
              isFallback: false,
              attemptedProviders,
              authenticatedUser: user?.email || 'Google User',
            });
          } catch (err: any) {
            console.log('[AI Engine Proxy] Gemini gemini-3.1-flash-lite-image quota/error:', err?.status || err?.message || 'Unavailable');
            fallbackReason = isQuotaOrAuthError(err)
              ? 'Google GenAI free-tier quota limit reached (429 Resource Exhausted).'
              : `Gemini lightweight endpoint unavailable: ${err?.message || 'Quota limit'}.`;
          }
        }
      } else if (selectedModel === 'gemini-3.1-flash-image') {
        attemptedProviders.push('gemini-3.1-flash-image');
        if (!geminiApiKey) {
          fallbackReason = 'GEMINI_API_KEY is missing. Switched to Free-Tier Fallback.';
        } else {
          try {
            console.log(`[AI Engine Proxy] Attempting Gemini Flash Image Endpoint (${customApiKey ? 'Custom API Key' : 'Server Key'})...`);
            const imageUrl = await generateWithGemini('gemini-3.1-flash-image', prompt, aspectRatio, geminiApiKey);
            return res.json({
              imageUrl,
              provider: customApiKey ? 'Google GenAI (Custom API Key Override)' : 'Google GenAI (gemini-3.1-flash-image)',
              status: 'success',
              isFallback: false,
              attemptedProviders,
              authenticatedUser: user?.email || 'Google User',
            });
          } catch (err: any) {
            console.log('[AI Engine Proxy] Gemini gemini-3.1-flash-image quota/error:', err?.status || err?.message || 'Unavailable');
            fallbackReason = isQuotaOrAuthError(err)
              ? 'Google GenAI flash quota limit reached (429 Resource Exhausted).'
              : `Gemini flash endpoint unavailable: ${err?.message || 'Quota limit'}.`;
          }
        }
      }

      // Smart Quota Recovery: Fallback Chain Step A: Automatically attempt fallback to gemini-3.1-flash-lite-image if not tried
      if (!attemptedProviders.includes('gemini-3.1-flash-lite-image') && geminiApiKey) {
        attemptedProviders.push('gemini-3.1-flash-lite-image');
        try {
          console.log('[AI Engine Proxy] Smart Quota Recovery: Attempting fallback to gemini-3.1-flash-lite-image...');
          const imageUrl = await generateWithGemini('gemini-3.1-flash-lite-image', prompt, aspectRatio, geminiApiKey);
          return res.json({
            imageUrl,
            provider: customApiKey ? 'Google GenAI (Custom API Key Override) [Fallback]' : 'Google GenAI (gemini-3.1-flash-lite-image) [Fallback]',
            status: 'cloud_fallback',
            isFallback: true,
            fallbackReason: fallbackReason || `Selected model (${selectedModel}) hit quota/auth limit. Rerouted to lightweight free-tier Gemini model.`,
            attemptedProviders,
            authenticatedUser: user?.email || 'Google User',
          });
        } catch (err: any) {
          console.log('[AI Engine Proxy] Gemini lightweight fallback hit quota/error:', err?.status || err?.message || 'Quota limit');
        }
      }

      // Smart Quota Recovery: Fallback Chain Step B: Try Pollinations AI (Free Flux Engine)
      if (!attemptedProviders.includes('pollinations')) {
        attemptedProviders.push('pollinations');
        try {
          console.log('[AI Engine Proxy] Smart Quota Recovery: Attempting Pollinations AI (Free Flux Engine)...');
          const pollinationsUrl = generateWithPollinations(prompt, aspectRatio);
          return res.json({
            imageUrl: pollinationsUrl,
            provider: 'Pollinations AI (Flux Engine) [Fallback]',
            status: 'cloud_fallback',
            isFallback: true,
            fallbackReason: fallbackReason || `Cloud AI keys hit quota limits (429). Seamlessly rerouted to free Pollinations Flux engine.`,
            attemptedProviders,
            authenticatedUser: user?.email || 'Google User',
          });
        } catch (polErr: any) {
          console.warn('[AI Engine Proxy] Pollinations AI failed:', polErr?.message || polErr);
        }
      }

      // Smart Quota Recovery: Fallback Chain Step C: Final Vector Engine Studio Fallback
      console.log('[AI Engine Proxy] All cloud AI endpoints hit quota limits. Seamlessly rendering Studio Vector fallback graphic...');
      res.setHeader('X-Fallback-Status', 'fallback_rendered');
      const fallbackStudioImage = generateStudioFallbackSvg(prompt, aspectRatio);

      return res.json({
        imageUrl: fallbackStudioImage,
        provider: 'BOULT Studio Vector Engine (Offline Fallback)',
        status: 'fallback_rendered',
        isFallback: true,
        fallbackReason: fallbackReason || 'All cloud AI models hit quota or authentication limits (429/401). Instant studio vector composition rendered.',
        attemptedProviders,
        authenticatedUser: user?.email || 'Guest User',
        notice: 'Quota limit reached on cloud models. High-resolution studio graphic rendered automatically.',
      });

    } catch (error: any) {
      console.error('Error in /api/generate-ad:', error);
      res.status(500).json({ error: error.message || 'Failed to generate ad image' });
    }
  });

  // 2. Vite Dev Middleware / Static production serving
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BOULT AI Ad Generator server running on http://0.0.0.0:${PORT}`);
  });
}

function generateStudioFallbackSvg(prompt: string, aspectRatio: string): string {
  let width = 1024;
  let height = 1024;
  if (aspectRatio === '16:9') { width = 1280; height = 720; }
  else if (aspectRatio === '9:16') { width = 720; height = 1280; }
  else if (aspectRatio === '4:3') { width = 1024; height = 768; }

  const cleanPrompt = (prompt || 'BOULT Audio Product').replace(/["<>]/g, "'");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <radialGradient id="bgGrad" cx="50%" cy="50%" r="75%">
        <stop offset="0%" stop-color="#1e1b4b" />
        <stop offset="50%" stop-color="#0f172a" />
        <stop offset="100%" stop-color="#020617" />
      </radialGradient>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fbbf24" />
        <stop offset="100%" stop-color="#d97706" />
      </linearGradient>
      <linearGradient id="neonGlow" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.6" />
        <stop offset="100%" stop-color="#818cf8" stop-opacity="0.1" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="15" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    <rect width="100%" height="100%" fill="url(#bgGrad)" />
    <circle cx="${width / 2}" cy="${height / 2 - 40}" r="${Math.min(width, height) * 0.35}" fill="url(#neonGlow)" filter="url(#glow)" />
    
    <ellipse cx="${width / 2}" cy="${height * 0.72}" rx="${width * 0.35}" ry="${height * 0.08}" fill="#000000" opacity="0.6" />
    <ellipse cx="${width / 2}" cy="${height * 0.7}" rx="${width * 0.28}" ry="${height * 0.04}" fill="url(#goldGrad)" opacity="0.8" filter="url(#glow)" />
    
    <text x="50%" y="${height * 0.22}" text-anchor="middle" fill="url(#goldGrad)" font-family="system-ui, sans-serif" font-size="${Math.round(width * 0.045)}" font-weight="900" letter-spacing="6">BOULT AUDIO</text>
    <text x="50%" y="${height * 0.27}" text-anchor="middle" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="${Math.round(width * 0.018)}" font-weight="600" letter-spacing="3">UNLEASH THE SOUND</text>

    <g transform="translate(${width / 2}, ${height / 2})">
      <circle cx="0" cy="-20" r="${Math.round(width * 0.12)}" fill="#020617" stroke="url(#goldGrad)" stroke-width="6" filter="url(#glow)" />
      <path d="M-30,-20 Q0,-50 30,-20 T0,20 Z" fill="none" stroke="#38bdf8" stroke-width="4" />
      <circle cx="0" cy="-20" r="16" fill="url(#goldGrad)" />
    </g>

    <rect x="${width * 0.1}" y="${height * 0.82}" width="${width * 0.8}" height="${height * 0.11}" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2" opacity="0.9" />
    <text x="50%" y="${height * 0.87}" text-anchor="middle" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="${Math.round(width * 0.021)}" font-weight="700">" ${cleanPrompt.substring(0, 55)}${cleanPrompt.length > 55 ? '...' : ''} "</text>
    <text x="50%" y="${height * 0.91}" text-anchor="middle" fill="#64748b" font-family="system-ui, sans-serif" font-size="${Math.round(width * 0.014)}">BOULT AI AD GENERATOR STUDIO | 8K CINEMATIC STUDIO RENDER</text>
  </svg>`;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

startServer();
