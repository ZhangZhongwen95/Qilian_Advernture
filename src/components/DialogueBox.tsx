import React from 'react';
import { MessageSquare, Sparkles } from 'lucide-react';
import { DialogueNode } from '../types';

interface DialogueBoxProps {
  dialogue: DialogueNode;
  onSelectOption: (optionIndex: number) => void;
  onClose: () => void;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({
  dialogue,
  onSelectOption,
  onClose,
}) => {
  return (
    <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 z-40 animate-fade-in">
      <div className="bg-stone-900 border border-stone-700 w-full max-w-2xl rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4 text-stone-100">
        {/* Header: Speaker Name & Title */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-xl shadow-md">
              <MessageSquare className="w-5 h-5 text-stone-900" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-amber-300">{dialogue.speaker}</h3>
              {dialogue.title && (
                <p className="text-xs text-stone-400">{dialogue.title}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-200 text-xs px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 transition"
          >
            结束对话 (ESC)
          </button>
        </div>

        {/* Narrative dialogue text */}
        <div className="bg-stone-950/60 rounded-xl p-4 border border-stone-800/80 text-sm sm:text-base leading-relaxed text-stone-200 font-serif min-h-[90px]">
          {dialogue.text}
        </div>

        {/* Branching Dialog Options */}
        <div className="flex flex-col gap-2 pt-1">
          {dialogue.options && dialogue.options.length > 0 ? (
            dialogue.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => onSelectOption(idx)}
                className="group flex items-center justify-between text-left px-4 py-3 rounded-xl bg-stone-800/80 hover:bg-amber-950/50 border border-stone-700 hover:border-amber-500/60 transition-all text-xs sm:text-sm text-stone-200 hover:text-amber-300"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-stone-700 group-hover:bg-amber-500 group-hover:text-stone-950 text-stone-300 flex items-center justify-center text-xs font-mono font-bold transition">
                    {idx + 1}
                  </span>
                  <span>{opt.text}</span>
                </div>
                <Sparkles className="w-3.5 h-3.5 text-stone-500 group-hover:text-amber-400 transition" />
              </button>
            ))
          ) : (
            <button
              onClick={onClose}
              className="w-full py-2.5 text-center bg-stone-800 hover:bg-stone-700 rounded-xl text-sm text-stone-300"
            >
              继续前行
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
