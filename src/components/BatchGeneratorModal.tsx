import React, { useState } from 'react';
import { X, Layers, Play, CheckCircle2, AlertCircle, Download, FileText, Sparkles } from 'lucide-react';
import { saveImageNative, downloadJsonFile } from '../utils/nativeFileSystem';

interface BatchGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  replicateToken: string;
  geminiKey: string;
}

interface BatchItem {
  id: string;
  prompt: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  imageUrl?: string;
  errorMsg?: string;
}

export const BatchGeneratorModal: React.FC<BatchGeneratorModalProps> = ({
  isOpen,
  onClose,
  replicateToken,
  geminiKey,
}) => {
  const [promptsText, setPromptsText] = useState<string>(
    "1. BOULT smartwatch on glowing glass pedestal in neon night city\n2. BOULT sports neckband worn by runner in golden sunset light\n3. BOULT party speaker on DJ console with RGB light particles"
  );
  const [batchList, setBatchList] = useState<BatchItem[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16'>('1:1');

  if (!isOpen) return null;

  const parsePrompts = () => {
    const lines = promptsText
      .split('\n')
      .map((line) => line.replace(/^\d+[\.\)]\s*/, '').trim())
      .filter((line) => line.length > 0);

    const items: BatchItem[] = lines.map((p, idx) => ({
      id: `batch_${idx}_${Date.now()}`,
      prompt: p,
      status: 'idle',
    }));

    setBatchList(items);
  };

  const handleStartBatch = async () => {
    if (batchList.length === 0) parsePrompts();
    setIsProcessing(true);

    const updatedList = [...(batchList.length > 0 ? batchList : promptsText.split('\n').filter(Boolean).map((p, idx) => ({
      id: `batch_${idx}_${Date.now()}`,
      prompt: p.replace(/^\d+[\.\)]\s*/, '').trim(),
      status: 'idle' as const,
    })))];

    setBatchList(updatedList);

    for (let i = 0; i < updatedList.length; i++) {
      updatedList[i].status = 'loading';
      setBatchList([...updatedList]);

      try {
        const res = await fetch('/api/generate-ad', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: updatedList[i].prompt,
            aspectRatio,
            replicateToken,
            geminiKey,
          }),
        });

        const data = await res.json();
        if (data.imageUrl) {
          updatedList[i].status = 'success';
          updatedList[i].imageUrl = data.imageUrl;
        } else {
          updatedList[i].status = 'error';
          updatedList[i].errorMsg = data.error || 'Generation failed';
        }
      } catch (err: any) {
        updatedList[i].status = 'error';
        updatedList[i].errorMsg = err.message || 'Network error';
      }

      setBatchList([...updatedList]);
    }

    setIsProcessing(false);
  };

  const handleDownloadAll = () => {
    const successful = batchList.filter((item) => item.status === 'success' && item.imageUrl);
    successful.forEach((item, index) => {
      saveImageNative(item.imageUrl!, `BOULT_Batch_Ad_${index + 1}.png`);
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative space-y-5 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-slate-100">Batch Ad Generator Suite</h3>
              <p className="text-xs text-slate-400">Generate multiple commercial campaign images in one click</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Prompts Box */}
        {batchList.length === 0 ? (
          <div className="space-y-3 flex-1 overflow-y-auto">
            <label className="block text-xs font-semibold text-slate-300">
              Enter Prompts (One line per prompt):
            </label>
            <textarea
              value={promptsText}
              onChange={(e) => setPromptsText(e.target.value)}
              rows={6}
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl p-3.5 text-xs text-slate-100 font-mono focus:outline-none"
              placeholder="Prompt 1&#10;Prompt 2&#10;Prompt 3"
            />
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Aspect Ratio:</span>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as any)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200"
              >
                <option value="1:1">1:1 Square</option>
                <option value="16:9">16:9 Wide</option>
                <option value="9:16">9:16 Story</option>
              </select>
            </div>
          </div>
        ) : (
          /* Batch Queue Progress */
          <div className="space-y-2 flex-1 overflow-y-auto pr-1">
            {batchList.map((item, idx) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5 flex-1 truncate">
                  <span className="font-mono text-slate-500">{idx + 1}.</span>
                  <span className="truncate text-slate-200">{item.prompt}</span>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {item.status === 'idle' && <span className="text-slate-500 font-mono">Queued</span>}
                  {item.status === 'loading' && (
                    <span className="text-amber-400 flex items-center gap-1 font-semibold animate-pulse">
                      <Sparkles className="w-3.5 h-3.5 animate-spin" /> Generating...
                    </span>
                  )}
                  {item.status === 'success' && (
                    <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-4 h-4" /> Ready
                    </span>
                  )}
                  {item.status === 'error' && (
                    <span className="text-rose-400 flex items-center gap-1 font-semibold" title={item.errorMsg}>
                      <AlertCircle className="w-4 h-4" /> Failed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          {batchList.length > 0 && (
            <button
              onClick={() => setBatchList([])}
              disabled={isProcessing}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Reset List
            </button>
          )}

          <div className="flex items-center gap-3 ml-auto">
            {batchList.some((i) => i.status === 'success') && (
              <button
                onClick={handleDownloadAll}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Download All Images</span>
              </button>
            )}

            <button
              onClick={handleStartBatch}
              disabled={isProcessing || !promptsText.trim()}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md shadow-amber-500/20 disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>{isProcessing ? 'Processing Batch...' : 'Start Batch Run'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
