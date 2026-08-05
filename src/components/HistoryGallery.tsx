import React from 'react';
import { History, Download, Trash2, Image as ImageIcon } from 'lucide-react';
import { AdHistoryItem } from '../types';

interface HistoryGalleryProps {
  history: AdHistoryItem[];
  onSelectAd: (ad: AdHistoryItem) => void;
  onClearHistory: () => void;
  currentId?: string;
}

export const HistoryGallery: React.FC<HistoryGalleryProps> = ({
  history,
  onSelectAd,
  onClearHistory,
  currentId,
}) => {
  if (history.length === 0) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <History className="w-4 h-4 text-amber-400" />
          <span>Recent Generations History ({history.length})</span>
        </h3>
        <button
          onClick={onClearHistory}
          className="text-xs text-slate-500 hover:text-rose-400 flex items-center gap-1 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear History</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {history.map((item) => {
          const isSelected = currentId === item.id;
          return (
            <div
              key={item.id}
              onClick={() => onSelectAd(item)}
              className={`group relative rounded-xl overflow-hidden border cursor-pointer transition-all aspect-square bg-slate-950 ${
                isSelected
                  ? 'border-amber-500 ring-2 ring-amber-500/30'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <img
                src={item.imageUrl}
                alt={item.prompt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end">
                <p className="text-[10px] text-slate-200 font-medium line-clamp-2">
                  {item.prompt}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
