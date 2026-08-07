import React, { useState, useRef, useEffect } from 'react';
import { X, ShieldCheck, Database, Download, Upload, LogOut, CheckCircle2, Cpu, Key, Eye, EyeOff, Save } from 'lucide-react';
import { dbService } from '../services/dbService';
import { UserProfile } from '../types';

interface ApiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile | null;
  onSignInWithGoogle: () => void;
  onSignOut: () => void;
  hasServerReplicate: boolean;
  hasServerGemini: boolean;
  onBackupRestored?: () => void;
}

export const ApiSettingsModal: React.FC<ApiSettingsModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onSignInWithGoogle,
  onSignOut,
  hasServerReplicate,
  hasServerGemini,
  onBackupRestored,
}) => {
  const [backupMessage, setBackupMessage] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Custom API Key Override state
  const [useCustomKey, setUseCustomKey] = useState<boolean>(false);
  const [customKey, setCustomKey] = useState<string>('');
  const [showKey, setShowKey] = useState<boolean>(false);
  const [keySavedStatus, setKeySavedStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    async function loadCustomKeySettings() {
      try {
        const enabled = await dbService.getSetting<boolean>('use_custom_gemini_api_key', false);
        const storedKey = await dbService.getSetting<string>('custom_gemini_api_key', '');
        setUseCustomKey(enabled);
        setCustomKey(storedKey);
      } catch (err) {
        console.warn('Failed loading custom key settings:', err);
      }
    }
    loadCustomKeySettings();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleCustomKey = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const enabled = e.target.checked;
    setUseCustomKey(enabled);
    await dbService.saveSetting('use_custom_gemini_api_key', enabled);
    setKeySavedStatus(enabled ? 'Custom Key Override Enabled' : 'Custom Key Override Disabled');
    setTimeout(() => setKeySavedStatus(null), 2500);
  };

  const handleSaveCustomKey = async () => {
    const trimmed = customKey.trim();
    await dbService.saveSetting('custom_gemini_api_key', trimmed);
    await dbService.saveSetting('use_custom_gemini_api_key', useCustomKey);
    setKeySavedStatus('Key Saved to IndexedDB');
    setTimeout(() => setKeySavedStatus(null), 2500);
  };

  const handleExportBackup = async () => {
    try {
      const backupJson = await dbService.exportFullBackup();
      const blob = new Blob([backupJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `boult_ad_studio_backup_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setBackupMessage('Database exported successfully!');
      setTimeout(() => setBackupMessage(null), 3000);
    } catch (err) {
      setBackupMessage('Export failed.');
      setTimeout(() => setBackupMessage(null), 3000);
    }
  };

  const handleImportBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const success = await dbService.importFullBackup(text);
      if (success) {
        setBackupMessage('Backup imported successfully!');
        if (onBackupRestored) onBackupRestored();
      } else {
        setBackupMessage('Failed to parse backup JSON.');
      }
    } catch (err) {
      setBackupMessage('Failed to import backup.');
    } finally {
      setTimeout(() => setBackupMessage(null), 3000);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-slate-100">Google Account & Proxy</h3>
              <p className="text-xs text-slate-400">Server-side secure proxy & OAuth authentication</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Google Profile Section */}
        {userProfile ? (
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              {!imgError && userProfile.picture ? (
                <img
                  src={userProfile.picture}
                  alt={userProfile.name}
                  onError={() => setImgError(true)}
                  className="w-12 h-12 rounded-full border-2 border-amber-500/50 object-cover shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 font-black text-lg flex items-center justify-center shrink-0">
                  {userProfile.name?.charAt(0) || 'G'}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-slate-100 truncate">{userProfile.name}</div>
                <div className="text-xs text-slate-400 truncate">{userProfile.email}</div>
                <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full mt-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Google Account Verified</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px] font-mono truncate">ID: {userProfile.sub}</span>
              <button
                type="button"
                onClick={onSignOut}
                className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5 rounded-xl bg-slate-950/90 border border-amber-500/30 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-white text-slate-900 font-bold mx-auto flex items-center justify-center shadow-md">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
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
              <h4 className="font-bold text-sm text-slate-100">Sign in with Google</h4>
              <p className="text-xs text-slate-400">
                Connect your Google Account to unlock server-side AI image generation without manual API key entry.
              </p>
            </div>
            <button
              onClick={onSignInWithGoogle}
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
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
              <span>Authenticate with Google</span>
            </button>
          </div>
        )}

        {/* Custom API Key Overrides Section */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" />
              <div>
                <h4 className="font-bold text-xs text-slate-200">Custom API Key Overrides</h4>
                <p className="text-[11px] text-slate-400">Bypass server free quota limits with your own Gemini API Key</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={useCustomKey}
                onChange={handleToggleCustomKey}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          {useCustomKey && (
            <div className="pt-2 border-t border-slate-800/80 space-y-2">
              <label className="block text-[11px] font-semibold text-slate-300">
                Use My Own Gemini API Key
              </label>
              <div className="relative flex items-center">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={customKey}
                  onChange={(e) => setCustomKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full py-2 pl-3 pr-20 bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-lg text-xs text-slate-100 placeholder-slate-500 outline-none font-mono transition-colors"
                />
                <div className="absolute right-1.5 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="p-1.5 rounded text-slate-400 hover:text-slate-200 transition-colors"
                    title={showKey ? 'Hide Key' : 'Show Key'}
                  >
                    {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveCustomKey}
                    className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] rounded transition-colors flex items-center gap-1 shadow"
                  >
                    <Save className="w-3 h-3" />
                    <span>Save</span>
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-slate-400">
                Saved securely in local browser IndexedDB and attached as <code className="text-amber-400 font-mono">x-custom-api-key</code> in request payloads.
              </p>
            </div>
          )}

          {keySavedStatus && (
            <div className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1 animate-pulse">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{keySavedStatus}</span>
            </div>
          )}
        </div>

        {/* Server AI Proxy Engines Status */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
            <Cpu className="w-4 h-4 text-amber-400" />
            <span>Server Proxy AI Engines:</span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${hasServerGemini || (useCustomKey && customKey.trim().length > 0) ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
              <span className="text-slate-300">
                Gemini Proxy: {useCustomKey && customKey.trim().length > 0 ? 'Custom Key Active' : hasServerGemini ? 'Active' : 'Proxy Mode'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${hasServerReplicate ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
              <span className="text-slate-300">Replicate Proxy: {hasServerReplicate ? 'Active' : 'Proxy Mode'}</span>
            </div>
          </div>
        </div>

        {/* Database Sync & Backup */}
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-amber-400" />
              IndexedDB Local Backup & Restore
            </span>
          </div>

          {backupMessage && (
            <p className="text-[11px] font-semibold text-amber-400 animate-pulse">{backupMessage}</p>
          )}

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={handleExportBackup}
              className="py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-200 font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Export Backup</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-200 font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-amber-400" />
              <span>Restore JSON</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
