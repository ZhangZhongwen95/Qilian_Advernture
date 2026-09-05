import React, { useState } from 'react';
import { Backpack, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { Item } from '../types';

interface InventoryModalProps {
  inventory: Item[];
  onUseItem: (itemId: string) => void;
  onClose: () => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  inventory,
  onUseItem,
  onClose,
}) => {
  const [selectedId, setSelectedId] = useState<string>(inventory[0]?.id || '');
  const [filter, setFilter] = useState<'all' | 'food' | 'tool' | 'relic'>('all');

  const filteredItems = inventory.filter((item) => {
    if (filter === 'all') return true;
    return item.category === filter;
  });

  const selectedItem = inventory.find((i) => i.id === selectedId) || filteredItems[0];

  return (
    <div className="absolute inset-0 bg-stone-950/70 backdrop-blur-md flex items-center justify-center p-4 z-40">
      <div className="bg-stone-900 border border-stone-700 w-full max-w-2xl rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4 text-stone-100 max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-600/30 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Backpack className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-stone-100">行囊包袱</h3>
              <p className="text-xs text-stone-400">旅人行囊中的高原生存补给、探路器具与西域古物</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Categories */}
        <div className="flex gap-2 text-xs">
          {[
            { id: 'all', label: '全部' },
            { id: 'food', label: '干粮茶食' },
            { id: 'tool', label: '器具工具' },
            { id: 'relic', label: '古物秘宝' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id as typeof filter)}
              className={`px-3 py-1.5 rounded-lg border transition ${
                filter === cat.id
                  ? 'bg-amber-500 text-stone-950 border-amber-400 font-bold'
                  : 'bg-stone-800/80 text-stone-400 border-stone-700 hover:text-stone-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Main Grid: Left Items List, Right Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-h-[280px]">
          {/* Items List */}
          <div className="flex flex-col gap-2 overflow-y-auto max-h-[320px] pr-1">
            {filteredItems.length === 0 ? (
              <div className="text-stone-500 text-sm text-center py-10">
                暂无此类物品
              </div>
            ) : (
              filteredItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left transition ${
                    selectedItem?.id === item.id
                      ? 'bg-amber-950/40 border-amber-500 text-amber-200 shadow-md'
                      : 'bg-stone-800/60 border-stone-800 text-stone-300 hover:bg-stone-800 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <div className="text-sm font-semibold">{item.name}</div>
                      <div className="text-xs text-stone-400">
                        类别: {item.category === 'food' ? '食物补给' : item.category === 'tool' ? '探险工具' : '历史古器'}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-stone-700/80 font-mono text-stone-200">
                    x{item.count}
                  </span>
                </button>
              ))
            )}
          </div>

          {/* Selected Item Detail */}
          {selectedItem && (
            <div className="bg-stone-950/70 p-4 rounded-xl border border-stone-800 flex flex-col justify-between">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 border-b border-stone-800 pb-3">
                  <span className="text-4xl">{selectedItem.icon}</span>
                  <div>
                    <h4 className="font-bold text-base text-amber-300">
                      {selectedItem.name}
                    </h4>
                    <span className="text-xs text-stone-400">
                      持有数量: {selectedItem.count}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-serif">
                  {selectedItem.description}
                </p>

                {/* Effect Highlights */}
                {selectedItem.effect && (
                  <div className="bg-stone-900 p-3 rounded-lg border border-stone-800 flex flex-col gap-1.5 text-xs">
                    <div className="text-stone-400 font-medium">使用效果:</div>
                    {selectedItem.effect.temp && (
                      <div className="text-emerald-400 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>核心体温回升 +{selectedItem.effect.temp}°C</span>
                      </div>
                    )}
                    {selectedItem.effect.stamina && (
                      <div className="text-sky-400 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>恢复体力精气 +{selectedItem.effect.stamina} 点</span>
                      </div>
                    )}
                    {selectedItem.effect.resistColdSec && (
                      <div className="text-amber-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>赋予抗寒暖流壁障持续 {selectedItem.effect.resistColdSec} 秒</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-stone-800">
                {selectedItem.category === 'food' ? (
                  <button
                    onClick={() => onUseItem(selectedItem.id)}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm transition shadow-lg shadow-amber-900/40"
                  >
                    食用 / 饮用
                  </button>
                ) : (
                  <div className="text-center text-xs text-stone-500 py-1">
                    此物品放置于行囊即可常驻生效或特定场景自动触发
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
