import React, { useEffect, useRef, useState, useCallback } from 'react';
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

const SAVE_KEY = 'qilian_shanhai_save_v1';

export default function App() {
  // Screen & UI state
  const [inGame, setInGame] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeDialogue, setActiveDialogue] = useState<DialogueNode | null>(null);
  const [showCampfireModal, setShowCampfireModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
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
  });

  const [inventory, setInventory] = useState<Item[]>(INITIAL_INVENTORY);
  const [unlockedZones, setUnlockedZones] = useState<ZoneId[]>(['meadow']);
  const [completedQuestIds, setCompletedQuestIds] = useState<string[]>([]);
  const [currentQuestId, setCurrentQuestId] = useState<string>('q1');
  const [interactiveObjects, setInteractiveObjects] = useState<InteractiveObject[]>(INTERACTIVE_OBJECTS);
  const [nearbyPrompt, setNearbyPrompt] = useState<string | null>(null);
  const [hasSave, setHasSave] = useState(false);

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
        player,
        inventory,
        completedQuests: completedQuestIds,
        currentQuestId,
        unlockedZones,
        collectedObjects: interactiveObjects.filter((o) => o.collected).map((o) => o.id),
        litCampfires: interactiveObjects.filter((o) => o.type === 'campfire' && o.lit).map((o) => o.id),
        activeEnding: endingType || undefined,
        timestamp: Date.now(),
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
      setHasSave(true);
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  }, [player, inventory, completedQuestIds, currentQuestId, unlockedZones, interactiveObjects, endingType]);

  // Load game
  const loadGame = useCallback(() => {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return;
      const data: GameSaveData = JSON.parse(raw);
      setPlayer(data.player);
      setInventory(data.inventory);
      setCompletedQuestIds(data.completedQuests);
      setCurrentQuestId(data.currentQuestId);
      setUnlockedZones(data.unlockedZones);
      setInteractiveObjects((prev) =>
        prev.map((obj) => ({
          ...obj,
          collected: data.collectedObjects.includes(obj.id),
          lit: obj.type === 'campfire' ? data.litCampfires.includes(obj.id) : obj.lit,
        }))
      );
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
    });
    setInventory(INITIAL_INVENTORY);
    setUnlockedZones(['meadow']);
    setCompletedQuestIds([]);
    setCurrentQuestId('q1');
    setInteractiveObjects(INTERACTIVE_OBJECTS);
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

    // Reveal hidden objects in the current zone
    setInteractiveObjects((prev) =>
      prev.map((obj) => {
        if (obj.zone === player.zone && obj.discoveredOnlyByListening) {
          return { ...obj, revealed: true };
        }
        return obj;
      })
    );
  }, [player.isListening, player.zone]);

  // Player interaction with nearby NPCs / Objects
  const handleInteract = useCallback(() => {
    if (activeDialogue) return;

    // Check NPC interaction
    const currentNPCs = NPCS.filter((n) => n.zone === player.zone);
    for (const npc of currentNPCs) {
      const dist = Math.hypot(player.x - npc.x, player.y - npc.y);
      if (dist < 60) {
        sound.playPickup();
        const dialogue = DIALOGUES[npc.dialogueId];
        if (dialogue) {
          setActiveDialogue(dialogue);
          return;
        }
      }
    }

    // Check Interactive Objects
    const currentObjs = interactiveObjects.filter((o) => o.zone === player.zone);
    for (const obj of currentObjs) {
      if (obj.discoveredOnlyByListening && !obj.revealed && !player.isListening) {
        continue;
      }
      const dist = Math.hypot(player.x - obj.x, player.y - obj.y);
      if (dist < 65) {
        if (obj.type === 'campfire') {
          sound.playCampfireCrackle();
          // Ensure campfire is lit
          if (!obj.lit) {
            setInteractiveObjects((prev) =>
              prev.map((o) => (o.id === obj.id ? { ...o, lit: true } : o))
            );
          }
          setShowCampfireModal(true);
          return;
        } else if (obj.type === 'passage') {
          handlePassage(obj.id);
          return;
        } else if (obj.type === 'chest' && !obj.collected) {
          sound.playPickup();
          setInteractiveObjects((prev) =>
            prev.map((o) => (o.id === obj.id ? { ...o, collected: true } : o))
          );
          // Grant Qilian ancient mirror
          setInventory((prev) => [
            ...prev,
            {
              id: 'bronze_mirror',
              name: '祁连辟邪古铜镜',
              category: 'relic',
              icon: '🪞',
              description: '汉唐戍边将士以昆仑神铜铸造的辟邪宝镜，可折射高山晨曦金光，穿透万古冰川寒雾。',
              count: 1,
            },
          ]);
          setCompletedQuestIds((prev) => Array.from(new Set([...prev, 'q2'])));
          setCurrentQuestId('q3');
          setUnlockedZones((prev) => Array.from(new Set([...prev, 'forest'] as ZoneId[])));
          return;
        } else if (obj.type === 'herb' && !obj.collected) {
          sound.playPickup();
          setInteractiveObjects((prev) =>
            prev.map((o) => (o.id === obj.id ? { ...o, collected: true } : o))
          );
          setInventory((prev) => {
            const existing = prev.find((i) => i.id === 'snow_lotus');
            if (existing) {
              return prev.map((i) => (i.id === 'snow_lotus' ? { ...i, count: i.count + 1 } : i));
            }
            return [
              ...prev,
              {
                id: 'snow_lotus',
                name: '绝壁野生祁连雪莲',
                category: 'medicine',
                icon: '🪷',
                description: '生长在海拔3800米悬崖绝壁的万年圣草。服用后完全回满体温与精力，永久增加抵御寒风能力。',
                count: 1,
                effect: { temp: 5.0, stamina: 100, resistColdSec: 90 },
              },
            ];
          });
          setCompletedQuestIds((prev) => Array.from(new Set([...prev, 'q3'])));
          setCurrentQuestId('q4');
          setUnlockedZones((prev) => Array.from(new Set([...prev, 'glacier'] as ZoneId[])));
          return;
        } else if (obj.type === 'stele') {
          if (obj.id === 'glacier_altar') {
            const spiritNPC = NPCS.find((n) => n.id === 'mountain_spirit');
            if (spiritNPC) {
              setActiveDialogue(DIALOGUES.spirit_greeting);
            }
          }
        }
      }
    }
  }, [activeDialogue, player, interactiveObjects]);

  // Passage between zones
  const handlePassage = useCallback((passageId: string) => {
    sound.playFootstep();
    if (passageId === 'meadow_passage') {
      setPlayer((p) => ({ ...p, zone: 'danxia', x: 100, y: 340 }));
      setUnlockedZones((prev) => Array.from(new Set([...prev, 'danxia'] as ZoneId[])));
      setCurrentQuestId('q2');
    } else if (passageId === 'danxia_passage_back') {
      setPlayer((p) => ({ ...p, zone: 'meadow', x: 800, y: 340 }));
    } else if (passageId === 'danxia_passage_next') {
      setPlayer((p) => ({ ...p, zone: 'forest', x: 100, y: 350 }));
      setUnlockedZones((prev) => Array.from(new Set([...prev, 'forest'] as ZoneId[])));
      setCurrentQuestId('q3');
    } else if (passageId === 'forest_passage_back') {
      setPlayer((p) => ({ ...p, zone: 'danxia', x: 800, y: 340 }));
    } else if (passageId === 'forest_passage_next') {
      setPlayer((p) => ({ ...p, zone: 'glacier', x: 100, y: 340 }));
      setUnlockedZones((prev) => Array.from(new Set([...prev, 'glacier'] as ZoneId[])));
      setCurrentQuestId('q4');
    } else if (passageId === 'glacier_passage_back') {
      setPlayer((p) => ({ ...p, zone: 'forest', x: 800, y: 350 }));
    }
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
        const currentZoneConfig = ZONES[prev.zone];
        let newTemp = prev.bodyTemp;
        let newColdTimer = Math.max(0, prev.coldResistanceTimer - dt);

        // Check if near lit campfire
        const litCampfire = interactiveObjects.find(
          (o) => o.zone === prev.zone && o.type === 'campfire' && o.lit && Math.hypot(prev.x - o.x, prev.y - o.y) < 110
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
      const zoneNPCs = NPCS.filter((n) => n.zone === player.zone);
      let foundPrompt: string | null = null;

      for (const npc of zoneNPCs) {
        if (Math.hypot(player.x - npc.x, player.y - npc.y) < 65) {
          foundPrompt = `与 ${npc.name} 对话`;
          break;
        }
      }

      if (!foundPrompt) {
        const zoneObjs = interactiveObjects.filter((o) => o.zone === player.zone);
        for (const obj of zoneObjs) {
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
          ZONES[player.zone],
          player,
          NPCS,
          interactiveObjects,
          ZONES[player.zone].weather,
          dt
        );
      }

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [inGame, player.zone, player.x, player.y, player.isListening, interactiveObjects]);

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

      if (option.nextId && DIALOGUES[option.nextId]) {
        setActiveDialogue(DIALOGUES[option.nextId]);
      } else {
        setActiveDialogue(null);
      }
    },
    [activeDialogue, currentQuestId, handleTriggerListening]
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
          zone={ZONES[player.zone]}
          player={player}
          activeQuest={activeQuest}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onOpenInventory={() => setShowInventoryModal(true)}
          onOpenMap={() => setShowMapModal(true)}
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
            collectedObjects: interactiveObjects.filter((o) => o.collected).map((o) => o.id),
            litCampfires: interactiveObjects.filter((o) => o.type === 'campfire' && o.lit).map((o) => o.id),
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
