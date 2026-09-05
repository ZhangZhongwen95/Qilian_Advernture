import React from 'react';
import { Award, Compass, RefreshCw, Home, Sparkles } from 'lucide-react';

interface EndingModalProps {
  endingType: 'guardian' | 'harmony';
  onRestart: () => void;
  onContinueFreeRoam: () => void;
  onReturnToTitle: () => void;
}

export const EndingModal: React.FC<EndingModalProps> = ({
  endingType,
  onRestart,
  onContinueFreeRoam,
  onReturnToTitle,
}) => {
  const isGuardian = endingType === 'guardian';

  return (
    <div className="absolute inset-0 bg-stone-950/90 backdrop-blur-lg flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-stone-900 border border-stone-700 w-full max-w-xl rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center gap-5 text-stone-100">
        {/* Sacred Icon Badge */}
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl ${
            isGuardian
              ? 'bg-gradient-to-tr from-sky-600 to-indigo-600 text-sky-200 shadow-sky-900/40'
              : 'bg-gradient-to-tr from-amber-600 to-emerald-600 text-amber-100 shadow-amber-900/40'
          }`}
        >
          <Award className="w-8 h-8" />
        </div>

        {/* Title */}
        <div>
          <div className="text-xs font-mono tracking-widest text-stone-400 uppercase mb-1">
            祁连山海志 · 终章回响
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-100">
            {isGuardian ? '【风雪长宁 · 山岳孤绝】' : '【丝路春融 · 生生不息】'}
          </h2>
        </div>

        {/* Epilogue Poetry / Narration */}
        <div className="bg-stone-950/80 p-5 rounded-xl border border-stone-800 text-sm sm:text-base leading-relaxed text-stone-300 font-serif max-h-60 overflow-y-auto">
          {isGuardian ? (
            <p>
              你遵从了远古誓约，将祁连辟邪铜镜深埋于冰川之眼圣坛下方。玄冰裂隙缓缓弥合，万道霞光收敛于苍茫云海之中。
              <br /><br />
              狂暴的风雪化作温柔的呼啸，圣兽傲雪伫立在峰峦之巅，向你致以古老的敬意。祁连雪峰重归千载未染的孤绝与神圣，静默地俯瞰着人世间的沧海桑田。
            </p>
          ) : (
            <p>
              你手持古铜镜引聚天光，融化了千年玄冰凝滞的禁锢。涓涓春融之泉如玉带般从八一冰川奔涌而下，穿透冷杉雪涧，掠过丹霞红崖，奔向辽阔的河西走廊。
              <br /><br />
              荒漠泛起新绿，毡房升起炊烟，驼铃在绿洲重奏清音。人与大山在此达成了千载共生。祁连之灵的笑意化作漫天晨曦，照拂着丝绸古道生生不息的明天。
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 w-full pt-2">
          <button
            onClick={onContinueFreeRoam}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm transition shadow-lg shadow-amber-900/40"
          >
            <Compass className="w-4 h-4" />
            <span>继续自由漫游探索</span>
          </button>

          <button
            onClick={onRestart}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-sm transition border border-stone-700"
          >
            <RefreshCw className="w-4 h-4" />
            <span>重新启程历练</span>
          </button>

          <button
            onClick={onReturnToTitle}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 text-sm transition"
          >
            <Home className="w-4 h-4" />
            <span>返回主界面</span>
          </button>
        </div>
      </div>
    </div>
  );
};
