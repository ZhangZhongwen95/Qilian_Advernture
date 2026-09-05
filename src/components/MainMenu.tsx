import React from 'react';
import { Play, RotateCcw, BookOpen, Github, Compass, Volume2, VolumeX, Flame } from 'lucide-react';
import { GameSaveData } from '../types';

interface MainMenuProps {
  hasSave: boolean;
  saveData?: GameSaveData | null;
  isMuted: boolean;
  onToggleMute: () => void;
  onStartNewGame: () => void;
  onContinueGame: () => void;
  onOpenLore: () => void;
  onOpenDeployGuide: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  hasSave,
  saveData,
  isMuted,
  onToggleMute,
  onStartNewGame,
  onContinueGame,
  onOpenLore,
  onOpenDeployGuide,
}) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 overflow-hidden select-none bg-stone-950">
      {/* Procedural Atmospheric Gradient & Mountain Silhouette */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-900 via-stone-950 to-stone-950" />

      {/* Decorative mountain peaks silhouette */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 opacity-30 pointer-events-none">
        <svg viewBox="0 0 1000 400" className="w-full h-full preserve-3d" preserveAspectRatio="none">
          <polygon points="0,400 150,150 350,280 520,80 720,240 880,120 1000,400" fill="#475569" />
          <polygon points="0,400 220,220 480,320 660,160 850,300 1000,400" fill="#1e293b" />
        </svg>
      </div>

      {/* Subtle snow particles overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      {/* Sound Toggle (Top Right) */}
      <div className="absolute top-5 right-5 z-20">
        <button
          onClick={onToggleMute}
          className="p-2.5 rounded-full bg-stone-900/80 hover:bg-stone-800 border border-stone-700 text-stone-300 hover:text-stone-100 transition shadow-lg flex items-center gap-2 text-xs"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-stone-500" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          <span>{isMuted ? '静音' : '音效开启'}</span>
        </button>
      </div>

      {/* Main Container Card */}
      <div className="relative z-10 max-w-lg w-full flex flex-col items-center text-center gap-6 p-6 sm:p-10 rounded-3xl bg-stone-900/80 backdrop-blur-xl border border-stone-800 shadow-2xl">
        {/* Title Stamp & Heading */}
        <div className="flex flex-col items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-serif tracking-widest">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>河西咽喉 · 万仞天境</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold font-serif tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-stone-100 via-amber-100 to-amber-300 drop-shadow-sm mt-1">
            祁连山海志
          </h1>

          <p className="text-xs sm:text-sm text-stone-400 font-serif max-w-sm mt-1 leading-relaxed">
            步入丝路与雪峰相映的祁连群峦，运【听山】秘术探隐微，生营火以抗严寒，抉择雪脉千载命运。
          </p>
        </div>

        {/* Menu Buttons */}
        <div className="flex flex-col gap-3 w-full max-w-xs">
          {/* Continue Game (if save available) */}
          {hasSave && (
            <button
              onClick={onContinueGame}
              className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-stone-950 font-bold text-sm transition-all shadow-lg shadow-emerald-950/50"
            >
              <RotateCcw className="w-4 h-4 text-stone-950" />
              <span>重返祁连 (继续存档)</span>
            </button>
          )}

          {/* Start New Game */}
          <button
            onClick={onStartNewGame}
            className={`flex items-center justify-center gap-2 py-3 px-5 rounded-xl transition-all shadow-lg ${
              hasSave
                ? 'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-sm'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-amber-950/50'
            }`}
          >
            <Play className="w-4 h-4" />
            <span>{hasSave ? '重新开始历练' : '踏入祁连 (开始冒险)'}</span>
          </button>

          {/* Lore / Encyclopedia */}
          <button
            onClick={onOpenLore}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-stone-800/80 hover:bg-stone-800 text-stone-300 hover:text-stone-100 border border-stone-700 text-xs sm:text-sm transition"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>祁连风物典册</span>
          </button>

          {/* GitHub Pages Deploy & Readme */}
          <button
            onClick={onOpenDeployGuide}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-stone-800/80 hover:bg-stone-800 text-emerald-400 hover:text-emerald-300 border border-stone-700 text-xs sm:text-sm transition"
          >
            <Github className="w-4 h-4" />
            <span>GitHub Pages 部署指南</span>
          </button>
        </div>

        {/* Quick Controls Cheat Sheet */}
        <div className="pt-3 border-t border-stone-800/80 w-full flex flex-col gap-1 text-[11px] text-stone-500">
          <div className="flex items-center justify-center gap-3">
            <span>移动：<b className="text-stone-400">WASD / 方向键</b></span>
            <span>交互：<b className="text-stone-400">E 键</b></span>
            <span>听山：<b className="text-stone-400">空格键</b></span>
          </div>
          <div>移动端支持屏幕虚拟摇杆与触控专属按键</div>
        </div>
      </div>
    </div>
  );
};
