import React, { useState, useRef } from 'react';
import { X, Key, Save, CheckCircle2, AlertCircle, Info, Database, Download, Upload } from 'lucide-react';
import { dbService } from '../services/dbService';

interface ApiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  replicateToken: string;
  geminiKey: string;
  onSaveKeys: (replicateToken: string, geminiKey: string) => void;
  hasServerReplicate: boolean;
  hasServerGemini: boolean;
  onBackupRestored?: () => void;
}

export const ApiSettingsModal: React.FC<ApiSettingsModalProps> = ({
  isOpen,
  onClose,
  replicateToken,
  geminiKey,
  onSaveKeys,
  hasServerReplicate,
  hasServerGemini,
  onBackupRestored,
}) => {
  const [repTokenInput, setRepTokenInput] = useState(replicateToken);
  const [gemKeyInput, setGemKeyInput] = useState(geminiKey);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [backupMessage, setBackupMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveKeys(repTokenInput.trim(), gemKeyInput.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
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
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-slate-100">API Credentials</h3>
              <p className="text-xs text-slate-400">Configure Replicate or Gemini for image generation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Server Status Info */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
            <Info className="w-4 h-4 text-amber-400" />
            <span>Environment Config Status:</span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${hasServerReplicate ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
              <span className="text-slate-300">Replicate: {hasServerReplicate ? 'Active in env' : 'Not in env'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${hasServerGemini ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
              <span className="text-slate-300">Gemini: {hasServerGemini ? 'Active in env' : 'Not in env'}</span>
            </div>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Replicate API Token (`REPLICATE_API_TOKEN`)
            </label>
            <input
              type="password"
              value={repTokenInput}
              onChange={(e) => setRepTokenInput(e.target.value)}
              placeholder={hasServerReplicate ? "●●●●●●●● (Using server environment key)" : "r8_..."}
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-mono"
            />
            <p className="text-[11px] text-slate-500 mt-1">Required for `black-forest-labs/flux-schnell` model.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Gemini API Key (`GEMINI_API_KEY`)
            </label>
            <input
              type="password"
              value={gemKeyInput}
              onChange={(e) => setGemKeyInput(e.target.value)}
              placeholder={hasServerGemini ? "●●●●●●●● (Using server environment key)" : "AIzaSy..."}
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-mono"
            />
            <p className="text-[11px] text-slate-500 mt-1">Required for Gemini Imagen 3 image generation & prompt enhancement.</p>
          </div>

          {/* Database Sync & Backup */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-amber-400" />
                IndexedDB Database Backup & Restore
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

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Keys</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
