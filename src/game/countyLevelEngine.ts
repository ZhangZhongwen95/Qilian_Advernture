import { CountyData, ZoneConfig, NPC, DialogueNode, InteractiveObject, Item, CountyAdventureStory, CountyQuest } from '../types';
import { getCountyContent, getCountyQuest } from './countyContentDatabase';

export interface GeneratedCountyLevel {
  zoneConfig: ZoneConfig;
  npc: NPC;
  dialogues: Record<string, DialogueNode>;
  interactiveObjects: InteractiveObject[];
  specialtyItem: Item;
  relicItem: Item;
  adventureStory: CountyAdventureStory;
  countyQuest: CountyQuest;
  secretLore: string;
}

// Generate an authentic NPC tailored specifically to the county using countyContentDatabase
function generateCountyNPC(county: CountyData): {
  npc: NPC;
  dialogues: Record<string, DialogueNode>;
  secretLore: string;
  quest: CountyQuest;
  relicItem: Item;
} {
  const profile = getCountyContent(county);
  const quest = getCountyQuest(county);
  const relicItem: Item = {
    id: `relic_${county.id}`,
    name: profile.relicName,
    category: 'relic',
    icon: profile.relicIcon,
    description: profile.relicDescription,
    count: 1,
    effect: profile.relicEffect,
  };

  const dialogueBaseId = `npc_${county.id}`;
  const dialogues: Record<string, DialogueNode> = {
    [`${dialogueBaseId}_greeting`]: {
      id: `${dialogueBaseId}_greeting`,
      speaker: profile.npcName,
      title: profile.npcTitle,
      text: `${profile.npcGreeting}\n\n此地海拔高达 ${county.altitude} 米，展现出【${county.terrainType}】之地势。巍然可见【${county.naturalLandmark.name}】（${county.naturalLandmark.tag}），文脉深植于【${county.culturalLandmark.name}】！`,
      options: [
        {
          text: `请教老丈，此地的自然风物与人文传承是？`,
          nextId: `${dialogueBaseId}_lore`,
        },
        {
          text: `可有【${county.name}】未曾示人的秘闻轶事？`,
          nextId: `${dialogueBaseId}_secret`,
        },
        {
          text: `我周身略觉寒凉，能在营火旁暖身并尝尝地方风物吗？`,
          nextId: `${dialogueBaseId}_warm`,
        },
        {
          text: `请问此地有何风物考察委托（县域任务）？`,
          nextId: `${dialogueBaseId}_quest_info`,
        },
      ],
    },
    [`${dialogueBaseId}_lore`]: {
      id: `${dialogueBaseId}_lore`,
      speaker: profile.npcName,
      title: profile.npcTitle,
      text: `${profile.npcLore}\n\n【服饰仪轨】${county.ethnicFeatures.costumes}\n【非遗绝技】${county.ethnicFeatures.crafts}\n【岁时节庆】${county.ethnicFeatures.traditions}\n【风物珍味】${county.ethnicFeatures.specialty}`,
      options: [
        {
          text: '钟灵毓秀，晚辈受教了！',
          nextId: `${dialogueBaseId}_give_item`,
        },
      ],
    },
    [`${dialogueBaseId}_secret`]: {
      id: `${dialogueBaseId}_secret`,
      speaker: profile.npcName,
      title: profile.npcTitle,
      text: `【县志绝密史话】\n${profile.secretLore}\n\n若你前往前方的【${county.culturalLandmark.name}古碑】施展【听山秘术】（空格键），必能亲眼感应天地灵韵，触发独属于【${county.name}】的山海风物奇遇！`,
      options: [
        {
          text: '如此神妙！我定当前去一探古碑。',
        },
      ],
    },
    [`${dialogueBaseId}_quest_info`]: {
      id: `${dialogueBaseId}_quest_info`,
      speaker: profile.npcName,
      title: profile.npcTitle,
      text: `【县域考察委托 · ${quest.title}】\n\n目标：${quest.objective}\n\n考证提示：只需在前瞻仰古碑参悟奇遇、采撷特产、或在圣坛祈福，即可圆满勘定本县风物，获赠独有信物【${profile.relicName}】！`,
      options: [
        {
          text: '明白！我这就着手考察。',
        },
      ],
    },
    [`${dialogueBaseId}_give_item`]: {
      id: `${dialogueBaseId}_give_item`,
      speaker: profile.npcName,
      title: profile.npcTitle,
      text: `相逢便是有缘。我这里有一份地道的本地风物【${county.ethnicFeatures.specialty.split('、')[0]}】，你随身带上！旅途中含上一口，能迅速驱寒回暖、稳固精气神。`,
      options: [
        {
          text: `多谢老丈厚赠！`,
          action: 'give_item',
          itemPayload: `item_${county.id}`,
        },
      ],
    },
    [`${dialogueBaseId}_warm`]: {
      id: `${dialogueBaseId}_warm`,
      speaker: profile.npcName,
      title: profile.npcTitle,
      text: `快靠近身旁的【${profile.campfireName || `${county.name}暖炉`}】！松木与柴薪噼啪作响，把手伸过来烘一烘。在高寒山地切记：体温若降得太低，行动迟缓，极易冻伤！`,
      options: [
        {
          text: '围炉烤火，身心暖融！',
          action: 'heal',
        },
      ],
    },
  };

  return {
    npc: {
      id: `npc_${county.id}`,
      name: profile.npcName,
      title: profile.npcTitle,
      zone: 'meadow',
      x: 480,
      y: 350,
      dialogueId: `${dialogueBaseId}_greeting`,
      avatarColor: county.bgPalette.accent,
      icon: profile.npcIcon,
    },
    dialogues,
    secretLore: profile.secretLore,
    quest,
    relicItem,
  };
}

// Generate the local specialty collectible item
function generateSpecialtyItem(county: CountyData): Item {
  const specialtyName = county.ethnicFeatures.specialty.split('、')[0];
  let icon = '🍵';
  let category: 'food' | 'medicine' | 'tool' | 'relic' = 'food';
  let desc = `来自${county.name}的独特风物特产（${county.ethnicFeatures.specialty}）。`;

  if (county.ethnicFeatures.crafts.includes('刀')) {
    icon = '🗡️';
    category = 'tool';
    desc = `${county.name}国家级非遗工艺锻造名刃，削铁如泥，佩在腰间胆气大壮。`;
  } else if (county.ethnicFeatures.crafts.includes('绣') || county.ethnicFeatures.crafts.includes('毯')) {
    icon = '🧶';
    category = 'tool';
    desc = `${county.name}精湛绝伦的手工编织刺绣织品，贴身御寒抵御狂风。`;
  } else if (county.terrainArchetype === 'glacier') {
    icon = '❄️';
    category = 'medicine';
    desc = `采自${county.name}雪线悬崖的至纯灵药，可清热强心，护持体温。`;
  } else if (county.terrainArchetype === 'saltlake') {
    icon = '🧂';
    category = 'tool';
    desc = `采自${county.name}盐湖纯净结晶大青盐，富含微量元素，提神定气。`;
  }

  return {
    id: `item_${county.id}`,
    name: specialtyName,
    category,
    icon,
    description: desc,
    count: 1,
    effect: {
      temp: 4.0,
      stamina: 35,
      resistColdSec: 60,
    },
  };
}

// Generate the interactive objects for this county level
function generateInteractiveObjects(county: CountyData, campfireName?: string): InteractiveObject[] {
  const objects: InteractiveObject[] = [
    // 1. County Campfire
    {
      id: `campfire_${county.id}`,
      name: campfireName || `${county.name} · 特色暖炉`,
      type: 'campfire',
      zone: 'meadow',
      x: 360,
      y: 340,
      width: 44,
      height: 44,
      lit: true,
      prompt: `靠近【${campfireName || `${county.name}营火`}】添柴取暖与烹茶（恢复体温）`,
    },
    // 2. Cultural / Natural Landmark Stele (Triggers Text Adventure)
    {
      id: `stele_${county.id}`,
      name: `【${county.culturalLandmark.name}】古碑记`,
      type: 'stele',
      zone: 'meadow',
      x: 620,
      y: 320,
      width: 40,
      height: 60,
      prompt: `瞻仰【${county.culturalLandmark.name}】并触发山海文字奇遇`,
    },
    // 3. Local specialty collectible resource
    {
      id: `herb_${county.id}`,
      name: `珍稀风物 · ${county.ethnicFeatures.specialty.split('、')[0]}`,
      type: 'herb',
      zone: 'meadow',
      x: 220,
      y: 380,
      width: 32,
      height: 32,
      collected: false,
      prompt: `采撷【${county.name}】特产地道风物【${county.ethnicFeatures.specialty.split('、')[0]}】`,
    },
    // 4. Prayer Cairn / Altar (Blessing node)
    {
      id: `cairn_${county.id}`,
      name: `【${county.naturalLandmark.tag}】祈福圣坛`,
      type: 'prayer_cairn',
      zone: 'meadow',
      x: 750,
      y: 360,
      width: 36,
      height: 48,
      prompt: `敬拜【${county.naturalLandmark.name}】祈求山神护佑`,
    },
    // 5. Waypoint / Post (Quick travel back to 3D Map)
    {
      id: `post_${county.id}`,
      name: `【甘青古道界碑】舆图驿站`,
      type: 'passage',
      zone: 'meadow',
      x: 100,
      y: 330,
      width: 40,
      height: 55,
      prompt: `触动【甘青古道界碑】打开 3D 水墨全舆图远行`,
    },
    // 6. County exclusive relic chest
    {
      id: `chest_${county.id}`,
      name: `【${county.name}】遗迹宝匣`,
      type: 'chest',
      zone: 'meadow',
      x: 820,
      y: 340,
      width: 36,
      height: 36,
      collected: false,
      prompt: `开启【${county.name}】遗迹宝匣，寻获本县镇境信物`,
    },
  ];

  return objects;
}

// Generate the interactive Text Adventure Encounter for this county
function generateAdventureStory(county: CountyData, relicItem: Item, secretLore: string): CountyAdventureStory {
  const firstSpecialty = county.ethnicFeatures.specialty.split('、')[0];
  const firstCraft = county.ethnicFeatures.crafts.split('（')[0].slice(0, 16);

  return {
    title: `【${county.name}】风物奇遇 · ${county.culturalLandmark.tag}`,
    intro: `你驻足于【${county.name}】（海拔 ${county.altitude}米）的苍茫天地之间。\n眼前是拔地而起的${county.naturalLandmark.name}（${county.naturalLandmark.tag}），脚下展现着${county.terrainType}的雄浑地势。\n\n长风掠过，空气中飘散着${county.ethnicFeatures.specialty}的气息与古迹的历史厚重感。\n古老的碑记石刻静立在风雪中，记载着：\n“${secretLore.slice(0, 120)}……”\n面对眼前的名山古刹与风土人情，你将如何抉择？`,
    choices: [
      {
        text: `【静心听山】闭目施展祁连秘术，探听${county.naturalLandmark.name}的古老脉动`,
        narrativeResult: `你深吸一口气，气沉丹田，施展【听山秘术】。\n\n刹那间，喧嚣的风沙退去，你听到了千百年前大地隆起的低吟、冰川破裂的奔流，以及在山岩深处沉睡的灵石回响。\n你的心境空明澄澈，神念大增，体力恢复了大半，并感召获赠了本县独一无二的至宝【${relicItem.name}】！`,
        statChange: {
          stamina: 35,
          temp: 3.0,
          itemReward: relicItem,
        },
      },
      {
        text: `【寻访非遗】请教当地长者研习【${firstCraft}】并求取信物`,
        narrativeResult: `长者见到你的虔诚，微笑着邀你围坐炉边。\n\n他一边演示着代代相传的精绝技艺，一边为你递来刚煮好的${firstSpecialty}。\n热气涌遍四肢百骸，周身寒气尽散！你不仅掌握了这项古老手艺的风骨，更获得了乡民赠予的珍品【${relicItem.name}】！`,
        statChange: {
          temp: 5.5,
          stamina: 30,
          itemReward: relicItem,
        },
      },
      {
        text: `【攀登揽胜】登临${county.naturalLandmark.name}最高处，俯瞰全县险峻山川`,
        narrativeResult: `你顶着高山猎猎风雪，一步步攀向崖岭之巅。\n\n站在这海拔 ${county.altitude} 米的制高点，极目远眺，整个${county.province}大地的雪岭、丹霞、大河与绿洲尽收眼底，胸中激荡起豪迈英雄气概！\n你的耐寒意志得到了极大淬炼，并在绝顶石缝间发现了【${relicItem.name}】！`,
        statChange: {
          stamina: -15,
          temp: -1.0,
          itemReward: relicItem,
        },
      },
    ],
  };
}

// Universal Level Generator for any of the 132 counties!
export function generateCountyLevel(county: CountyData): GeneratedCountyLevel {
  const profile = getCountyContent(county);
  const { npc, dialogues, secretLore, quest, relicItem } = generateCountyNPC(county);
  const specialtyItem = generateSpecialtyItem(county);
  const interactiveObjects = generateInteractiveObjects(county, profile.campfireName);
  const adventureStory = county.adventureStory || generateAdventureStory(county, relicItem, secretLore);

  const baseTempDrain =
    county.altitude > 4000 ? 0.25 : county.altitude > 3000 ? 0.16 : county.altitude > 2000 ? 0.09 : 0.05;

  const zoneConfig: ZoneConfig = {
    id: 'meadow',
    name: county.name,
    title: `${county.naturalLandmark.tag} · ${county.culturalLandmark.tag}`,
    altitude: county.altitude,
    baseTempDrain,
    weather: county.weather,
    description: `${county.terrainDescription} 眼前【${county.naturalLandmark.name}】与【${county.culturalLandmark.name}】遥相辉映。`,
    bgPalette: county.bgPalette,
    features: [
      county.naturalLandmark.name,
      county.culturalLandmark.name,
      county.ethnicFeatures.crafts,
      county.ethnicFeatures.specialty,
    ],
  };

  return {
    zoneConfig,
    npc,
    dialogues,
    interactiveObjects,
    specialtyItem,
    relicItem,
    adventureStory,
    countyQuest: quest,
    secretLore,
  };
}
