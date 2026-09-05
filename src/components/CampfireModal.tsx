import React from 'react';
import { Flame, Coffee, Utensils, X, ShieldCheck } from 'lucide-react';
import { Item, PlayerState } from '../types';

interface CampfireModalProps {
  player: PlayerState;
  inventory: Item[];
  onWarmUp: () => void;
  onBrewTea: () => void;
  onRoastBread: () => void;
  onClose: () => void;
}

export const CampfireModal: React.FC<CampfireModalProps> = ({
  player,
  inventory,
  onWarmUp,
  onBrewTea,
  onRoastBread,
  onClose,
}) => {
  const teaItem = inventory.find((i) => i.id === 'butter_tea');
  const breadItem = inventory.find((i) => i.id === 'barley_bread');

  return (
    <div className="absolute inset-0 bg-stone-950/70 backdrop-blur-md flex items-center justify-center p-4 z-40">
      <div className="bg-stone-900 border border-amber-500/40 w-full max-w-lg rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col gap-5 text-stone-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-rose-600 flex items-center justify-center shadow-lg shadow-amber-900/30">
              <Flame className="w-6 h-6 text-stone-100 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-amber-300">荒野暖心营火</h3>
              <p className="text-xs text-stone-400">红松柴火噼啪作响，驱散高山严寒与旅途疲倦</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status in Campfire */}
        <div className="grid grid-cols-2 gap-3 bg-stone-950/70 p-3.5 rounded-xl border border-stone-800">
          <div>
            <div className="text-xs text-stone-400 mb-1">当前核心体温</div>
            <div className="text-lg font-bold font-mono text-amber-400">
              {player.bodyTemp.toFixed(1)}°C
            </div>
          </div>
          <div>
            <div className="text-xs text-stone-400 mb-1">当前充沛精力</div>
            <div className="text-lg font-bold font-mono text-sky-400">
              {Math.round(player.stamina)} / {player.maxStamina}
            </div>
          </div>
        </div>

        {/* Campfire Actions */}
        <div className="flex flex-col gap-2.5">
          {/* Action 1: Rest & Warm up */}
          <button
            onClick={onWarmUp}
            className="flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-amber-950/60 to-stone-800 border border-amber-600/40 hover:border-amber-400 text-left transition group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-600/30 text-amber-400 group-hover:scale-105 transition">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-stone-100 group-hover:text-amber-300">
                  靠近火堆打坐取暖
                </div>
                <div className="text-xs text-stone-400">持续回升体温至37.0°C，快速恢复全部体力</div>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded bg-amber-500 text-stone-950 font-semibold">
              取暖
            </span>
          </button>

          {/* Action 2: Brew Butter Tea */}
          <button
            onClick={onBrewTea}
            disabled={!teaItem || teaItem.count <= 0}
            className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition group ${
              teaItem && teaItem.count > 0
                ? 'bg-stone-800/80 hover:bg-stone-800 border-stone-700 hover:border-sky-400/50'
                : 'bg-stone-900/50 border-stone-800 opacity-50 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-sky-900/30 text-sky-400">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-stone-200">
                  煮沸饮用浓郁酥油茶
                </div>
                <div className="text-xs text-stone-400">
                  体温 +3.5°C，赋予 50 秒持续御寒护盾（剩余: {teaItem?.count ?? 0} 份）
                </div>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded bg-stone-700 text-stone-200">
              饮用
            </span>
          </button>

          {/* Action 3: Roast Barley Bread */}
          <button
            onClick={onRoastBread}
            disabled={!breadItem || breadItem.count <= 0}
            className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition group ${
              breadItem && breadItem.count > 0
                ? 'bg-stone-800/80 hover:bg-stone-800 border-stone-700 hover:border-amber-400/50'
                : 'bg-stone-900/50 border-stone-800 opacity-50 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-900/30 text-amber-400">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-stone-200">
                  炙烤青稞干粮炒面
                </div>
                <div className="text-xs text-stone-400">
                  香脆充饥，快速补充 60 点体力（剩余: {breadItem?.count ?? 0} 份）
                </div>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded bg-stone-700 text-stone-200">
              炙烤
            </span>
          </button>
        </div>

        {/* Footer info */}
        <div className="flex items-center gap-2 text-xs text-stone-400 border-t border-stone-800 pt-3">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>在营火旁休息时，体温与体力将受到完全保护，不受外界风雪衰减。</span>
        </div>
      </div>
    </div>
  );
};
