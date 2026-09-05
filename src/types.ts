export type WeatherType = 'clear' | 'mist' | 'light_snow' | 'blizzard';

export type ZoneId = 'meadow' | 'danxia' | 'forest' | 'glacier';

export type EthnicGroup =
  | '裕固族'
  | '东乡族'
  | '保安族'
  | '撒拉族'
  | '土族'
  | '藏族'
  | '蒙古族'
  | '哈萨克族'
  | '回族'
  | '汉族/多元';

export type TerrainArchetype =
  | 'meadow'
  | 'danxia'
  | 'forest'
  | 'glacier'
  | 'gobi'
  | 'loess'
  | 'saltlake'
  | 'canyon';

export interface AdventureChoice {
  text: string;
  narrativeResult: string;
  statChange?: {
    temp?: number;
    stamina?: number;
    itemReward?: {
      id: string;
      name: string;
      category: 'food' | 'medicine' | 'tool' | 'relic';
      icon: string;
      description: string;
      effect?: { temp?: number; stamina?: number; resistColdSec?: number };
    };
  };
}

export interface CountyQuest {
  id: string;
  countyId: string;
  title: string;
  objective: string;
  targetDescription: string;
  rewardItem: Item;
  rewardStamina: number;
}

export interface CountyAdventureStory {
  title: string;
  intro: string;
  choices: AdventureChoice[];
}

export interface CountyData {
  id: string;
  name: string;
  province: '甘肃' | '青海';
  prefecture: string;
  isAutonomous: boolean;
  ethnicGroup: EthnicGroup;
  altitude: number; // in meters
  mapCoord: {
    x: number;
    y: number;
    elevation: number;
  };
  terrainArchetype: TerrainArchetype;
  terrainType: string;
  terrainDescription: string;
  naturalLandmark: {
    name: string;
    description: string;
    tag: string;
  };
  culturalLandmark: {
    name: string;
    description: string;
    tag: string;
  };
  ethnicFeatures: {
    costumes: string;
    crafts: string;
    traditions: string;
    specialty: string;
  };
  bgPalette: {
    skyTop: string;
    skyBottom: string;
    mountainFar: string;
    mountainMid: string;
    ground: string;
    accent: string;
  };
  weather: WeatherType;
  adventureStory?: CountyAdventureStory;
}

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
  altitude: number;
  baseTempDrain: number;
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
  currentCountyId: string;
  direction: 'left' | 'right' | 'up' | 'down';
  moving: boolean;
  bodyTemp: number; // 37.0 normal down to 30.0 critical
  maxBodyTemp: number;
  stamina: number;
  maxStamina: number;
  coldResistanceTimer: number;
  isListening: boolean;
  listeningTimer: number;
  listeningRadius: number;
  visitedCounties: string[];
  completedCountyQuests?: string[];
}

export interface GameSaveData {
  player: PlayerState;
  inventory: Item[];
  completedQuests: string[];
  currentQuestId: string;
  unlockedZones: ZoneId[];
  collectedObjects: string[];
  litCampfires: string[];
  visitedCounties?: string[];
  completedCountyQuests?: string[];
  activeEnding?: 'guardian' | 'harmony';
  timestamp: number;
}
