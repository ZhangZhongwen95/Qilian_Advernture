import React from 'react';
import { Flame, Compass, Backpack, BookOpen, Volume2, VolumeX, ShieldAlert, Ear, Github, HelpCircle, Globe2, Sparkles, Award, Library } from 'lucide-react';
import { CountyData, CountyQuest, PlayerState, Quest, WeatherType, ZoneConfig } from '../types';

interface GameHUDProps {
  zone: ZoneConfig;
  player: PlayerState;
  currentCounty?: CountyData;
  activeQuest?: Quest;
  countyQuest?: CountyQuest;
  isMuted: boolean;
  visitedCounties?: string[];
  completedCountyQuests?: string[];
  onToggleMute: () => void;
  onOpenInventory: () => void;
  onOpenMap: () => void;
  onOpen3DMap: () => void;
  onOpenChronicle?: () => void;
  onOpenLore: () => void;
  onOpenDeployGuide: () => void;
  onListen: () => void;
  onOpenAdventure?: () => void;
  nearbyPrompt: string | null;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  zone,
  player,
  currentCounty,
  activeQuest,
  countyQuest,
  isMuted,
  visitedCounties = [],
  completedCountyQuests = [],
  onToggleMute,
  onOpenInventory,
  onOpenMap,
  onOpen3DMap,
  onOpenChronicle,
  onOpenLore,
  onOpenDeployGuide,
  onListen,
  onOpenAdventure,
  nearbyPrompt,
}) => {
  // Temperature color styling
  const temp = player.bodyTemp;
  const tempColor =
    temp > 35.5 ? 'text-emerald-400' : temp > 33.5 ? 'text-amber-400' : 'text-rose-500 animate-pulse';

  const weatherLabel: Record<WeatherType, { text: string; bg: string }> = {
    clear: { text: '晴空明朗', bg: 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300' },
    mist: { text: '丹霞雾霭', bg: 'bg-amber-950/70 border-amber-500/40 text-amber-300' },
    light_snow: { text: '极境轻雪', bg: 'bg-sky-950/70 border-sky-500/40 text-sky-300' },
    blizzard: { text: '狂暴风雪', bg: 'bg-cyan-950/80 border-cyan-400/60 text-cyan-200 animate-pulse' },
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 sm:p-5 select-none">
      {/* Top Bar: Survival Status & Location */}
      <div className="flex flex-wrap items-start justify-between gap-2.5">
        {/* Left: Location & Weather & Vitals */}
        <div className="flex flex-col gap-2 pointer-events-auto">
          {/* Location Badge */}
          <div className="flex items-center gap-2 bg-stone-900/85 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-stone-700/60 shadow-lg text-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-semibold text-stone-100">
              {currentCounty ? `${currentCounty.province} · ${currentCounty.name}` : zone.name}
            </span>
            {currentCounty && visitedCounties.includes(currentCounty.id) && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-0.5">
                <Award className="w-3 h-3" /> 已通关
              </span>
            )}
            {currentCounty?.isAutonomous && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {currentCounty.ethnicGroup}自治县
              </span>
            )}
            <span className="text-stone-400 text-xs">海拔 {currentCounty?.altitude || zone.altitude}m</span>
            <span
              className={`text-xs px-2 py-0.5 rounded border font-medium ${weatherLabel[zone.weather].bg}`}
            >
              {weatherLabel[zone.weather].text}
            </span>
          </div>

          {/* Vitals Panel: Body Temp & Stamina */}
          <div className="bg-stone-900/90 backdrop-blur-md p-3 rounded-xl border border-stone-800 shadow-xl flex flex-col gap-2 min-w-[240px]">
            {/* Body Temperature */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-stone-300">
                <Flame className={`w-4 h-4 ${tempColor}`} />
                <span>核心体温</span>
              </div>
              <span className={`font-mono font-bold text-sm ${tempColor}`}>
                {player.bodyTemp.toFixed(1)}°C
              </span>
            </div>
            {/* Temperature Progress Bar */}
            <div className="w-full bg-stone-800 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  temp > 35.5
                    ? 'bg-gradient-to-r from-amber-500 to-emerald-500'
                    : temp > 33.5
                    ? 'bg-gradient-to-r from-rose-500 to-amber-500'
                    : 'bg-rose-600'
                }`}
                style={{
                  width: `${Math.max(0, Math.min(100, ((temp - 30.0) / 7.0) * 100))}%`,
                }}
              />
            </div>

            {/* Cold Resistance Buff Timer */}
            {player.coldResistanceTimer > 0 && (
              <div className="flex items-center gap-1 text-[11px] text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                <ShieldAlert className="w-3 h-3 text-amber-400" />
                <span>御寒暖气庇护：剩余 {Math.ceil(player.coldResistanceTimer)} 秒</span>
              </div>
            )}

            {/* Stamina */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-800">
              <span className="text-stone-400">体力精气</span>
              <span className="font-mono text-stone-300">
                {Math.round(player.stamina)} / {player.maxStamina}
              </span>
            </div>
            <div className="w-full bg-stone-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-sky-500 transition-all duration-200"
                style={{ width: `${(player.stamina / player.maxStamina) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: Quick Action Controls & Quest Tracker */}
        <div className="flex flex-col items-end gap-2.5 pointer-events-auto">
          {/* Action Button Strip */}
          <div className="flex items-center gap-1.5 bg-stone-900/85 backdrop-blur-md p-1.5 rounded-xl border border-stone-800 shadow-xl">
            <button
              id="hud-listen-btn"
              onClick={onListen}
              title="听山秘术 (快捷键: 空格)"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                player.isListening
                  ? 'bg-sky-500 text-stone-950 shadow-md shadow-sky-500/50'
                  : 'bg-stone-800/80 hover:bg-stone-700 text-sky-300 border border-sky-500/30'
              }`}
            >
              <Ear className="w-3.5 h-3.5" />
              <span>听山</span>
            </button>

            {onOpenChronicle && (
              <button
                id="hud-chronicle-btn"
                onClick={onOpenChronicle}
                title="打开【甘青百县风物大典】(全132县风物、名宿、任务与信物)"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 transition-colors shadow-sm"
              >
                <Library className="w-3.5 h-3.5 text-stone-950" />
                <span>百县大典</span>
                <span className="text-[10px] bg-stone-950/30 px-1 rounded font-mono">
                  {visitedCounties.length}/132
                </span>
              </button>
            )}

            <button
              id="hud-3dmap-btn"
              onClick={onOpen3DMap}
              title="甘青 3D 水墨舆图"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-800/80 hover:bg-stone-700 text-stone-200 transition-colors border border-stone-700/60"
            >
              <Globe2 className="w-3.5 h-3.5 text-amber-400" />
              <span>3D 舆图</span>
            </button>

            {onOpenAdventure && (
              <button
                id="hud-adventure-btn"
                onClick={onOpenAdventure}
                title="触发当前县城专属山海奇遇 (文字冒险)"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-100 transition-colors shadow-sm border border-amber-500/40"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>山海奇遇</span>
              </button>
            )}

            <button
              id="hud-bag-btn"
              onClick={onOpenInventory}
              title="行囊道具 (快捷键: I)"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-800/80 hover:bg-stone-700 text-stone-200 transition-colors"
            >
              <Backpack className="w-3.5 h-3.5" />
              <span>行囊</span>
            </button>

            <button
              id="hud-map-btn"
              onClick={onOpenMap}
              title="祁连舆图 (快捷键: M)"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-800/80 hover:bg-stone-700 text-stone-200 transition-colors"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>舆图</span>
            </button>

            <button
              id="hud-lore-btn"
              onClick={onOpenLore}
              title="风物典故"
              className="p-1.5 rounded-lg text-stone-300 hover:text-stone-100 hover:bg-stone-800 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
            </button>

            <button
              id="hud-deploy-btn"
              onClick={onOpenDeployGuide}
              title="GitHub Pages 部署与项目指南"
              className="p-1.5 rounded-lg text-emerald-400 hover:text-emerald-300 hover:bg-stone-800 transition-colors"
            >
              <Github className="w-4 h-4" />
            </button>

            <button
              id="hud-mute-btn"
              onClick={onToggleMute}
              title={isMuted ? '开启音效与原声' : '静音'}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>

          {/* Active Quests (Main & County Specific) */}
          <div className="flex flex-col gap-2 max-w-xs text-right">
            {countyQuest && (
              <div className="bg-stone-900/90 backdrop-blur-md p-2.5 rounded-xl border border-amber-500/40 shadow-xl text-right">
                <div className="text-[10px] font-medium text-amber-300 flex items-center justify-end gap-1 mb-0.5">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>县域风物委托</span>
                  {currentCounty && completedCountyQuests.includes(currentCounty.id) && (
                    <span className="text-[9px] px-1 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                      ✓ 已达成
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-amber-100">{countyQuest.title}</h4>
                <p className="text-[11px] text-stone-300 mt-0.5 leading-relaxed line-clamp-2">
                  {countyQuest.objective}
                </p>
              </div>
            )}

            {activeQuest && (
              <div className="bg-stone-900/80 backdrop-blur-md p-2.5 rounded-xl border border-stone-800/80 shadow-xl text-right">
                <div className="text-[10px] font-medium text-sky-400 flex items-center justify-end gap-1 mb-0.5">
                  <HelpCircle className="w-3 h-3" />
                  <span>主线历练</span>
                </div>
                <h4 className="text-xs font-bold text-stone-100">{activeQuest.title}</h4>
                <p className="text-[11px] text-stone-400 mt-0.5 leading-relaxed">{activeQuest.objective}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Center: Interaction Prompt (e.g. "[E] 对话") */}
      {nearbyPrompt && (
        <div className="self-center pointer-events-auto bg-stone-950/90 text-stone-100 border border-amber-500/50 px-5 py-2.5 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-3 animate-bounce">
          <span className="bg-amber-500 text-stone-950 font-bold px-2 py-0.5 rounded text-xs">
            按 E 或轻触
          </span>
          <span className="text-sm font-medium">{nearbyPrompt}</span>
        </div>
      )}
    </div>
  );
};
