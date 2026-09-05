export type WeatherType = 'clear' | 'mist' | 'light_snow' | 'blizzard';

export type ZoneId = 'meadow' | 'danxia' | 'forest' | 'glacier';

export interface Item {
  id: string;
  name: string;
  category: 'food' | 'medicine' | 'tool' | 'relic';
  icon: string;
  description: string;
  count: number;
  effect?: {
    temp?: number;
    stamina?: number;
    resistColdSec?: number;
  };
}

export interface ZoneConfig {
  id: ZoneId;
  name: string;
  title: string;
  altitude: number; // in meters e.g. 2800m
  baseTempDrain: number; // rate of body temp drop per sec
  weather: WeatherType;
  description: string;
  bgPalette: {
    skyTop: string;
    skyBottom: string;
    mountainFar: string;
    mountainMid: string;
    ground: string;
    accent: string;
  };
  features: string[];
}

export interface NPC {
  id: string;
  name: string;
  title: string;
  zone: ZoneId;
  x: number;
  y: number;
  dialogueId: string;
  avatarColor: string;
  icon: string;
}

export interface DialogueNode {
  id: string;
  speaker: string;
  title?: string;
  text: string;
  options?: {
    text: string;
    nextId?: string;
    action?: 'give_item' | 'start_listening' | 'heal' | 'complete_quest' | 'trigger_ending_1' | 'trigger_ending_2';
    itemPayload?: string;
  }[];
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  zone: ZoneId;
  completed: boolean;
  objective: string;
  rewardText: string;
}

export interface InteractiveObject {
  id: string;
  name: string;
  type: 'campfire' | 'stele' | 'herb' | 'chest' | 'prayer_cairn' | 'passage';
  zone: ZoneId;
  x: number;
  y: number;
  width: number;
  height: number;
  lit?: boolean;
  discoveredOnlyByListening?: boolean;
  revealed?: boolean;
  collected?: boolean;
  prompt: string;
}

export interface PlayerState {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  zone: ZoneId;
  direction: 'left' | 'right' | 'up' | 'down';
  moving: boolean;
  bodyTemp: number; // 37.0 normal down to 30.0 critical
  maxBodyTemp: number;
  stamina: number;
  maxStamina: number;
  coldResistanceTimer: number; // seconds remaining of warming effect
  isListening: boolean;
  listeningTimer: number;
  listeningRadius: number;
}

export interface GameSaveData {
  player: PlayerState;
  inventory: Item[];
  completedQuests: string[];
  currentQuestId: string;
  unlockedZones: ZoneId[];
  collectedObjects: string[];
  litCampfires: string[];
  activeEnding?: 'guardian' | 'harmony';
  timestamp: number;
}
