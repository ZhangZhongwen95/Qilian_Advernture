import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { GameRenderer } from './game/renderer';
import { sound } from './game/audio';
import {
  DIALOGUES,
  INITIAL_INVENTORY,
  INTERACTIVE_OBJECTS,
  NPCS,
  QUESTS,
  ZONES,
} from './game/worldData';
import {
  DialogueNode,
  GameSaveData,
  InteractiveObject,
  Item,
  NPC,
  PlayerState,
  Quest,
  ZoneId,
} from './types';
import { GameHUD } from './components/GameHUD';
import { MainMenu } from './components/MainMenu';
import { DialogueBox } from './components/DialogueBox';
import { CampfireModal } from './components/CampfireModal';
import { InventoryModal } from './components/InventoryModal';
import { MapModal } from './components/MapModal';
import { LoreModal } from './components/LoreModal';
import { EndingModal } from './components/EndingModal';
import { DeployGuideModal } from './components/DeployGuideModal';
import { MobileControls } from './components/MobileControls';
import { InkWashMap3D } from './components/InkWashMap3D';
import { CountyAdventureModal } from './components/CountyAdventureModal';
import { CountyChronicleModal } from './components/CountyChronicleModal';
import { COUNTIES_DATA, getCountyById } from './game/countyData';
import { generateCountyLevel, GeneratedCountyLevel } from './game/countyLevelEngine';
import { CountyData } from './types';

const SAVE_KEY = 'qilian_shanhai_save_v1';

export default function App() {
  // Screen & UI state
  const [inGame, setInGame] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeDialogue, setActiveDialogue] = useState<DialogueNode | null>(null);
  const [showCampfireModal, setShowCampfireModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [show3DMapModal, setShow3DMapModal] = useState(false);
  const [showChronicleModal, setShowChronicleModal] = useState(false);
  const [showAdventureModal, setShowAdventureModal] = useState(false);
  const [currentCountyId, setCurrentCountyId] = useState<string>('sunan');
  const [visitedCounties, setVisitedCounties] = useState<string[]>(['sunan']);
  const [completedCountyQuests, setCompletedCountyQuests] = useState<string[]>([]);
  const [showLoreModal, setShowLoreModal] = useState(false);
  const [showDeployGuide, setShowDeployGuide] = useState(false);
  const [endingType, setEndingType] = useState<'guardian' | 'harmony' | null>(null);

  // Player & Game State
  const [player, setPlayer] = useState<PlayerState>({
    x: 240,
    y: 350,
    targetX: 240,
    targetY: 350,
    zone: 'meadow',
    currentCountyId: 'sunan',
    direction: 'right',
    moving: false,
    bodyTemp: 37.0,
    maxBodyTemp: 37.0,
    stamina: 100,
    maxStamina: 100,
    coldResistanceTimer: 0,
    isListening: false,
    listeningTimer: 0,
    listeningRadius: 280,
    visitedCounties: ['sunan'],
  });

  const [inventory, setInventory] = useState<Item[]>(INITIAL_INVENTORY);
  const [unlockedZones, setUnlockedZones] = useState<ZoneId[]>(['meadow']);
  const [completedQuestIds, setCompletedQuestIds] = useState<string[]>([]);
  const [currentQuestId, setCurrentQuestId] = useState<string>('q1');
  const [collectedObjectIds, setCollectedObjectIds] = useState<string[]>([]);
  const [litCampfireIds, setLitCampfireIds] = useState<string[]>([]);
  const [nearbyPrompt, setNearbyPrompt] = useState<string | null>(null);
  const [hasSave, setHasSave] = useState(false);

  // Procedural County Level Definition
  const currentCounty = useMemo(() => getCountyById(currentCountyId), [currentCountyId]);
  const currentLevel = useMemo(() => generateCountyLevel(currentCounty), [currentCounty]);

  const activeObjects = useMemo(() => {
    return currentLevel.interactiveObjects.map((obj) => ({
      ...obj,
      collected: collectedObjectIds.includes(obj.id),
      lit: obj.type === 'campfire' ? (litCampfireIds.includes(obj.id) || obj.lit) : obj.lit,
    }));
  }, [currentLevel, collectedObjectIds, litCampfireIds]);

  const activeNPC = currentLevel.npc;
  const activeNPCs = useMemo(() => [activeNPC], [activeNPC]);

  const allDialogues = useMemo(
    () => ({
      ...DIALOGUES,
      ...currentLevel.dialogues,
    }),
    [currentLevel]
  );

  // Canvas & Engine refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<GameRenderer | null>(null);
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const touchDirRef = useRef<'up' | 'down' | 'left' | 'right' | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const activeCampfireNearbyRef = useRef<InteractiveObject | null>(null);

  // Check saved state
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) {
        setHasSave(true);
      }
    } catch {
      // ignore
    }
  }, []);

  // Save game progress
  const saveGame = useCallback(() => {
    try {
      const saveData: GameSaveData = {
        player: {
          ...player,
          currentCountyId,
          visitedCounties,
          completedCountyQuests,
        },
        inventory,
        completedQuests: completedQuestIds,
        completedCountyQuests,
        currentQuestId,
        unlockedZones,
        collectedObjects: collectedObjectIds,
        litCampfires: litCampfireIds,
        visitedCounties,
        activeEnding: endingType || undefined,
        timestamp: Date.now(),
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
      setHasSave(true);
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  }, [
    player,
    currentCountyId,
    visitedCounties,
    completedCountyQuests,
    inventory,
    completedQuestIds,
    currentQuestId,
    unlockedZones,
    collectedObjectIds,
    litCampfireIds,
    endingType,
  ]);

  // Load game
  const loadGame = useCallback(() => {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return;
      const data: GameSaveData = JSON.parse(raw);
      const loadedVisited = Array.isArray(data.visitedCounties) && data.visitedCounties.length > 0
        ? data.visitedCounties
        : Array.isArray(data.player?.visitedCounties) && data.player.visitedCounties.length > 0
        ? data.player.visitedCounties
        : ['sunan'];
      const loadedCounty = data.player?.currentCountyId || 'sunan';

      setPlayer({
        x: 240,
        y: 350,
        targetX: 240,
        targetY: 350,
        zone: 'meadow',
        direction: 'right',
        moving: false,
        bodyTemp: 37.0,
        maxBodyTemp: 37.0,
        stamina: 100,
        maxStamina: 100,
        coldResistanceTimer: 0,
        isListening: false,
        listeningTimer: 0,
        listeningRadius: 280,
        ...(data.player || {}),
        currentCountyId: loadedCounty,
        visitedCounties: loadedVisited,
      });

      setCurrentCountyId(loadedCounty);
      setVisitedCounties(loadedVisited);

      if (data.collectedObjects && Array.isArray(data.collectedObjects)) {
        setCollectedObjectIds(data.collectedObjects);
      }
      if (data.litCampfires && Array.isArray(data.litCampfires)) {
        setLitCampfireIds(data.litCampfires);
      }
      if (data.inventory && Array.isArray(data.inventory)) {
        setInventory(data.inventory);
      }
      if (data.completedQuests && Array.isArray(data.completedQuests)) {
        setCompletedQuestIds(data.completedQuests);
      }
      if (data.completedCountyQuests && Array.isArray(data.completedCountyQuests)) {
        setCompletedCountyQuests(data.completedCountyQuests);
      }
      if (data.currentQuestId) {
        setCurrentQuestId(data.currentQuestId);
      }
      if (data.unlockedZones && Array.isArray(data.unlockedZones)) {
        setUnlockedZones(data.unlockedZones);
      }
      if (data.activeEnding) {
        setEndingType(data.activeEnding);
      }
      setInGame(true);
      sound.startWind(0.3);
      sound.startAmbientMusic();
    } catch (e) {
      console.error('Error loading save:', e);
    }
  }, []);

  // Start new game
  const startNewGame = useCallback(() => {
    setPlayer({
      x: 240,
      y: 350,
      targetX: 240,
      targetY: 350,
      zone: 'meadow',
      currentCountyId: 'sunan',
      direction: 'right',
      moving: false,
      bodyTemp: 37.0,
      maxBodyTemp: 37.0,
      stamina: 100,
      maxStamina: 100,
      coldResistanceTimer: 0,
      isListening: false,
      listeningTimer: 0,
      listeningRadius: 280,
      visitedCounties: ['sunan'],
    });
    setInventory(INITIAL_INVENTORY);
    setUnlockedZones(['meadow']);
    setCompletedQuestIds([]);
    setCurrentQuestId('q1');
    setCurrentCountyId('sunan');
    setVisitedCounties(['sunan']);
    setCollectedObjectIds([]);
    setLitCampfireIds([]);
    setEndingType(null);
    setInGame(true);
    sound.startWind(0.3);
    sound.startAmbientMusic();
  }, []);

  // Initialize Canvas Renderer & ResizeObserver
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    const canvas = canvasRef.current;
    rendererRef.current = new GameRenderer(canvas);

    const updateSize = () => {
      if (!containerRef.current || !canvasRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      canvasRef.current.width = rect.width;
      canvasRef.current.height = rect.height;
    };

    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(containerRef.current);

    return () => ro.disconnect();
  }, [inGame]);

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.code] = true;

      // Handle direct hotkeys
      if (e.code === 'KeyE') {
        handleInteract();
      } else if (e.code === 'Space') {
        e.preventDefault();
        handleTriggerListening();
      } else if (e.code === 'KeyI' || e.code === 'KeyB') {
        setShowInventoryModal((prev) => !prev);
      } else if (e.code === 'KeyM') {
        setShowMapModal((prev) => !prev);
      } else if (e.code === 'Escape') {
        // Close modals or toggle menu
        if (
          activeDialogue ||
          showCampfireModal ||
          showInventoryModal ||
          showMapModal ||
          showLoreModal ||
          showDeployGuide ||
          endingType
        ) {
          setActiveDialogue(null);
          setShowCampfireModal(false);
          setShowInventoryModal(false);
          setShowMapModal(false);
          setShowLoreModal(false);
          setShowDeployGuide(false);
        } else {
          setInGame(false);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  });

  // "听山" (Mountain Listening) Trigger
  const handleTriggerListening = useCallback(() => {
    if (player.isListening) return;
    sound.playMountainListenChime();
    setPlayer((prev) => ({
      ...prev,
      isListening: true,
      listeningTimer: 5.0, // active for 5 seconds
    }));
  }, [player.isListening]);

  // Player interaction with nearby NPCs / Objects
  const handleInteract = useCallback(() => {
    if (activeDialogue) return;

    // 1. Check NPC interaction
    const distNPC = Math.hypot(player.x - activeNPC.x, player.y - activeNPC.y);
    if (distNPC < 65) {
      sound.playPickup();
      const dialogue = allDialogues[activeNPC.dialogueId] || allDialogues.intro_greeting;
      if (dialogue) {
        setActiveDialogue(dialogue);
        return;
      }
    }

    // 2. Check Interactive Objects
    for (const obj of activeObjects) {
      if (obj.discoveredOnlyByListening && !obj.revealed && !player.isListening) {
        continue;
      }
      const dist = Math.hypot(player.x - obj.x, player.y - obj.y);
      if (dist < 65) {
        if (obj.type === 'campfire') {
          sound.playCampfireCrackle();
          if (!obj.lit) {
            setLitCampfireIds((prev) => Array.from(new Set([...prev, obj.id])));
          }
          setShowCampfireModal(true);
          return;
        } else if (obj.type === 'stele') {
          sound.playChime();
          setShowAdventureModal(true);
          return;
        } else if (obj.type === 'passage') {
          sound.playFootstep();
          setShow3DMapModal(true);
          return;
        } else if (obj.type === 'prayer_cairn') {
          sound.playChime();
          setPlayer((p) => {
            const existingVisited = Array.isArray(p?.visitedCounties) ? p.visitedCounties : ['sunan'];
            return {
              ...p,
              stamina: p.maxStamina,
              bodyTemp: Math.max(36.5, p.bodyTemp),
              coldResistanceTimer: p.coldResistanceTimer + 60,
              visitedCounties: Array.from(new Set([...existingVisited, currentCountyId])),
            };
          });
          setVisitedCounties((prev) => Array.from(new Set([...(Array.isArray(prev) ? prev : []), currentCountyId])));
          setCompletedCountyQuests((prev) => Array.from(new Set([...prev, currentCountyId])));
          return;
        } else if (obj.type === 'herb' && !obj.collected) {
          sound.playPickup();
          setCollectedObjectIds((prev) => Array.from(new Set([...prev, obj.id])));
          const specialty = currentLevel.specialtyItem;
          setInventory((prev) => {
            const existing = prev.find((i) => i.id === specialty.id);
            if (existing) {
              return prev.map((i) => (i.id === specialty.id ? { ...i, count: i.count + 1 } : i));
            }
            return [...prev, specialty];
          });
          return;
        } else if (obj.type === 'chest' && !obj.collected) {
          sound.playPickup();
          setCollectedObjectIds((prev) => Array.from(new Set([...prev, obj.id])));
          const relic = currentLevel.relicItem;
          setInventory((prev) => {
            const existing = prev.find((i) => i.id === relic.id);
            if (existing) {
              return prev.map((i) => (i.id === relic.id ? { ...i, count: i.count + 1 } : i));
            }
            return [...prev, relic];
          });
          setCompletedCountyQuests((prev) => Array.from(new Set([...prev, currentCountyId])));
          return;
        }
      }
    }
  }, [
    activeDialogue,
    player,
    activeNPC,
    activeObjects,
    allDialogues,
    currentCountyId,
    currentLevel,
  ]);

  // Passage opens 3D Ink-Wash Map for free county roaming
  const handlePassage = useCallback(() => {
    sound.playFootstep();
    setShow3DMapModal(true);
  }, []);

  // Main Game Animation & Physics Loop
  useEffect(() => {
    if (!inGame) return;

    let animId: number;

    const gameLoop = (timestamp: number) => {
      const deltaMs = timestamp - lastTimeRef.current;
      const dt = Math.min(deltaMs / 1000, 0.1); // clamp dt
      lastTimeRef.current = timestamp;

      // 1. Calculate movement vectors from keyboard or touch controls
      let moveX = 0;
      let moveY = 0;

      const keys = keysPressed.current;
      const touchDir = touchDirRef.current;

      if (keys['KeyW'] || keys['ArrowUp'] || touchDir === 'up') moveY -= 1;
      if (keys['KeyS'] || keys['ArrowDown'] || touchDir === 'down') moveY += 1;
      if (keys['KeyA'] || keys['ArrowLeft'] || touchDir === 'left') moveX -= 1;
      if (keys['KeyD'] || keys['ArrowRight'] || touchDir === 'right') moveX += 1;

      const isMoving = moveX !== 0 || moveY !== 0;

      setPlayer((prev) => {
        let newX = prev.x;
        let newY = prev.y;
        let dir = prev.direction;

        // Base speed affected by hypothermia (<34.0°C slows movement)
        const coldSlowdown = prev.bodyTemp < 33.5 ? 0.55 : prev.bodyTemp < 35.0 ? 0.8 : 1.0;
        const speed = 160 * coldSlowdown * dt;

        if (isMoving) {
          // Normalize diagonal
          const len = Math.hypot(moveX, moveY) || 1;
          newX += (moveX / len) * speed;
          newY += (moveY / len) * speed;

          if (moveX < 0) dir = 'left';
          else if (moveX > 0) dir = 'right';

          // Clamp to canvas borders
          const w = canvasRef.current?.width || 900;
          const h = canvasRef.current?.height || 550;
          newX = Math.max(30, Math.min(w - 30, newX));
          newY = Math.max(h * 0.55, Math.min(h * 0.85, newY));

          // Footstep sound throttled
          if (Math.random() < 0.1) {
            sound.playFootstep();
          }
        }

        // 2. Temperature drain calculation
        const currentZoneConfig = currentLevel.zoneConfig;
        let newTemp = prev.bodyTemp;
        let newColdTimer = Math.max(0, prev.coldResistanceTimer - dt);

        // Check if near lit campfire
        const litCampfire = activeObjects.find(
          (o) => o.type === 'campfire' && o.lit && Math.hypot(prev.x - o.x, prev.y - o.y) < 110
        );
        activeCampfireNearbyRef.current = litCampfire || null;

        if (litCampfire) {
          // Warming up naturally near fire
          newTemp = Math.min(37.0, newTemp + dt * 0.6);
        } else if (newColdTimer <= 0) {
          // Drain temperature based on zone altitude & weather
          const blizzardMultiplier = currentZoneConfig.weather === 'blizzard' ? 1.8 : 1.0;
          newTemp = Math.max(30.0, newTemp - currentZoneConfig.baseTempDrain * blizzardMultiplier * dt);
        }

        // 3. Freezing collapse recovery check
        if (newTemp <= 30.1) {
          // Auto-rescue to nearest campsite
          newTemp = 34.5;
          newX = 360;
          newY = 360;
        }

        // 4. "Mountain Listening" (听山) timer decay
        let isListening = prev.isListening;
        let listeningTimer = prev.listeningTimer;
        if (isListening) {
          listeningTimer -= dt;
          if (listeningTimer <= 0) {
            isListening = false;
            listeningTimer = 0;
          }
        }

        // 5. Stamina regeneration / drain
        let newStamina = prev.stamina;
        if (isMoving) {
          newStamina = Math.max(0, newStamina - dt * 2.5);
        } else {
          newStamina = Math.min(prev.maxStamina, newStamina + dt * 6);
        }

        return {
          ...prev,
          x: newX,
          y: newY,
          direction: dir,
          moving: isMoving,
          bodyTemp: newTemp,
          stamina: newStamina,
          coldResistanceTimer: newColdTimer,
          isListening,
          listeningTimer,
        };
      });

      // Check nearby interactables for prompt
      let foundPrompt: string | null = null;
      if (Math.hypot(player.x - activeNPC.x, player.y - activeNPC.y) < 65) {
        foundPrompt = `与 ${activeNPC.name} 对话`;
      }

      if (!foundPrompt) {
        for (const obj of activeObjects) {
          if (obj.discoveredOnlyByListening && !obj.revealed && !player.isListening) {
            continue;
          }
          if (Math.hypot(player.x - obj.x, player.y - obj.y) < 65) {
            foundPrompt = obj.prompt;
            break;
          }
        }
      }
      setNearbyPrompt(foundPrompt);

      // Render frame
      if (rendererRef.current) {
        rendererRef.current.render(
          currentLevel.zoneConfig,
          player,
          activeNPCs,
          activeObjects,
          currentLevel.zoneConfig.weather,
          dt,
          currentCounty
        );
      }

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [
    inGame,
    player.x,
    player.y,
    player.isListening,
    activeObjects,
    activeNPC,
    activeNPCs,
    currentLevel,
    currentCounty,
  ]);

  // Periodic Auto-save every 10 seconds
  useEffect(() => {
    if (!inGame) return;
    const interval = setInterval(() => {
      saveGame();
    }, 10000);
    return () => clearInterval(interval);
  }, [inGame, saveGame]);

  // Sound Mute Toggle
  const handleToggleMute = useCallback(() => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sound.setMuted(nextMuted);
  }, [isMuted]);

  // Dialogue Selection Handler
  const handleSelectDialogueOption = useCallback(
    (idx: number) => {
      if (!activeDialogue || !activeDialogue.options) return;
      const option = activeDialogue.options[idx];
      if (!option) return;

      // Handle Dialogue Actions
      if (option.action === 'give_item') {
        sound.playPickup();
        if (option.itemPayload === 'butter_tea') {
          setInventory((prev) => {
            const existing = prev.find((i) => i.id === 'butter_tea');
            if (existing) {
              return prev.map((i) => (i.id === 'butter_tea' ? { ...i, count: i.count + 1 } : i));
            }
            return [
              ...prev,
              {
                id: 'butter_tea',
                name: '热腾腾的酥油茶',
                category: 'food',
                icon: '🍵',
                description: '浓郁醇香的酥油与砖茶慢熬而成。饮下后四肢百骸回暖，大幅提升体温与御寒力。',
                count: 1,
                effect: { temp: 3.5, stamina: 30, resistColdSec: 50 },
              },
            ];
          });
        } else if (option.itemPayload === 'snow_lotus') {
          setInventory((prev) => {
            const existing = prev.find((i) => i.id === 'snow_lotus');
            if (existing) {
              return prev.map((i) => (i.id === 'snow_lotus' ? { ...i, count: i.count + 1 } : i));
            }
            return [
              ...prev,
              {
                id: 'snow_lotus',
                name: '圣洁祁连雪莲',
                category: 'medicine',
                icon: '🪷',
                description: '百年祁连雪莲，回满体温与体力，提供极强御寒屏障。',
                count: 1,
                effect: { temp: 5.0, stamina: 100, resistColdSec: 90 },
              },
            ];
          });
        } else {
          // County specialty gift
          const specialty = currentLevel.specialtyItem;
          setInventory((prev) => {
            const existing = prev.find((i) => i.id === specialty.id);
            if (existing) {
              return prev.map((i) => (i.id === specialty.id ? { ...i, count: i.count + 1 } : i));
            }
            return [...prev, specialty];
          });
        }
      } else if (option.action === 'start_listening') {
        handleTriggerListening();
      } else if (option.action === 'heal') {
        sound.playCampfireCrackle();
        setPlayer((prev) => ({ ...prev, bodyTemp: 37.0, stamina: 100 }));
      } else if (option.action === 'complete_quest') {
        setCompletedQuestIds((prev) => Array.from(new Set([...prev, currentQuestId])));
      } else if (option.action === 'trigger_ending_1') {
        setActiveDialogue(null);
        setEndingType('guardian');
        return;
      } else if (option.action === 'trigger_ending_2') {
        setActiveDialogue(null);
        setEndingType('harmony');
        return;
      }

      if (option.nextId && allDialogues[option.nextId]) {
        setActiveDialogue(allDialogues[option.nextId]);
      } else {
        setActiveDialogue(null);
      }
    },
    [activeDialogue, allDialogues, currentLevel, currentQuestId, handleTriggerListening]
  );

  // Use Item Handler
  const handleUseItem = useCallback(
    (itemId: string) => {
      const item = inventory.find((i) => i.id === itemId);
      if (!item || item.count <= 0) return;

      sound.playDrinkTea();
      setPlayer((prev) => ({
        ...prev,
        bodyTemp: Math.min(37.0, prev.bodyTemp + (item.effect?.temp || 0)),
        stamina: Math.min(prev.maxStamina, prev.stamina + (item.effect?.stamina || 0)),
        coldResistanceTimer: prev.coldResistanceTimer + (item.effect?.resistColdSec || 0),
      }));

      setInventory((prev) =>
        prev
          .map((i) => (i.id === itemId ? { ...i, count: i.count - 1 } : i))
          .filter((i) => i.count > 0 || i.category !== 'food')
      );
    },
    [inventory]
  );

  // Campfire Actions
  const handleCampfireWarmUp = useCallback(() => {
    sound.playCampfireCrackle();
    setPlayer((prev) => ({ ...prev, bodyTemp: 37.0, stamina: 100 }));
  }, []);

  const handleCampfireBrewTea = useCallback(() => {
    handleUseItem('butter_tea');
  }, [handleUseItem]);

  const handleCampfireRoastBread = useCallback(() => {
    handleUseItem('barley_bread');
  }, [handleUseItem]);

  // Fast travel from Map
  const handleFastTravel = useCallback((zoneId: ZoneId) => {
    sound.playFootstep();
    setPlayer((prev) => ({
      ...prev,
      zone: zoneId,
      x: 300,
      y: 340,
    }));
    setShowMapModal(false);
  }, []);

  // Travel to specific county from 3D Ink-Wash Map
  const handleTravelToCounty = useCallback((county: CountyData) => {
    sound.playPickup();
    setCurrentCountyId(county.id);
    setVisitedCounties((prev) => Array.from(new Set([...(Array.isArray(prev) ? prev : []), county.id])));

    // Map terrain to best zone template
    let targetZone: ZoneId = 'meadow';
    const combined = county.terrainType + county.naturalLandmark.name;
    if (combined.includes('丹霞') || combined.includes('沙') || combined.includes('戈壁') || combined.includes('雅丹')) {
      targetZone = 'danxia';
    } else if (combined.includes('林') || combined.includes('峡') || combined.includes('山原') || combined.includes('花海')) {
      targetZone = 'forest';
    } else if (combined.includes('冰川') || combined.includes('雪峰') || combined.includes('极高') || combined.includes('雪山')) {
      targetZone = 'glacier';
    }

    setPlayer((prev) => {
      const existingVisited = Array.isArray(prev?.visitedCounties)
        ? prev.visitedCounties
        : Array.isArray(visitedCounties)
        ? visitedCounties
        : ['sunan'];

      return {
        ...prev,
        zone: targetZone,
        currentCountyId: county.id,
        x: 320,
        y: 350,
        targetX: 320,
        targetY: 350,
        moving: false,
        visitedCounties: Array.from(new Set([...existingVisited, county.id])),
      };
    });
    setShow3DMapModal(false);
  }, [visitedCounties]);

  // Apply reward from County Adventure Story
  const handleApplyAdventureReward = useCallback(
    (statChange: { temp?: number; stamina?: number }, itemReward?: Item) => {
      sound.playPickup();
      setPlayer((prev) => {
        const existingVisited = Array.isArray(prev?.visitedCounties) ? prev.visitedCounties : ['sunan'];
        return {
          ...prev,
          bodyTemp: Math.min(37.0, Math.max(30.0, prev.bodyTemp + (statChange.temp || 0))),
          stamina: Math.min(prev.maxStamina, Math.max(0, prev.stamina + (statChange.stamina || 0))),
          visitedCounties: Array.from(new Set([...existingVisited, currentCountyId])),
        };
      });

      if (itemReward) {
        setInventory((prev) => {
          const existing = prev.find((i) => i.id === itemReward.id);
          if (existing) {
            return prev.map((i) => (i.id === itemReward.id ? { ...i, count: i.count + 1 } : i));
          }
          return [...prev, itemReward];
        });
      }

      setVisitedCounties((prev) => Array.from(new Set([...(Array.isArray(prev) ? prev : []), currentCountyId])));
      setCompletedCountyQuests((prev) => Array.from(new Set([...prev, currentCountyId])));
    },
    [currentCountyId]
  );

  const activeQuest = QUESTS.find((q) => q.id === currentQuestId);

  return (
    <div
      ref={containerRef}
      className="relative w-screen h-screen overflow-hidden bg-stone-950 font-sans text-stone-100 select-none touch-none"
    >
      {/* Canvas Viewport */}
      <canvas
        ref={canvasRef}
        className={`w-full h-full block ${!inGame ? 'blur-sm brightness-50' : ''}`}
      />

      {/* In-Game HUD overlay */}
      {inGame && (
        <GameHUD
          zone={currentLevel.zoneConfig}
          player={player}
          currentCounty={currentCounty}
          visitedCounties={visitedCounties}
          completedCountyQuests={completedCountyQuests}
          activeQuest={activeQuest}
          countyQuest={currentLevel.countyQuest}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onOpenInventory={() => setShowInventoryModal(true)}
          onOpenMap={() => setShowMapModal(true)}
          onOpen3DMap={() => setShow3DMapModal(true)}
          onOpenChronicle={() => setShowChronicleModal(true)}
          onOpenAdventure={() => setShowAdventureModal(true)}
          onOpenLore={() => setShowLoreModal(true)}
          onOpenDeployGuide={() => setShowDeployGuide(true)}
          onListen={handleTriggerListening}
          nearbyPrompt={nearbyPrompt}
        />
      )}

      {/* Mobile Touch Virtual Controls */}
      {inGame && (
        <MobileControls
          onMoveStart={(dir) => {
            touchDirRef.current = dir;
          }}
          onMoveEnd={() => {
            touchDirRef.current = null;
          }}
          onInteract={handleInteract}
          onListen={handleTriggerListening}
          onOpenInventory={() => setShowInventoryModal(true)}
          onOpenCampfire={() => setShowCampfireModal(true)}
          canCampfire={!!activeCampfireNearbyRef.current}
          nearbyPrompt={nearbyPrompt}
        />
      )}

      {/* Main Title Menu */}
      {!inGame && (
        <div className="absolute inset-0 z-50">
          <MainMenu
            hasSave={hasSave}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            onStartNewGame={startNewGame}
            onContinueGame={loadGame}
            onOpen3DMap={() => setShow3DMapModal(true)}
            onOpenChronicle={() => setShowChronicleModal(true)}
            onOpenLore={() => setShowLoreModal(true)}
            onOpenDeployGuide={() => setShowDeployGuide(true)}
          />
        </div>
      )}

      {/* Modals & Dialogues */}
      {activeDialogue && (
        <DialogueBox
          dialogue={activeDialogue}
          onSelectOption={handleSelectDialogueOption}
          onClose={() => setActiveDialogue(null)}
        />
      )}

      {showCampfireModal && (
        <CampfireModal
          player={player}
          inventory={inventory}
          onWarmUp={handleCampfireWarmUp}
          onBrewTea={handleCampfireBrewTea}
          onRoastBread={handleCampfireRoastBread}
          onClose={() => setShowCampfireModal(false)}
        />
      )}

      {showInventoryModal && (
        <InventoryModal
          inventory={inventory}
          onUseItem={handleUseItem}
          onClose={() => setShowInventoryModal(false)}
        />
      )}

      {showMapModal && (
        <MapModal
          currentZone={player.zone}
          unlockedZones={unlockedZones}
          onFastTravel={handleFastTravel}
          onClose={() => setShowMapModal(false)}
        />
      )}

      {show3DMapModal && (
        <InkWashMap3D
          currentCountyId={currentCountyId}
          visitedCounties={visitedCounties}
          completedCountyQuests={completedCountyQuests}
          onTravelToCounty={handleTravelToCounty}
          onOpenChronicle={() => {
            setShow3DMapModal(false);
            setShowChronicleModal(true);
          }}
          onClose={() => setShow3DMapModal(false)}
        />
      )}

      {showChronicleModal && (
        <CountyChronicleModal
          currentCountyId={currentCountyId}
          visitedCounties={visitedCounties}
          completedCountyQuests={completedCountyQuests}
          onTravelToCounty={(county) => {
            handleTravelToCounty(county);
            setShowChronicleModal(false);
            if (!inGame) {
              setInGame(true);
              sound.startWind(0.3);
              sound.startAmbientMusic();
            }
          }}
          onClose={() => setShowChronicleModal(false)}
        />
      )}

      {showAdventureModal && (
        <CountyAdventureModal
          county={currentCounty}
          story={currentLevel.adventureStory}
          onApplyReward={handleApplyAdventureReward}
          onClose={() => setShowAdventureModal(false)}
        />
      )}

      {showLoreModal && (
        <LoreModal onClose={() => setShowLoreModal(false)} />
      )}

      {showDeployGuide && (
        <DeployGuideModal
          currentSave={{
            player,
            inventory,
            completedQuests: completedQuestIds,
            currentQuestId,
            unlockedZones,
            collectedObjects: collectedObjectIds,
            litCampfires: litCampfireIds,
            visitedCounties,
            activeEnding: endingType || undefined,
            timestamp: Date.now(),
          }}
          onClose={() => setShowDeployGuide(false)}
        />
      )}

      {endingType && (
        <EndingModal
          endingType={endingType}
          onRestart={startNewGame}
          onContinueFreeRoam={() => setEndingType(null)}
          onReturnToTitle={() => {
            setEndingType(null);
            setInGame(false);
          }}
        />
      )}
    </div>
  );
}
