import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { PromptForm, ModelOptionId } from './components/PromptForm';
import { ImageDisplay } from './components/ImageDisplay';
import { PresetSelector } from './components/PresetSelector';
import { HistoryGallery } from './components/HistoryGallery';
import { ApiSettingsModal } from './components/ApiSettingsModal';
import { BatchGeneratorModal } from './components/BatchGeneratorModal';
import { InpaintingStudioModal } from './components/InpaintingStudioModal';
import { CanvasStudioModal } from './components/CanvasStudioModal';
import { NanoBananaPromptsGallery } from './components/NanoBananaPromptsGallery';
import { DEFAULT_PROMPT } from './data/presets';
import { AdGenerationRequest, AdHistoryItem, PresetPrompt, UserProfile } from './types';
import { Sparkles, X } from 'lucide-react';
import { dbService } from './services/dbService';
import { googleAuthService } from './services/googleAuth';

export function App() {
  const [prompt, setPrompt] = useState<string>(DEFAULT_PROMPT);
  const [selectedPresetId, setSelectedPresetId] = useState<string | undefined>('boult-default');
  const [selectedModel, setSelectedModel] = useState<ModelOptionId>('gemini-3.1-flash-lite-image');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Google User Authentication Profile State
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthPromptOpen, setIsAuthPromptOpen] = useState<boolean>(false);

  const [currentAd, setCurrentAd] = useState<AdHistoryItem | null>(null);
  const [history, setHistory] = useState<AdHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('boult_ad_history');
      if (!saved) return [];
      const parsed: AdHistoryItem[] = JSON.parse(saved);
      return Array.from(new Map(parsed.map((item, idx) => [`${item.id}_${idx}`, item])).values());
    } catch {
      return [];
    }
  });

  // Server config state
  const [hasServerReplicate, setHasServerReplicate] = useState<boolean>(false);
  const [hasServerGemini, setHasServerGemini] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isBatchOpen, setIsBatchOpen] = useState<boolean>(false);
  const [isInpaintingOpen, setIsInpaintingOpen] = useState<boolean>(false);
  const [isCanvasStudioOpen, setIsCanvasStudioOpen] = useState<boolean>(false);
  const [isNanoBananaOpen, setIsNanoBananaOpen] = useState<boolean>(false);

  // Initialize stored Google User Profile
  useEffect(() => {
    async function loadUserProfile() {
      let profile = await googleAuthService.getStoredProfile();
      if (!profile) {
        profile = await googleAuthService.signInWithGoogle();
      }
      setUserProfile(profile);
    }
    loadUserProfile();
  }, []);

  // Load IndexedDB history on initialization
  const loadHistoryFromDB = async () => {
    try {
      const dbAds = await dbService.getAds();
      if (dbAds && dbAds.length > 0) {
        const formatted: AdHistoryItem[] = dbAds.map((ad) => ({
          id: ad.id,
          prompt: ad.prompt,
          imageUrl: ad.imageUrl,
          provider: ad.category || 'AI Model',
          aspectRatio: (ad.aspectRatio as any) || '1:1',
          createdAt: ad.createdAt,
        }));
        const unique = Array.from(new Map(formatted.map((item) => [item.id, item])).values());
        setHistory(unique);
        if (unique.length > 0) {
          setCurrentAd(unique[0]);
        }
      }
    } catch (err) {
      console.warn('IndexedDB initial load error:', err);
    }
  };

  useEffect(() => {
    loadHistoryFromDB();
    async function loadPreferredModel() {
      const savedModel = await dbService.getSetting<ModelOptionId>('preferred_ai_model', 'gemini-3.1-flash-lite-image');
      if (savedModel) {
        setSelectedModel(savedModel);
      }
    }
    loadPreferredModel();
  }, []);

  const handleSelectModel = (model: ModelOptionId) => {
    setSelectedModel(model);
    dbService.saveSetting('preferred_ai_model', model);
  };

  // Fetch backend config capabilities
  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/config');
      if (res.ok) {
        const data = await res.json();
        setHasServerReplicate(data.hasReplicateToken);
        setHasServerGemini(data.hasGeminiKey);
      }
    } catch (e) {
      console.error('Failed to fetch config:', e);
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

  // Google Sign In & Sign Out Handlers
  const handleSignInWithGoogle = async () => {
    try {
      const profile = await googleAuthService.signInWithGoogle();
      setUserProfile(profile);
      setIsAuthPromptOpen(false);
      setError(null);
    } catch (err) {
      console.error('Google Auth error:', err);
    }
  };

  const handleSignOut = async () => {
    await googleAuthService.signOut();
    setUserProfile(null);
  };

  const handleSelectPreset = (preset: PresetPrompt) => {
    setPrompt(preset.prompt);
    setSelectedPresetId(preset.id);
  };

  const saveAdToDBAndState = (newItem: AdHistoryItem) => {
    setCurrentAd(newItem);
    setHistory((prev) => {
      if (prev.some((item) => item.id === newItem.id)) return prev;
      return [newItem, ...prev];
    });

    dbService.saveAd({
      id: newItem.id,
      title: newItem.prompt.slice(0, 40),
      category: newItem.provider,
      imageUrl: newItem.imageUrl,
      prompt: newItem.prompt,
      createdAt: newItem.createdAt,
      aspectRatio: newItem.aspectRatio,
    });
    dbService.addPromptHistory(newItem.prompt, newItem.provider);
  };

  const handleApplyInpaintingComposite = (compositeUrl: string) => {
    const newItem: AdHistoryItem = {
      id: `inpaint_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      prompt: `Product Studio Placement: ${prompt.slice(0, 60)}...`,
      imageUrl: compositeUrl,
      provider: 'Product Placement Studio',
      aspectRatio: '1:1',
      createdAt: Date.now(),
      hasProductOverlay: true,
    };
    saveAdToDBAndState(newItem);
  };

  const handleSaveCanvasStudioOutput = (dataUrl: string) => {
    const newItem: AdHistoryItem = {
      id: `canvas_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      prompt: `2D Canvas Brand Composition: ${prompt.slice(0, 60)}...`,
      imageUrl: dataUrl,
      provider: '2D Canvas Overlay Studio',
      aspectRatio: '1:1',
      createdAt: Date.now(),
      hasProductOverlay: true,
    };
    saveAdToDBAndState(newItem);
  };

  // Enhance prompt via server
  const handleEnhancePrompt = async () => {
    if (!prompt.trim() || isEnhancing) return;
    setIsEnhancing(true);
    try {
      const useCustomKey = await dbService.getSetting<boolean>('use_custom_gemini_api_key', false);
      const customKey = await dbService.getSetting<string>('custom_gemini_api_key', '');

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(userProfile?.idToken ? { Authorization: `Bearer ${userProfile.idToken}` } : {}),
      };
      if (useCustomKey && customKey && customKey.trim()) {
        headers['x-custom-api-key'] = customKey.trim();
      }

      const res = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers,
        body: JSON.stringify({ prompt, idToken: userProfile?.idToken }),
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

  // Generate Ad Submit with Google OAuth Proxy
  const handleGenerate = async (req: AdGenerationRequest) => {
    let activeProfile = userProfile;
    if (!activeProfile) {
      activeProfile = await googleAuthService.signInWithGoogle();
      setUserProfile(activeProfile);
    }

    setIsLoading(true);
    setError(null);

    try {
      const activeToken = activeProfile?.idToken;
      const useCustomKey = await dbService.getSetting<boolean>('use_custom_gemini_api_key', false);
      const customKey = await dbService.getSetting<string>('custom_gemini_api_key', '');

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
      };
      if (useCustomKey && customKey && customKey.trim()) {
        headers['x-custom-api-key'] = customKey.trim();
      }

      const res = await fetch('/api/generate-ad', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...req,
          selectedModel: req.selectedModel || selectedModel,
          idToken: activeToken,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || data.message || 'Failed to generate ad image');
        return;
      }

      if (data.imageUrl) {
        const newItem: AdHistoryItem = {
          id: `ad_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          prompt: req.prompt,
          imageUrl: data.imageUrl,
          provider: data.provider || 'AI Model',
          aspectRatio: req.aspectRatio || '1:1',
          createdAt: Date.now(),
          stylePreset: selectedPresetId,
        };

        saveAdToDBAndState(newItem);
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
        userProfile={userProfile}
        hasReplicate={hasServerReplicate}
        hasGemini={hasServerGemini}
        onSignInWithGoogle={handleSignInWithGoogle}
        onSignOut={handleSignOut}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenBatch={() => setIsBatchOpen(true)}
        onOpenInpainting={() => setIsInpaintingOpen(true)}
        onOpenCanvasStudio={() => setIsCanvasStudioOpen(true)}
        onOpenNanoBananaGallery={() => setIsNanoBananaOpen(true)}
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
              selectedModel={selectedModel}
              onSelectModel={handleSelectModel}
              onOpenNanoBananaGallery={() => setIsNanoBananaOpen(true)}
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
        userProfile={userProfile}
        onSignInWithGoogle={handleSignInWithGoogle}
        onSignOut={handleSignOut}
        hasServerReplicate={hasServerReplicate}
        hasServerGemini={hasServerGemini}
        onBackupRestored={loadHistoryFromDB}
      />

      <BatchGeneratorModal
        isOpen={isBatchOpen}
        onClose={() => setIsBatchOpen(false)}
        replicateToken={userProfile?.idToken || ''}
        geminiKey={userProfile?.idToken || ''}
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

      <NanoBananaPromptsGallery
        isOpen={isNanoBananaOpen}
        onClose={() => setIsNanoBananaOpen(false)}
        onApplyPrompt={(newPromptText) => {
          setPrompt(newPromptText);
          setSelectedPresetId(undefined);
        }}
      />

      {/* Unauthenticated Auth Prompt Modal */}
      {isAuthPromptOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl relative">
            <button
              onClick={() => setIsAuthPromptOpen(false)}
              className="absolute top-3 right-3 p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-full bg-white text-slate-900 mx-auto flex items-center justify-center shadow-md">
              <svg className="w-7 h-7" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>

            <div className="space-y-1">
              <h3 className="font-display font-bold text-base text-slate-100">Sign in with Google</h3>
              <p className="text-xs text-slate-400">
                Authenticate with Google to access BOULT AI Ad Studio & generate cinematic ads via server proxy.
              </p>
            </div>

            <button
              onClick={handleSignInWithGoogle}
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <span>Sign in with Google Account</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
