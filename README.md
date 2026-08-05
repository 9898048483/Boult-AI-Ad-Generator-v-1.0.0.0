# BOULT AI Ad Generator

A high-end commercial ad image generator tool built with React, Vite, Express, and Tailwind CSS.

## Features
- **Flux Schnell & Gemini Imagen**: Generate ultra-detailed advertisement photos using Replicate (`black-forest-labs/flux-schnell`) or Gemini (`imagen-3.0-generate-002`).
- **AI Prompt Enhancer**: Convert basic product prompts into 8K cinematic ad prompts matching BOULT audio and tech lifestyle aesthetics.
- **Multiple Aspect Ratios**: Support for 1:1 Square, 16:9 Wide, 9:16 Story, and 4:3 Standard ad formats.
- **Preset Ad Templates**: Quick-start templates for Studio Loft, Cyberpunk Neon, Sports & Fitness, Minimalist Luxury, Smartwatch, and Party Speakers.
- **Session History & Lightbox**: Review and download high-resolution ad images.

## Configuration
Set environment variables in `.env`:
```env
REPLICATE_API_TOKEN=your_replicate_token
GEMINI_API_KEY=your_gemini_api_key
```

