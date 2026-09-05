import React from 'react';
import { Compass, MapPin, X, ArrowRight, Shield } from 'lucide-react';
import { ZoneConfig, ZoneId } from '../types';
import { ZONES } from '../game/worldData';

interface MapModalProps {
  currentZone: ZoneId;
  unlockedZones: ZoneId[];
  onFastTravel: (zoneId: ZoneId) => void;
  onClose: () => void;
}

export const MapModal: React.FC<MapModalProps> = ({
  currentZone,
  unlockedZones,
  onFastTravel,
  onClose,
}) => {
  const zoneList: ZoneConfig[] = [
    ZONES.meadow,
    ZONES.danxia,
    ZONES.forest,
    ZONES.glacier,
  ];

  return (
    <div className="absolute inset-0 bg-stone-950/75 backdrop-blur-md flex items-center justify-center p-4 z-40">
      <div className="bg-stone-900 border border-stone-700 w-full max-w-2xl rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col gap-5 text-stone-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-950 border border-sky-500/40 flex items-center justify-center text-sky-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-stone-100">祁连天脉行舆图</h3>
              <p className="text-xs text-stone-400">从河西走廊咽喉扁都口，逶迤攀升至极高海拔八一冰川</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Altitude Profile & Journey Map */}
        <div className="flex flex-col gap-3">
          <div className="text-xs text-stone-400 font-medium">
            丝路古隘与雪山地带（点击已解锁区域可快速穿行）：
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {zoneList.map((z, idx) => {
              const isUnlocked = unlockedZones.includes(z.id);
              const isCurrent = currentZone === z.id;

              return (
                <div
                  key={z.id}
                  className={`p-4 rounded-xl border relative transition-all flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-amber-950/40 border-amber-500 shadow-md ring-1 ring-amber-500/50'
                      : isUnlocked
                      ? 'bg-stone-800/80 border-stone-700 hover:border-stone-500 hover:bg-stone-800 cursor-pointer'
                      : 'bg-stone-950/40 border-stone-850 opacity-45 cursor-not-allowed'
                  }`}
                  onClick={() => {
                    if (isUnlocked && !isCurrent) {
                      onFastTravel(z.id);
                    }
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono text-stone-400">
                          0{idx + 1}.
                        </span>
                        <h4 className="font-bold text-sm text-stone-100">{z.name}</h4>
                      </div>
                      <p className="text-xs text-stone-400 mt-0.5">{z.title}</p>
                    </div>

                    {isCurrent ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-stone-950">
                        <MapPin className="w-3 h-3" />
                        当前位置
                      </span>
                    ) : isUnlocked ? (
                      <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                        已通达 <ArrowRight className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="text-xs text-stone-500 flex items-center gap-1">
                        <Shield className="w-3 h-3" /> 未涉足
                      </span>
                    )}
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
                    <span>海拔: <b className="text-stone-200">{z.altitude}m</b></span>
                    <span>风貌: <b className="text-stone-300">{z.features[0]}</b></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Travel Note */}
        <div className="text-xs text-stone-400 bg-stone-950/60 p-3 rounded-xl border border-stone-800 leading-relaxed">
          💡 提示：高海拔雪区风雪猛烈、体温流失极快。穿行至【八一冰川】前，请务必在【祁连冷杉林】采集雪莲或准备充足的酥油茶。
        </div>
      </div>
    </div>
  );
};
