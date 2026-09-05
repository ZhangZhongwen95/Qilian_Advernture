import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  MapPin,
  Mountain,
  Sparkles,
  BookOpen,
  Award,
  Navigation,
  Compass,
  CheckCircle2,
  Filter,
  Flame,
  Globe2,
  ChevronRight,
  ShieldCheck,
  Package,
} from 'lucide-react';
import { COUNTIES_DATA, getAllPrefectures } from '../game/countyData';
import { getCountyContent, getCountyQuest } from '../game/countyContentDatabase';
import { CountyData } from '../types';

interface CountyChronicleModalProps {
  currentCountyId: string;
  visitedCounties: string[];
  completedCountyQuests: string[];
  onTravelToCounty: (county: CountyData) => void;
  onClose: () => void;
}

export const CountyChronicleModal: React.FC<CountyChronicleModalProps> = ({
  currentCountyId,
  visitedCounties,
  completedCountyQuests,
  onTravelToCounty,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'gansu' | 'qinghai' | 'autonomous' | 'visited'>('all');
  const [selectedPrefecture, setSelectedPrefecture] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountyId, setSelectedCountyId] = useState<string>(currentCountyId);

  const prefectures = useMemo(() => getAllPrefectures(), []);

  // Filtered counties list
  const filteredCounties = useMemo(() => {
    return COUNTIES_DATA.filter((c) => {
      if (activeTab === 'gansu' && c.province !== '甘肃') return false;
      if (activeTab === 'qinghai' && c.province !== '青海') return false;
      if (activeTab === 'autonomous' && !c.isAutonomous) return false;
      if (activeTab === 'visited' && !visitedCounties.includes(c.id)) return false;

      if (selectedPrefecture !== 'all' && c.prefecture !== selectedPrefecture) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.prefecture.toLowerCase().includes(q) ||
          c.ethnicGroup.toLowerCase().includes(q) ||
          c.naturalLandmark.name.toLowerCase().includes(q) ||
          c.culturalLandmark.name.toLowerCase().includes(q) ||
          c.ethnicFeatures.specialty.toLowerCase().includes(q) ||
          c.terrainType.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [activeTab, selectedPrefecture, searchQuery, visitedCounties]);

  const selectedCounty = useMemo(() => {
    return COUNTIES_DATA.find((c) => c.id === selectedCountyId) || COUNTIES_DATA[0];
  }, [selectedCountyId]);

  const countyProfile = useMemo(() => {
    return getCountyContent(selectedCounty);
  }, [selectedCounty]);

  const countyQuest = useMemo(() => {
    return getCountyQuest(selectedCounty);
  }, [selectedCounty]);

  const isCurrentVisited = visitedCounties.includes(selectedCounty.id);
  const isQuestDone = completedCountyQuests.includes(selectedCounty.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-6xl h-[92vh] max-h-[900px] bg-stone-900 border border-stone-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-stone-100">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-stone-800 bg-stone-950/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-stone-950 font-bold shadow-md">
              <Compass className="w-5 h-5 text-stone-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold font-serif text-stone-100">
                  甘青百县风物大典
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                  全境 132 县区
                </span>
              </div>
              <p className="text-xs text-stone-400 hidden sm:block">
                甘肃87县区 + 青海45县区 · 每一县皆有独家地质名胜、名宿人物、风物委托与传世信物
              </p>
            </div>
          </div>

          {/* Stats Badges */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-1.5 text-xs bg-stone-800/80 px-3 py-1.5 rounded-lg border border-stone-700">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-stone-400">已亲历:</span>
              <span className="font-bold text-sky-300 font-mono">
                {visitedCounties.length} / 132
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs bg-stone-800/80 px-3 py-1.5 rounded-lg border border-stone-700 hidden sm:flex">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-stone-400">考察圆满:</span>
              <span className="font-bold text-amber-300 font-mono">
                {completedCountyQuests.length} / 132
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition"
              title="关闭"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter and Search Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-2.5 border-b border-stone-800 bg-stone-900/90 text-xs">
          {/* Main Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { key: 'all', label: `全部 (132)` },
              { key: 'gansu', label: '甘肃省 (87)' },
              { key: 'qinghai', label: '青海省 (45)' },
              { key: 'autonomous', label: '少数民族自治县 (21)' },
              { key: 'visited', label: `已亲历 (${visitedCounties.length})` },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key as any);
                  setSelectedPrefecture('all');
                }}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition font-medium ${
                  activeTab === tab.key
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                    : 'bg-stone-800/80 hover:bg-stone-700 text-stone-300 border border-stone-700/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Prefecture Selector & Search Box */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedPrefecture}
              onChange={(e) => setSelectedPrefecture(e.target.value)}
              className="bg-stone-800 border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-stone-200 outline-none cursor-pointer focus:border-amber-500"
            >
              <option value="all">全域州府 (全部)</option>
              {prefectures.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            <div className="relative flex-1 sm:w-48">
              <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-stone-400" />
              <input
                type="text"
                placeholder="搜索县名/特产/地标..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-stone-800/90 border border-stone-700 rounded-lg text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Content Area: Two Columns (Left List & Right Detailed Dossier) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Column: County Cards Grid / List */}
          <div className="w-full md:w-1/2 lg:w-7/12 h-full overflow-y-auto p-3 sm:p-4 border-r border-stone-800/80 flex flex-col gap-2">
            <div className="text-[11px] text-stone-400 px-1 flex items-center justify-between">
              <span>共筛选出 {filteredCounties.length} 个县区</span>
              <span>点击卡片查看深层风物与启程漫游</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredCounties.map((c) => {
                const isSelected = c.id === selectedCountyId;
                const visited = visitedCounties.includes(c.id);
                const questDone = completedCountyQuests.includes(c.id);
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCountyId(c.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2 text-left ${
                      isSelected
                        ? 'bg-amber-950/40 border-amber-500 shadow-md shadow-amber-950/30 ring-1 ring-amber-500/40'
                        : 'bg-stone-950/60 hover:bg-stone-800/60 border-stone-800/80 text-stone-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                              c.province === '甘肃'
                                ? 'bg-sky-950 text-sky-400 border border-sky-800'
                                : 'bg-teal-950 text-teal-400 border border-teal-800'
                            }`}
                          >
                            {c.prefecture}
                          </span>
                          {c.isAutonomous && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold">
                              {c.ethnicGroup}
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-stone-100 mt-1 font-serif">
                          {c.name}
                        </h4>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] text-amber-400 font-mono font-bold">
                          {c.altitude}m
                        </span>
                        {visited ? (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-0.5">
                            <CheckCircle2 className="w-2.5 h-2.5" /> 已至
                          </span>
                        ) : (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-stone-800 text-stone-500">
                            未勘探
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-[11px] text-stone-400 line-clamp-1">
                      <b className="text-stone-300">奇观: </b>
                      <span>{c.naturalLandmark.name}</span>
                    </div>

                    <div className="text-[11px] text-stone-400 line-clamp-1">
                      <b className="text-stone-300">特产: </b>
                      <span className="text-amber-300/90">{c.ethnicFeatures.specialty}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed County Dossier */}
          <div className="w-full md:w-1/2 lg:w-5/12 h-full overflow-y-auto p-4 sm:p-5 bg-stone-900/95 flex flex-col gap-3.5">
            {/* Header with Badges & Name */}
            <div className="border-b border-stone-800 pb-3 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-bold ${
                      selectedCounty.province === '甘肃'
                        ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                        : 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                    }`}
                  >
                    {selectedCounty.province} · {selectedCounty.prefecture}
                  </span>
                  {selectedCounty.isAutonomous && (
                    <span className="text-xs px-2 py-0.5 rounded font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {selectedCounty.ethnicGroup}自治县
                    </span>
                  )}
                  {isCurrentVisited && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> 已亲历踏足
                    </span>
                  )}
                  {isQuestDone && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      <Award className="w-3 h-3" /> 考察圆满
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-black font-serif text-stone-100 mt-1.5">
                  {selectedCounty.name}
                </h3>
              </div>

              <div className="text-right">
                <span className="text-xs text-stone-400 font-mono">海拔高程</span>
                <div className="text-lg font-bold text-amber-400 font-mono">
                  {selectedCounty.altitude} m
                </div>
              </div>
            </div>

            {/* Resident Persona / NPC Card */}
            <div className="p-3 bg-stone-950/80 rounded-xl border border-stone-800 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl shrink-0">
                {countyProfile.npcIcon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-stone-100">{countyProfile.npcName}</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-stone-800 text-amber-400 rounded">
                    驻县名宿
                  </span>
                </div>
                <p className="text-xs text-stone-400 truncate mt-0.5">{countyProfile.npcTitle}</p>
                <p className="text-[11px] text-stone-300/90 italic mt-1 line-clamp-2">
                  “{countyProfile.npcGreeting}”
                </p>
              </div>
            </div>

            {/* Topography & Microclimate */}
            <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800 text-xs flex flex-col gap-1">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <Mountain className="w-3.5 h-3.5 text-amber-400" />
                <span>微地貌：{selectedCounty.terrainType}</span>
              </div>
              <p className="text-stone-400 leading-relaxed">{selectedCounty.terrainDescription}</p>
            </div>

            {/* Natural Wonder & Cultural Legacy */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {/* Natural Landmark */}
              <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800 flex flex-col gap-1">
                <div className="font-bold text-sky-300 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-sky-400" />
                    <span>自然奇观</span>
                  </span>
                  <span className="text-[10px] px-1 bg-sky-950 text-sky-300 rounded border border-sky-800">
                    {selectedCounty.naturalLandmark.tag}
                  </span>
                </div>
                <div className="font-semibold text-stone-200 mt-0.5">
                  {selectedCounty.naturalLandmark.name}
                </div>
                <p className="text-stone-400 text-[11px] leading-relaxed">
                  {selectedCounty.naturalLandmark.description}
                </p>
              </div>

              {/* Cultural Landmark */}
              <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800 flex flex-col gap-1">
                <div className="font-bold text-amber-300 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-amber-400" />
                    <span>人文名胜</span>
                  </span>
                  <span className="text-[10px] px-1 bg-amber-950 text-amber-300 rounded border border-amber-800">
                    {selectedCounty.culturalLandmark.tag}
                  </span>
                </div>
                <div className="font-semibold text-stone-200 mt-0.5">
                  {selectedCounty.culturalLandmark.name}
                </div>
                <p className="text-stone-400 text-[11px] leading-relaxed">
                  {selectedCounty.culturalLandmark.description}
                </p>
              </div>
            </div>

            {/* Ethnic Custom & Specialties */}
            <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800 text-xs flex flex-col gap-1.5">
              <div className="font-bold text-rose-300">
                【{selectedCounty.ethnicGroup}】风土非遗与物产：
              </div>
              <div className="space-y-1 text-stone-300 text-[11px]">
                <div>
                  <b className="text-stone-400">非遗绝艺：</b>
                  <span>{selectedCounty.ethnicFeatures.crafts}</span>
                </div>
                <div>
                  <b className="text-stone-400">传统盛装：</b>
                  <span>{selectedCounty.ethnicFeatures.costumes}</span>
                </div>
                <div>
                  <b className="text-stone-400">传世风味：</b>
                  <span className="text-amber-300 font-medium">{selectedCounty.ethnicFeatures.specialty}</span>
                </div>
              </div>
            </div>

            {/* County Exclusive Quest & Relic */}
            <div className="p-3 bg-amber-950/20 rounded-xl border border-amber-500/30 text-xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>{countyQuest.title}</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                  县域专属委托
                </span>
              </div>
              <p className="text-stone-300 text-[11px] leading-relaxed">{countyQuest.objective}</p>

              {/* Relic Preview */}
              <div className="pt-2 border-t border-amber-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{countyProfile.relicIcon}</span>
                  <div>
                    <div className="text-[11px] font-bold text-amber-200">
                      奖励信物：{countyProfile.relicName}
                    </div>
                    <div className="text-[10px] text-stone-400 line-clamp-1">
                      {countyProfile.relicDescription}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono font-bold shrink-0">
                  +{countyProfile.relicEffect.temp}°C / +{countyProfile.relicEffect.stamina}精力
                </span>
              </div>
            </div>

            {/* Secret County Lore */}
            <div className="p-3 bg-stone-950/70 rounded-xl border border-stone-800/80 text-xs flex flex-col gap-1">
              <div className="font-bold text-stone-300 flex items-center gap-1">
                <span>📜 县志绝密轶事</span>
              </div>
              <p className="text-stone-400 text-[11px] leading-relaxed italic">
                {countyProfile.secretLore}
              </p>
            </div>

            {/* Action Buttons: Teleport / Travel */}
            <div className="mt-auto pt-2">
              <button
                onClick={() => {
                  onTravelToCounty(selectedCounty);
                  onClose();
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2 transition active:scale-98"
              >
                <Navigation className="w-4 h-4" />
                <span>神行遁迹 · 踏入【{selectedCounty.name}】实地漫游</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
