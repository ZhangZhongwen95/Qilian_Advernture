import React, { useState } from 'react';
import { BookOpen, X, Mountain, Wind, History, Sparkles } from 'lucide-react';
import { LORE_ITEMS } from '../game/worldData';

interface LoreModalProps {
  onClose: () => void;
}

export const LoreModal: React.FC<LoreModalProps> = ({ onClose }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const currentItem = LORE_ITEMS[selectedIndex];

  const categoryIcons: Record<string, React.ReactNode> = {
    地理风貌: <Mountain className="w-4 h-4 text-emerald-400" />,
    古法秘术: <Wind className="w-4 h-4 text-sky-400" />,
    历史沉淀: <History className="w-4 h-4 text-amber-400" />,
    自然圣境: <Sparkles className="w-4 h-4 text-indigo-400" />,
  };

  return (
    <div className="absolute inset-0 bg-stone-950/75 backdrop-blur-md flex items-center justify-center p-4 z-40">
      <div className="bg-stone-900 border border-stone-700 w-full max-w-2xl rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4 text-stone-100 max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-950 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-stone-100">祁连风物志 · 典故图册</h3>
              <p className="text-xs text-stone-400">探寻丝绸之路、河西水塔与千载雪山的人文记忆</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2-Column Content */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 min-h-[300px]">
          {/* List of Lore Items */}
          <div className="flex flex-col gap-2 border-r border-stone-800/80 pr-2 overflow-y-auto">
            {LORE_ITEMS.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition ${
                  selectedIndex === idx
                    ? 'bg-indigo-950/60 border-indigo-500 text-indigo-200 shadow-sm'
                    : 'bg-stone-800/50 border-stone-800 text-stone-400 hover:bg-stone-800 hover:text-stone-200'
                }`}
              >
                {categoryIcons[item.category] || <Mountain className="w-4 h-4" />}
                <div className="overflow-hidden">
                  <div className="text-xs font-bold truncate">{item.title}</div>
                  <div className="text-[10px] text-stone-500">{item.category}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Details Pane */}
          <div className="sm:col-span-2 bg-stone-950/70 p-5 rounded-xl border border-stone-800 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
              {categoryIcons[currentItem.category]}
              <span>{currentItem.category}</span>
            </div>
            <h4 className="text-lg font-bold text-stone-100 font-serif">
              {currentItem.title}
            </h4>
            <div className="h-px bg-stone-800 my-1" />
            <p className="text-sm text-stone-300 leading-relaxed font-serif whitespace-pre-line">
              {currentItem.desc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
