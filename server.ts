import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import Replicate from 'replicate';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: '10mb' }));

  // 1. API Routes
  app.get('/api/config', (req, res) => {
    res.json({
      hasReplicateToken: Boolean(process.env.REPLICATE_API_TOKEN),
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // Enhance prompt route using Gemini or smart template
  app.post('/api/enhance-prompt', async (req, res) => {
    try {
      const { prompt, geminiKey } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const apiKeyToUse = geminiKey || process.env.GEMINI_API_KEY;

      if (apiKeyToUse) {
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

  // Generate Ad image route with multi-provider resilient fallback
  app.post('/api/generate-ad', async (req, res) => {
    try {
      const {
        prompt,
        replicateToken,
        geminiKey,
        hfToken,
        aspectRatio = '1:1',
        mode = 'auto'
      } = req.body;

      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const tokenToUse = replicateToken || process.env.REPLICATE_API_TOKEN;
      const apiKeyToUse = geminiKey || process.env.GEMINI_API_KEY;
      const hfTokenToUse = hfToken || process.env.HF_TOKEN || process.env.HUGGINGFACE_TOKEN;

      const attemptedProviders: string[] = [];

      // Determine provider priority list based on mode
      const providerSequence: string[] = [];
      if (mode === 'replicate-flux-dev') {
        providerSequence.push('replicate-flux-dev', 'replicate-flux-schnell', 'gemini-imagen3');
      } else if (mode === 'replicate-sdxl') {
        providerSequence.push('replicate-sdxl', 'replicate-flux-schnell', 'gemini-imagen3');
      } else if (mode === 'gemini') {
        providerSequence.push('gemini-imagen3', 'replicate-flux-schnell');
      } else if (mode === 'huggingface') {
        providerSequence.push('huggingface', 'gemini-imagen3', 'replicate-flux-schnell');
      } else if (mode === 'replicate') {
        providerSequence.push('replicate-flux-schnell', 'replicate-flux-dev', 'gemini-imagen3');
      } else {
        // Auto default priority
        providerSequence.push('replicate-flux-schnell', 'gemini-imagen3', 'replicate-flux-dev', 'huggingface');
      }

      for (const provider of providerSequence) {
        attemptedProviders.push(provider);

        // 1. Replicate Flux Schnell
        if (provider === 'replicate-flux-schnell' && tokenToUse) {
          try {
            console.log('[AI Engine] Trying Replicate (flux-schnell)...');
            const replicate = new Replicate({ auth: tokenToUse });
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
            if (imageUrl) {
              return res.json({
                imageUrl: String(imageUrl),
                provider: 'Replicate (Flux Schnell)',
                attemptedProviders,
              });
            }
          } catch (err: any) {
            console.warn('[AI Engine] Replicate flux-schnell failed:', err?.message || err);
          }
        }

        // 2. Gemini Image Generation
        if (provider === 'gemini-imagen3' && apiKeyToUse) {
          try {
            console.log('[AI Engine] Trying Gemini Flash Image generation...');
            const ai = new GoogleGenAI({
              apiKey: apiKeyToUse,
              httpOptions: {
                headers: {
                  'User-Agent': 'aistudio-build',
                },
              },
            });

            const modelsToTry = ['gemini-3.1-flash-lite-image', 'gemini-3.1-flash-image'];
            for (const modelName of modelsToTry) {
              try {
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
                    const imageUrl = `data:${mime};base64,${base64Data}`;
                    return res.json({
                      imageUrl,
                      provider: `Gemini (${modelName})`,
                      attemptedProviders,
                    });
                  }
                }
              } catch (subErr: any) {
                console.warn(`[AI Engine] Gemini ${modelName} failed:`, subErr?.message || subErr);
              }
            }
          } catch (err: any) {
            console.warn('[AI Engine] Gemini Image Generation failed:', err?.message || err);
          }
        }

        // 3. Replicate Flux Dev
        if (provider === 'replicate-flux-dev' && tokenToUse) {
          try {
            console.log('[AI Engine] Trying Replicate (flux-dev)...');
            const replicate = new Replicate({ auth: tokenToUse });
            const output = await replicate.run('black-forest-labs/flux-dev', {
              input: {
                prompt,
                aspect_ratio: aspectRatio,
                output_format: 'webp',
                output_quality: 90,
                num_inference_steps: 28,
              },
            });

            const imageUrl = Array.isArray(output) ? output[0] : output;
            if (imageUrl) {
              return res.json({
                imageUrl: String(imageUrl),
                provider: 'Replicate (Flux Dev)',
                attemptedProviders,
              });
            }
          } catch (err: any) {
            console.warn('[AI Engine] Replicate flux-dev failed:', err?.message || err);
          }
        }

        // 4. HuggingFace Inference API
        if (provider === 'huggingface' && hfTokenToUse) {
          try {
            console.log('[AI Engine] Trying HuggingFace Inference API...');
            const hfRes = await fetch('https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${hfTokenToUse}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ inputs: prompt }),
            });

            if (hfRes.ok) {
              const arrayBuffer = await hfRes.arrayBuffer();
              const base64 = Buffer.from(arrayBuffer).toString('base64');
              const imageUrl = `data:image/jpeg;base64,${base64}`;
              return res.json({
                imageUrl,
                provider: 'HuggingFace (Flux.1 Schnell)',
                attemptedProviders,
              });
            }
          } catch (err: any) {
            console.warn('[AI Engine] HuggingFace failed:', err?.message || err);
          }
        }
      }

      // If all cloud providers failed or returned unauthenticated (e.g. 401/404),
      // generate a high-res studio advertisement render fallback so the user can test the app
      console.log('[AI Engine] All cloud AI providers failed or returned 401/404. Generating Studio Fallback canvas...');
      const fallbackStudioImage = generateStudioFallbackSvg(prompt, aspectRatio);

      return res.json({
        imageUrl: fallbackStudioImage,
        provider: 'BOULT Studio Engine (Fallback Render)',
        attemptedProviders,
        needsApiKey: true,
        notice: 'Cloud AI endpoints returned 401/404 or lacked authorization. Rendered high-resolution studio ad template.',
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
