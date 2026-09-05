import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  X,
  Compass,
  RotateCw,
  Search,
  MapPin,
  Mountain,
  Sparkles,
  Navigation,
  Globe2,
  BookOpen,
} from 'lucide-react';
import { InkWashMap3DRenderer, MapCamera3D } from '../game/map3DRenderer';
import { COUNTIES_DATA, getAllPrefectures } from '../game/countyData';
import { getCountyContent, getCountyQuest } from '../game/countyContentDatabase';
import { CountyData } from '../types';

interface InkWashMap3DProps {
  currentCountyId: string;
  visitedCounties?: string[];
  completedCountyQuests?: string[];
  onTravelToCounty: (county: CountyData) => void;
  onOpenChronicle?: () => void;
  onClose: () => void;
}

export const InkWashMap3D: React.FC<InkWashMap3DProps> = ({
  currentCountyId,
  visitedCounties = [],
  completedCountyQuests = [],
  onTravelToCounty,
  onOpenChronicle,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<InkWashMap3DRenderer | null>(null);
  const clickTargetsRef = useRef<{ id: string; x: number; y: number; radius: number }[]>([]);

  // Camera state
  const [camera, setCamera] = useState<MapCamera3D>({
    pitch: 0.65, // ~37 degrees tilt
    yaw: -0.25, // gentle angle
    zoom: 1.05,
    offsetX: 0,
    offsetY: -15,
  });

  // Filter & Search state
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'gansu' | 'qinghai' | 'ethnic'>('all');
  const [selectedPrefecture, setSelectedPrefecture] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountyId, setSelectedCountyId] = useState<string>(currentCountyId);
  const [hoveredCountyId, setHoveredCountyId] = useState<string | null>(null);

  const allPrefectures = useRef<string[]>(getAllPrefectures()).current;

  // Mouse / Touch Drag state
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Filtered counties
  const filteredCounties = COUNTIES_DATA.filter((c) => {
    // Province filter
    if (selectedFilter === 'gansu' && c.province !== '甘肃') return false;
    if (selectedFilter === 'qinghai' && c.province !== '青海') return false;
    if (selectedFilter === 'ethnic' && !c.isAutonomous) return false;

    // Prefecture filter
    if (selectedPrefecture !== 'all' && c.prefecture !== selectedPrefecture) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.prefecture.toLowerCase().includes(q) ||
        c.ethnicGroup.toLowerCase().includes(q) ||
        c.naturalLandmark.name.toLowerCase().includes(q) ||
        c.culturalLandmark.name.toLowerCase().includes(q) ||
        c.terrainType.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const selectedCounty = COUNTIES_DATA.find((c) => c.id === selectedCountyId) || COUNTIES_DATA[0];

  // Initialize Canvas & Renderer
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    const canvas = canvasRef.current;
    rendererRef.current = new InkWashMap3DRenderer(canvas);

    const handleResize = () => {
      if (!containerRef.current || !canvasRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      canvasRef.current.width = rect.width;
      canvasRef.current.height = rect.height;
    };

    handleResize();
    const ro = new ResizeObserver(handleResize);
    ro.observe(containerRef.current);

    return () => ro.disconnect();
  }, []);

  // Animation render loop
  useEffect(() => {
    let animId: number;
    let lastT = performance.now();

    const loop = (t: number) => {
      const dt = (t - lastT) / 1000;
      lastT = t;

      if (rendererRef.current) {
        clickTargetsRef.current = rendererRef.current.render(
          filteredCounties,
          selectedCountyId,
          hoveredCountyId,
          camera,
          dt
        );
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [filteredCounties, selectedCountyId, hoveredCountyId, camera]);

  // Pointer Drag Interaction
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Check hover
      const hovered = clickTargetsRef.current.find(
        (target) => Math.hypot(target.x - mouseX, target.y - mouseY) <= target.radius
      );
      setHoveredCountyId(hovered ? hovered.id : null);
    }

    if (!isDraggingRef.current) return;

    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    setCamera((prev) => ({
      ...prev,
      yaw: prev.yaw + dx * 0.005,
      pitch: Math.max(0.25, Math.min(1.2, prev.pitch + dy * 0.004)),
    }));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    // Check click selection
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const clicked = clickTargetsRef.current.find(
        (target) => Math.hypot(target.x - mouseX, target.y - mouseY) <= target.radius
      );
      if (clicked) {
        setSelectedCountyId(clicked.id);
      }
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.92 : 1.08;
    setCamera((prev) => ({
      ...prev,
      zoom: Math.max(0.65, Math.min(2.4, prev.zoom * zoomFactor)),
    }));
  };

  const resetCamera = () => {
    setCamera({
      pitch: 0.65,
      yaw: -0.25,
      zoom: 1.05,
      offsetX: 0,
      offsetY: -15,
    });
  };

  return (
    <div className="absolute inset-0 z-50 bg-stone-950/90 backdrop-blur-md flex flex-col overflow-hidden select-none">
      {/* Top Header Bar */}
      <div className="h-16 border-b border-stone-800 bg-stone-900/90 px-4 sm:px-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold font-serif text-stone-100 tracking-wide">
                甘青全舆山海三维图
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                古风水墨 3D 导航
              </span>
            </div>
            <p className="text-xs text-stone-400 font-serif hidden sm:block">
              真实比例甘肃“如意丝路”与青海“三江源脉”地貌全景 · 拖拽自由旋转俯仰
            </p>
          </div>
        </div>

        {/* Filter Badges & Search */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Progress Counter Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/50 border border-amber-600/40 text-xs text-amber-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>已踏足: <strong className="text-amber-200">{visitedCounties.length}</strong> / 131 县</span>
          </div>

          {/* Prefecture Dropdown */}
          <div className="relative">
            <select
              value={selectedPrefecture}
              onChange={(e) => setSelectedPrefecture(e.target.value)}
              className="bg-stone-950 border border-stone-800 rounded-xl px-2.5 py-1.5 text-xs text-stone-300 focus:outline-none focus:border-amber-500/50 cursor-pointer"
            >
              <option value="all">全部地市州 (22)</option>
              {allPrefectures.map((pref) => (
                <option key={pref} value={pref}>
                  {pref}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Filters */}
          <div className="hidden md:flex bg-stone-950 p-1 rounded-xl border border-stone-800 text-xs">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1 rounded-lg transition ${
                selectedFilter === 'all'
                  ? 'bg-amber-600 text-stone-950 font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              全部 (131)
            </button>
            <button
              onClick={() => setSelectedFilter('gansu')}
              className={`px-3 py-1 rounded-lg transition ${
                selectedFilter === 'gansu'
                  ? 'bg-sky-600 text-stone-100 font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              甘肃 (86)
            </button>
            <button
              onClick={() => setSelectedFilter('qinghai')}
              className={`px-3 py-1 rounded-lg transition ${
                selectedFilter === 'qinghai'
                  ? 'bg-teal-600 text-stone-100 font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              青海 (45)
            </button>
            <button
              onClick={() => setSelectedFilter('ethnic')}
              className={`px-3 py-1 rounded-lg transition ${
                selectedFilter === 'ethnic'
                  ? 'bg-rose-600 text-stone-100 font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              九大民族自治县
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="搜县名/景观/民族..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-32 sm:w-44 pl-8 pr-2.5 py-1.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          {/* Open Chronicle Button */}
          {onOpenChronicle && (
            <button
              onClick={onOpenChronicle}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition shadow-sm"
              title="打开【甘青百县风物大典】查看全境132县"
            >
              <span>百县大典</span>
            </button>
          )}

          {/* Reset Camera Button */}
          <button
            onClick={resetCamera}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition"
            title="复位视角"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* Close Modal Button */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Area & Floating Inspector Card */}
      <div className="relative flex-1 w-full h-full">
        {/* 3D Canvas */}
        <div
          ref={containerRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onWheel={handleWheel}
        >
          <canvas ref={canvasRef} className="w-full h-full block" />
        </div>

        {/* 3D Navigation Guide Tip (Bottom Left) */}
        <div className="absolute bottom-4 left-4 pointer-events-none hidden sm:flex items-center gap-3 bg-stone-900/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-stone-800/80 text-[11px] text-stone-400 shadow-xl">
          <span className="flex items-center gap-1">
            <Globe2 className="w-3.5 h-3.5 text-amber-400" />
            <span>按住鼠标左键拖动可 360° 旋转水墨地形</span>
          </span>
          <span className="text-stone-600">|</span>
          <span>滚轮缩放</span>
          <span className="text-stone-600">|</span>
          <span>点击地标查看风物与神行漫游</span>
        </div>

        {/* Floating County Inspector Drawer (Bottom / Right) */}
        {selectedCounty && (
          <div className="absolute right-3 bottom-3 top-3 w-80 sm:w-96 bg-stone-900/90 backdrop-blur-xl border border-stone-700/80 rounded-2xl shadow-2xl p-4 sm:p-5 flex flex-col gap-3.5 overflow-y-auto text-stone-100 z-20">
            {/* Header Badge & Title */}
            <div className="flex items-start justify-between border-b border-stone-800 pb-3">
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      selectedCounty.province === '甘肃'
                        ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                        : 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                    }`}
                  >
                    {selectedCounty.province} · {selectedCounty.prefecture}
                  </span>
                  {selectedCounty.isAutonomous && (
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {selectedCounty.ethnicGroup}自治县
                    </span>
                  )}
                  {visitedCounties.includes(selectedCounty.id) ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <span>✓</span> 已亲历通关
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-stone-800 text-stone-400 border border-stone-700">
                      未勘探
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-extrabold font-serif text-stone-100 mt-1">
                  {selectedCounty.name}
                </h3>
              </div>

              <div className="text-right">
                <span className="text-xs text-stone-400 font-mono">海拔</span>
                <div className="text-sm font-bold text-amber-400 font-mono">
                  {selectedCounty.altitude} m
                </div>
              </div>
            </div>

            {/* Unique Topography & Terrain */}
            <div className="bg-stone-950/70 p-3 rounded-xl border border-stone-800/80 flex flex-col gap-1 text-xs">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <Mountain className="w-3.5 h-3.5 text-amber-400" />
                <span>独有地貌：{selectedCounty.terrainType}</span>
              </div>
              <p className="text-stone-400 leading-relaxed">
                {selectedCounty.terrainDescription}
              </p>
            </div>

            {/* Representative Natural Landmark */}
            <div className="bg-stone-950/70 p-3 rounded-xl border border-stone-800/80 flex flex-col gap-1 text-xs">
              <div className="flex items-center justify-between font-bold text-sky-300">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  <span>自然奇观：{selectedCounty.naturalLandmark.name}</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800">
                  {selectedCounty.naturalLandmark.tag}
                </span>
              </div>
              <p className="text-stone-400 leading-relaxed">
                {selectedCounty.naturalLandmark.description}
              </p>
            </div>

            {/* Representative Cultural Landmark */}
            <div className="bg-stone-950/70 p-3 rounded-xl border border-stone-800/80 flex flex-col gap-1 text-xs">
              <div className="flex items-center justify-between font-bold text-amber-300">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>人文古迹：{selectedCounty.culturalLandmark.name}</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
                  {selectedCounty.culturalLandmark.tag}
                </span>
              </div>
              <p className="text-stone-400 leading-relaxed">
                {selectedCounty.culturalLandmark.description}
              </p>
            </div>

            {/* Ethnic Features & Intangible Cultural Heritage (非遗) */}
            <div className="bg-stone-950/70 p-3 rounded-xl border border-stone-800/80 flex flex-col gap-1.5 text-xs">
              <div className="font-bold text-rose-300">
                【{selectedCounty.ethnicGroup}】民俗与非遗：
              </div>
              <div className="space-y-1 text-stone-300">
                <div>
                  <b className="text-stone-400">传统服饰：</b>
                  <span>{selectedCounty.ethnicFeatures.costumes}</span>
                </div>
                <div>
                  <b className="text-stone-400">非遗手艺：</b>
                  <span>{selectedCounty.ethnicFeatures.crafts}</span>
                </div>
                <div>
                  <b className="text-stone-400">岁时节庆：</b>
                  <span>{selectedCounty.ethnicFeatures.traditions}</span>
                </div>
                <div>
                  <b className="text-stone-400">风味特产：</b>
                  <span className="text-amber-300">{selectedCounty.ethnicFeatures.specialty}</span>
                </div>
              </div>
            </div>

            {/* Resident NPC & Exclusive Relic info */}
            {(() => {
              const profile = getCountyContent(selectedCounty);
              const quest = getCountyQuest(selectedCounty);
              const isQuestDone = completedCountyQuests.includes(selectedCounty.id);
              return (
                <div className="bg-amber-950/20 p-3 rounded-xl border border-amber-500/30 flex flex-col gap-2 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{profile.npcIcon}</span>
                    <div className="min-w-0">
                      <div className="font-bold text-amber-200">
                        驻县名宿：{profile.npcName}
                      </div>
                      <div className="text-[10px] text-stone-400 truncate">{profile.npcTitle}</div>
                    </div>
                  </div>

                  <div className="pt-1.5 border-t border-amber-500/20 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span>{profile.relicIcon}</span>
                      <span className="text-[11px] text-stone-300 font-medium">{profile.relicName}</span>
                    </div>
                    {isQuestDone && (
                      <span className="text-[10px] text-emerald-400 font-bold">✓ 信物已获取</span>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Travel / Teleport Action Button */}
            <div className="mt-auto pt-2">
              <button
                onClick={() => onTravelToCounty(selectedCounty)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2 transition active:scale-98"
              >
                <Navigation className="w-4 h-4" />
                <span>神行遁迹 · 踏入【{selectedCounty.name}】漫游</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
