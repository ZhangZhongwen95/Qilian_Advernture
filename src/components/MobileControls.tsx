import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Hand, Ear, Backpack, Flame } from 'lucide-react';

interface MobileControlsProps {
  onMoveStart: (dir: 'up' | 'down' | 'left' | 'right') => void;
  onMoveEnd: () => void;
  onInteract: () => void;
  onListen: () => void;
  onOpenInventory: () => void;
  onOpenCampfire: () => void;
  canCampfire: boolean;
  nearbyPrompt: string | null;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  onMoveStart,
  onMoveEnd,
  onInteract,
  onListen,
  onOpenInventory,
  onOpenCampfire,
  canCampfire,
  nearbyPrompt,
}) => {
  return (
    <div className="absolute inset-x-0 bottom-3 px-4 flex items-end justify-between pointer-events-none sm:hidden z-30 select-none">
      {/* Left: 4-Way Virtual Directional Pad */}
      <div className="relative w-36 h-36 pointer-events-auto bg-stone-900/60 backdrop-blur-md rounded-full border border-stone-700/50 p-2 shadow-2xl flex items-center justify-center">
        {/* Up */}
        <button
          onTouchStart={(e) => { e.preventDefault(); onMoveStart('up'); }}
          onTouchEnd={(e) => { e.preventDefault(); onMoveEnd(); }}
          onMouseDown={() => onMoveStart('up')}
          onMouseUp={onMoveEnd}
          className="absolute top-1.5 w-11 h-11 bg-stone-800/80 active:bg-amber-500 rounded-xl flex items-center justify-center text-stone-200 active:text-stone-950 transition border border-stone-700"
        >
          <ArrowUp className="w-5 h-5" />
        </button>

        {/* Down */}
        <button
          onTouchStart={(e) => { e.preventDefault(); onMoveStart('down'); }}
          onTouchEnd={(e) => { e.preventDefault(); onMoveEnd(); }}
          onMouseDown={() => onMoveStart('down')}
          onMouseUp={onMoveEnd}
          className="absolute bottom-1.5 w-11 h-11 bg-stone-800/80 active:bg-amber-500 rounded-xl flex items-center justify-center text-stone-200 active:text-stone-950 transition border border-stone-700"
        >
          <ArrowDown className="w-5 h-5" />
        </button>

        {/* Left */}
        <button
          onTouchStart={(e) => { e.preventDefault(); onMoveStart('left'); }}
          onTouchEnd={(e) => { e.preventDefault(); onMoveEnd(); }}
          onMouseDown={() => onMoveStart('left')}
          onMouseUp={onMoveEnd}
          className="absolute left-1.5 w-11 h-11 bg-stone-800/80 active:bg-amber-500 rounded-xl flex items-center justify-center text-stone-200 active:text-stone-950 transition border border-stone-700"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Right */}
        <button
          onTouchStart={(e) => { e.preventDefault(); onMoveStart('right'); }}
          onTouchEnd={(e) => { e.preventDefault(); onMoveEnd(); }}
          onMouseDown={() => onMoveStart('right')}
          onMouseUp={onMoveEnd}
          className="absolute right-1.5 w-11 h-11 bg-stone-800/80 active:bg-amber-500 rounded-xl flex items-center justify-center text-stone-200 active:text-stone-950 transition border border-stone-700"
        >
          <ArrowRight className="w-5 h-5" />
        </button>

        {/* Center Guide Dot */}
        <div className="w-4 h-4 rounded-full bg-stone-700/60" />
      </div>

      {/* Right: Action Buttons */}
      <div className="flex flex-col gap-2.5 items-end pointer-events-auto">
        <div className="flex gap-2">
          {canCampfire && (
            <button
              onClick={onOpenCampfire}
              className="w-12 h-12 rounded-full bg-amber-600/90 active:bg-amber-500 text-stone-950 flex flex-col items-center justify-center shadow-lg border border-amber-400/80 transition animate-pulse"
              title="营火取暖"
            >
              <Flame className="w-5 h-5" />
              <span className="text-[9px] font-bold">营火</span>
            </button>
          )}

          <button
            onClick={onOpenInventory}
            className="w-12 h-12 rounded-full bg-stone-800/90 active:bg-stone-700 text-stone-200 flex flex-col items-center justify-center shadow-lg border border-stone-700 transition"
            title="背包"
          >
            <Backpack className="w-5 h-5" />
            <span className="text-[9px] font-bold">行囊</span>
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onListen}
            className="w-14 h-14 rounded-full bg-sky-600/90 active:bg-sky-400 text-stone-100 flex flex-col items-center justify-center shadow-xl border border-sky-400 transition"
            title="听山"
          >
            <Ear className="w-6 h-6" />
            <span className="text-[10px] font-bold">听山</span>
          </button>

          <button
            onClick={onInteract}
            className={`w-14 h-14 rounded-full flex flex-col items-center justify-center shadow-xl transition ${
              nearbyPrompt
                ? 'bg-amber-500 active:bg-amber-400 text-stone-950 scale-105 border-2 border-amber-300 animate-pulse'
                : 'bg-stone-800/80 text-stone-400 border border-stone-700'
            }`}
            title="交互"
          >
            <Hand className="w-6 h-6" />
            <span className="text-[10px] font-bold">交互</span>
          </button>
        </div>
      </div>
    </div>
  );
};
