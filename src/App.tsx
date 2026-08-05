import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { PromptForm } from './components/PromptForm';
import { ImageDisplay } from './components/ImageDisplay';
import { PresetSelector } from './components/PresetSelector';
import { HistoryGallery } from './components/HistoryGallery';
import { ApiSettingsModal } from './components/ApiSettingsModal';
import { BatchGeneratorModal } from './components/BatchGeneratorModal';
import { InpaintingStudioModal } from './components/InpaintingStudioModal';
import { CanvasStudioModal } from './components/CanvasStudioModal';
import { DEFAULT_PROMPT } from './data/presets';
import { AdGenerationRequest, AdHistoryItem, PresetPrompt } from './types';
import { Sparkles } from 'lucide-react';

export function App() {
  const [prompt, setPrompt] = useState<string>(DEFAULT_PROMPT);
  const [selectedPresetId, setSelectedPresetId] = useState<string | undefined>('boult-default');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [currentAd, setCurrentAd] = useState<AdHistoryItem | null>(null);
  const [history, setHistory] = useState<AdHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('boult_ad_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Custom user keys stored in localStorage
  const [replicateToken, setReplicateToken] = useState<string>(() => localStorage.getItem('boult_replicate_token') || '');
  const [geminiKey, setGeminiKey] = useState<string>(() => localStorage.getItem('boult_gemini_key') || '');

  // Server config state
  const [hasServerReplicate, setHasServerReplicate] = useState<boolean>(false);
  const [hasServerGemini, setHasServerGemini] = useState<boolean>(false);
  const [isLoadingConfig, setIsLoadingConfig] = useState<boolean>(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isBatchOpen, setIsBatchOpen] = useState<boolean>(false);
  const [isInpaintingOpen, setIsInpaintingOpen] = useState<boolean>(false);
  const [isCanvasStudioOpen, setIsCanvasStudioOpen] = useState<boolean>(false);

  // Fetch backend config capabilities
  const fetchConfig = async () => {
    setIsLoadingConfig(true);
    try {
      const res = await fetch('/api/config');
      if (res.ok) {
        const data = await res.json();
        setHasServerReplicate(data.hasReplicateToken);
        setHasServerGemini(data.hasGeminiKey);
      }
    } catch (e) {
      console.error('Failed to fetch config:', e);
    } finally {
      setIsLoadingConfig(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('boult_ad_history', JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save history:', e);
    }
  }, [history]);

  const handleSaveKeys = (repToken: string, gemKey: string) => {
    setReplicateToken(repToken);
    setGeminiKey(gemKey);
    localStorage.setItem('boult_replicate_token', repToken);
    localStorage.setItem('boult_gemini_key', gemKey);
    setError(null);
  };

  const handleSelectPreset = (preset: PresetPrompt) => {
    setPrompt(preset.prompt);
    setSelectedPresetId(preset.id);
  };

  const handleApplyInpaintingComposite = (compositeUrl: string) => {
    const newItem: AdHistoryItem = {
      id: `inpaint_${Date.now()}`,
      prompt: `Product Studio Placement: ${prompt.slice(0, 60)}...`,
      imageUrl: compositeUrl,
      provider: 'Product Placement Studio',
      aspectRatio: '1:1',
      createdAt: Date.now(),
      hasProductOverlay: true,
    };
    setCurrentAd(newItem);
    setHistory((prev) => [newItem, ...prev]);
  };

  const handleSaveCanvasStudioOutput = (dataUrl: string) => {
    const newItem: AdHistoryItem = {
      id: `canvas_${Date.now()}`,
      prompt: `2D Canvas Brand Composition: ${prompt.slice(0, 60)}...`,
      imageUrl: dataUrl,
      provider: '2D Canvas Overlay Studio',
      aspectRatio: '1:1',
      createdAt: Date.now(),
      hasProductOverlay: true,
    };
    setCurrentAd(newItem);
    setHistory((prev) => [newItem, ...prev]);
  };

  // Enhance prompt via server
  const handleEnhancePrompt = async () => {
    if (!prompt.trim() || isEnhancing) return;
    setIsEnhancing(true);
    try {
      const res = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, geminiKey }),
      });
      const data = await res.json();
      if (data.enhancedPrompt) {
        setPrompt(data.enhancedPrompt);
      }
    } catch (e) {
      console.error('Enhance failed:', e);
    } finally {
      setIsEnhancing(false);
    }
  };

  // Generate Ad Submit
  const handleGenerate = async (req: AdGenerationRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/generate-ad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...req,
          replicateToken: req.replicateToken || replicateToken,
          geminiKey: req.geminiKey || geminiKey,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || data.message || 'Failed to generate ad image');
        if (data.needsApiKey) {
          setIsSettingsOpen(true);
        }
        return;
      }

      if (data.imageUrl) {
        const newItem: AdHistoryItem = {
          id: `ad_${Date.now()}`,
          prompt: req.prompt,
          imageUrl: data.imageUrl,
          provider: data.provider || 'AI Model',
          aspectRatio: req.aspectRatio || '1:1',
          createdAt: Date.now(),
          stylePreset: selectedPresetId,
        };

        setCurrentAd(newItem);
        setHistory((prev) => [newItem, ...prev]);
      }
    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err.message || 'Network error during image generation');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar
        hasReplicate={hasServerReplicate || Boolean(replicateToken)}
        hasGemini={hasServerGemini || Boolean(geminiKey)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenBatch={() => setIsBatchOpen(true)}
        onOpenInpainting={() => setIsInpaintingOpen(true)}
        onOpenCanvasStudio={() => setIsCanvasStudioOpen(true)}
        isLoadingConfig={isLoadingConfig}
        onRefreshConfig={fetchConfig}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Tagline */}
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>BOULT AUDIO & LIFESTYLE AI CREATIVE STUDIO</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white">
            Transform Ideas into <span className="text-amber-400">Cinematic AI Ads</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400">
            Craft high-resolution commercial photos for earbuds, smartwatches, and audio gear powered by Flux Schnell & Gemini Imagen.
          </p>
        </div>

        {/* Main Generator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Input Form */}
          <div className="lg:col-span-6 space-y-6">
            <PromptForm
              onSubmit={handleGenerate}
              isLoading={isLoading}
              prompt={prompt}
              setPrompt={(p) => {
                setPrompt(p);
                setSelectedPresetId(undefined);
              }}
              onEnhancePrompt={handleEnhancePrompt}
              isEnhancing={isEnhancing}
            />
          </div>

          {/* Right Column: Generated Image View */}
          <div className="lg:col-span-6">
            <ImageDisplay
              currentAd={currentAd}
              isLoading={isLoading}
              error={error}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onOpenCanvasStudio={() => setIsCanvasStudioOpen(true)}
            />
          </div>
        </div>

        {/* Style Preset Selector */}
        <PresetSelector
          onSelectPreset={handleSelectPreset}
          selectedId={selectedPresetId}
        />

        {/* History Gallery */}
        <HistoryGallery
          history={history}
          onSelectAd={(ad) => setCurrentAd(ad)}
          onClearHistory={() => {
            setHistory([]);
            setCurrentAd(null);
            localStorage.removeItem('boult_ad_history');
          }}
          currentId={currentAd?.id}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>© BOULT AI Ad Generator Tool • Define Your Vibe</p>
      </footer>

      {/* Modals */}
      <ApiSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        replicateToken={replicateToken}
        geminiKey={geminiKey}
        onSaveKeys={handleSaveKeys}
        hasServerReplicate={hasServerReplicate}
        hasServerGemini={hasServerGemini}
      />

      <BatchGeneratorModal
        isOpen={isBatchOpen}
        onClose={() => setIsBatchOpen(false)}
        replicateToken={replicateToken}
        geminiKey={geminiKey}
      />

      <InpaintingStudioModal
        isOpen={isInpaintingOpen}
        onClose={() => setIsInpaintingOpen(false)}
        bgImageUrl={currentAd?.imageUrl}
        onApplyComposite={handleApplyInpaintingComposite}
      />

      <CanvasStudioModal
        isOpen={isCanvasStudioOpen}
        onClose={() => setIsCanvasStudioOpen(false)}
        bgImageUrl={currentAd?.imageUrl}
        onSaveToGallery={handleSaveCanvasStudioOutput}
      />
    </div>
  );
}



