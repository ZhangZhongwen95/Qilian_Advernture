import React, { useState } from 'react';
import { CountyAdventureStory, AdventureChoice, Item, CountyData } from '../types';
import { Compass, BookOpen, Award, CheckCircle2, Flame, Heart, Sparkles, X } from 'lucide-react';

interface CountyAdventureModalProps {
  county: CountyData;
  story: CountyAdventureStory;
  onApplyReward: (statChange: AdventureChoice['statChange'], itemReward?: Item) => void;
  onClose: () => void;
}

export const CountyAdventureModal: React.FC<CountyAdventureModalProps> = ({
  county,
  story,
  onApplyReward,
  onClose,
}) => {
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState<number | null>(null);
  const [hasCompleted, setHasCompleted] = useState(false);

  const handleSelectChoice = (index: number) => {
    setSelectedChoiceIndex(index);
    const choice = story.choices[index];
    if (choice.statChange) {
      onApplyReward(choice.statChange, choice.statChange.itemReward);
    }
    setHasCompleted(true);
  };

  const selectedChoice = selectedChoiceIndex !== null ? story.choices[selectedChoiceIndex] : null;

  return (
    <div
      id="county-adventure-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-md animate-fadeIn"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-stone-900 border border-amber-600/40 shadow-2xl overflow-hidden font-sans">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-amber-900/40 bg-stone-950/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-950/60 border border-amber-600/30 text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-amber-200 tracking-wide font-serif">
                  {story.title}
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-900/50 text-amber-300 border border-amber-700/40">
                  {county.province} · {county.prefecture}
                </span>
              </div>
              <p className="text-xs text-stone-400">
                海拔 {county.altitude}m · {county.terrainType}
              </p>
            </div>
          </div>
          <button
            id="close-adventure-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-stone-200">
          {/* Scenic Badge */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-stone-950/60 border border-stone-800/80 text-xs">
            <div className="space-y-1">
              <span className="text-stone-400">自然胜迹:</span>
              <p className="font-semibold text-amber-300">{county.naturalLandmark.name}</p>
              <p className="text-[11px] text-stone-400 line-clamp-2">{county.naturalLandmark.description}</p>
            </div>
            <div className="space-y-1">
              <span className="text-stone-400">人文非遗:</span>
              <p className="font-semibold text-amber-300">{county.culturalLandmark.name}</p>
              <p className="text-[11px] text-stone-400 line-clamp-2">{county.ethnicFeatures.crafts}</p>
            </div>
          </div>

          {/* Narrative Introduction */}
          <div className="p-4 rounded-xl bg-stone-950/80 border border-stone-800 text-sm leading-relaxed text-stone-300 font-serif whitespace-pre-line">
            {story.intro}
          </div>

          {/* If not completed yet, show choices */}
          {!hasCompleted ? (
            <div className="space-y-3">
              <p className="text-xs font-medium text-amber-400 tracking-wider flex items-center gap-1.5">
                <Compass className="w-4 h-4" />
                <span>请做出你在【{county.name}】的探索抉择：</span>
              </p>
              <div className="space-y-2.5">
                {story.choices.map((choice, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectChoice(idx)}
                    className="w-full text-left p-3.5 rounded-xl bg-stone-800/70 hover:bg-amber-950/50 border border-stone-700/60 hover:border-amber-600/60 transition group text-xs sm:text-sm text-stone-200 hover:text-amber-200 font-serif flex items-start gap-2.5"
                  >
                    <span className="w-5 h-5 rounded-full bg-amber-950 border border-amber-600/40 text-amber-400 flex items-center justify-center text-[10px] font-mono shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{choice.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Result and Reward */
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-600/50 space-y-3">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>奇遇历练结语</span>
                </div>
                <div className="text-xs sm:text-sm text-stone-300 leading-relaxed font-serif whitespace-pre-line">
                  {selectedChoice?.narrativeResult}
                </div>
              </div>

              {/* Stat & Item Impact */}
              {selectedChoice?.statChange && (
                <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex flex-wrap items-center gap-4 text-xs">
                  <span className="text-stone-400 font-medium">历练收益:</span>
                  {selectedChoice.statChange.temp !== undefined && (
                    <span
                      className={`flex items-center gap-1 font-semibold ${
                        selectedChoice.statChange.temp >= 0 ? 'text-amber-400' : 'text-blue-400'
                      }`}
                    >
                      <Flame className="w-3.5 h-3.5" />
                      体温 {selectedChoice.statChange.temp >= 0 ? `+${selectedChoice.statChange.temp}°C` : `${selectedChoice.statChange.temp}°C`}
                    </span>
                  )}
                  {selectedChoice.statChange.stamina !== undefined && (
                    <span
                      className={`flex items-center gap-1 font-semibold ${
                        selectedChoice.statChange.stamina >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      <Heart className="w-3.5 h-3.5" />
                      精力 {selectedChoice.statChange.stamina >= 0 ? `+${selectedChoice.statChange.stamina}` : selectedChoice.statChange.stamina}
                    </span>
                  )}
                  {selectedChoice.statChange.itemReward && (
                    <span className="flex items-center gap-1.5 text-amber-300 font-semibold px-2 py-0.5 rounded-lg bg-amber-900/40 border border-amber-600/40">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      获得珍稀风物: {selectedChoice.statChange.itemReward.icon} {selectedChoice.statChange.itemReward.name}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-amber-900/40 bg-stone-950/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-stone-400">
            <Award className="w-4 h-4 text-amber-400" />
            <span>完成此地奇遇，将在 3D 舆图铭刻【亲历印戳】</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-700 hover:bg-amber-600 text-stone-100 text-xs sm:text-sm font-semibold transition shadow-md flex items-center gap-1.5"
          >
            <span>{hasCompleted ? '收入行囊并继续探索' : '稍后再探'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
