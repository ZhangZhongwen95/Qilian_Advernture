import { CountyData, Item, CountyQuest, AdventureChoice } from '../types';

export interface CountyContentProfile {
  npcName: string;
  npcTitle: string;
  npcIcon: string;
  npcGreeting: string;
  npcLore: string;
  questTitle: string;
  questObjective: string;
  relicName: string;
  relicIcon: string;
  relicDescription: string;
  relicEffect: { temp?: number; stamina?: number; resistColdSec?: number };
  secretLore: string;
  campfireName?: string;
  adventureChoices?: AdventureChoice[];
}

// Handcrafted authentic bespoke content profiles for iconic regions
export const BESPOKE_COUNTY_PROFILES: Record<string, CountyContentProfile> = {
  // === 甘肃省重点与特色县区 ===
  sunan: {
    npcName: '安达阿爷',
    npcTitle: '祁连裕固族老牧人 · 天鹅琴非遗传人',
    npcIcon: '👴',
    npcGreeting: '萨拉姆！远方踏雪而来的贵客，欢迎来到我们肃南裕固草原！听那长风呼啸，天鹅琴音正伴着七一冰川的寒风，愿长生天护佑你安康！',
    npcLore: '肃南是全国唯一的裕固族自治县。天鹅琴（独木雕刻的传统拉弦乐器）鸣响处，牧民身着高耸尖顶毡帽，在祁连雪线牧放牦牛与绵羊。',
    questTitle: '【肃南风物考】琴音伴风巡冰川',
    questObjective: '在七一冰川脚下聆听天鹅琴曲，采撷高山雪莲与羊肉干，向神山圣坛虔诚祈福',
    relicName: '裕固族 · 天鹅琴角骨拨片',
    relicIcon: '🦢',
    relicDescription: '取祁连高山野羚角精雕的天鹅琴拨片，轻扣琴弦如天鹅振翅，蕴含祁连山风雪的灵性。',
    relicEffect: { temp: 3.5, stamina: 40, resistColdSec: 90 },
    secretLore: '传说裕固族先民自极北黄头回鹘迁徙而来，循着神天鹅的指引越过风雪天山，最终停留在水草丰美的祁连山怀抱中。',
    campfireName: '裕固黑牛毛帐篷红柳火塘',
  },
  dunhuang: {
    npcName: '常先生',
    npcTitle: '敦煌研究院莫高窟九层楼守窟学者',
    npcIcon: '📜',
    npcGreeting: '一别长安三千里，风沙吹老玉门关！鸣沙山下，月牙泉畔，七百三十五座佛窟洞府在漫天黄沙中守望了一千六百五十年。',
    npcLore: '从前秦建元二年乐僔和尚西至三危山见金光千佛开窟，到唐宋飞天彩塑，莫高窟是古代丝绸之路多文明交流互鉴的至高殿堂。',
    questTitle: '【莫高千佛纪】寻访三危金光古壁',
    questObjective: '瞻仰莫高窟古碑记，在鸣沙山风沙中施展听山秘术摹拓飞天壁画彩痕',
    relicName: '莫高窟 · 盛唐飞天丹青拓本',
    relicIcon: '🎨',
    relicDescription: '以千年青金石与朱砂矿物颜料原液临摹的飞天舞乐残卷，展开时犹闻九天仙乐与沙漠梵呗。',
    relicEffect: { temp: 2.0, stamina: 50, resistColdSec: 120 },
    secretLore: '莫高窟第17窟（藏经洞）于清光绪年间被偶然开启，内藏公元4世纪至11世纪的经卷文书五万余件，震动全球学术界。',
    campfireName: '鸣沙泉畔红柳柴薪守夜火',
  },
  jiayuguan: {
    npcName: '赵校尉',
    npcTitle: '天下第一雄关 · 明代长城守关长史',
    npcIcon: '🛡️',
    npcGreeting: '出此黑山峡口与嘉峪关门，西面便是八百里瀚海流沙！佩刀紧束，备足干粮，大漠长河的烽火守望着你的身影！',
    npcLore: '嘉峪关始建于明洪武五年，是明长城最西端的重关要塞。关城由内城、外城、城壕三道防线组成，锁钥甘凉，雄视戈壁。',
    questTitle: '【雄关锁钥考】定城砖与塞外烽燧',
    questObjective: '登上天下第一雄关古楼，查验西瓮城后楼的定城砖传说，饮一碗雄关羊肉汤御寒',
    relicName: '天下第一雄关 · 戍边青铜号角',
    relicIcon: '🎺',
    relicDescription: '明代戍边将士在嘉峪关城楼上传递军情、警戒胡尘的厚重青铜号角，吹响声震十里戈壁。',
    relicEffect: { temp: 4.0, stamina: 45, resistColdSec: 80 },
    secretLore: '传说当年建关大师傅工匠易开占精于计算，完工后整座关城只多出一块青砖，安放于西瓮城门楼后檐台，至今仍被称为“定城神砖”。',
    campfireName: '长城第一墩戍卒防风地炉',
  },
  chengguan_lz: {
    npcName: '彭总工',
    npcTitle: '金城黄河第一铁桥（中山桥）修造总督工后代',
    npcIcon: '🌉',
    npcGreeting: '九曲黄河万里沙，奔流到海穿金城！白塔倒映浊浪中，天下黄河第一铁桥百余年巍然屹立，尝一碗滚烫的兰州牛肉面再上路！',
    npcLore: '兰州古称金城，取“金城汤池”之意。中山桥于1909年建成，所有钢材远渡重洋、走骡马大车历时年余运抵兰州，开创黄河造桥奇迹。',
    questTitle: '【金城黄河志】白塔远眺第一铁桥',
    questObjective: '踏上中山铁桥俯瞰滔滔黄河水，在白塔山脚品尝地道兰州牛肉拉面',
    relicName: '兰州铁桥 · 宣统光绪古铆钉',
    relicIcon: '⚙️',
    relicDescription: '中山桥百年前由德商泰来洋行原配特种高韧锻铁铆钉，经受了百年黄河洪峰冰凌冲击而坚硬如故。',
    relicEffect: { temp: 3.0, stamina: 40, resistColdSec: 60 },
    secretLore: '在铁桥建成前，兰州全靠明初大将军宋国公冯胜创立的“镇远桥”（24只木船浮桥，冬拆夏架），冬天全靠河上封冻厚冰强渡。',
    campfireName: '金城码头老茶摊羊皮暖炉',
  },
  qilihe: {
    npcName: '魏大娘',
    npcTitle: '石佛沟南山九叶三瓣兰州百合种植宿老',
    npcIcon: '👵',
    npcGreeting: '欢迎进阿干古镇暖和！咱们七里河南山的红黏土，种出的百合生吃甜如生梨，九年采收，每一瓣都是润肺回春的宝贝！',
    npcLore: '兰州百合是全国唯一可以生吃的甜百合，生长期长达六年到九年。石佛沟与阿干镇峡谷林茂水清，宋代还是著名的陶瓷重镇。',
    questTitle: '【南山百合缘】石佛沟古刹寻幽',
    questObjective: '探访石佛沟原始森林峡谷，采集九年生的七里河雪白甜百合',
    relicName: '七里河 · 九年甜百合玉瓣',
    relicIcon: '🌱',
    relicDescription: '采自阿干高山红土冷凉地块的九年生百合，洁白如玉，肉质丰厚，入口甘甜生津。',
    relicEffect: { temp: 2.5, stamina: 45, resistColdSec: 70 },
    secretLore: '百合在清同治年间由七里河黄峪沟农人杨万贵引种成功，光绪年间被列为宫廷贡品，慈禧太后食后赞其“洁白如玉，味甜纯正”。',
    campfireName: '石佛沟松枝木炭火塘',
  },
  huining: {
    npcName: '任老兵',
    npcTitle: '红军长征三大主力会宁会师纪念馆老长者',
    npcIcon: '🎖️',
    npcGreeting: '红军不怕远征难，万水千山只等闲！1936年10月，红一、二、四方面军在这会宁城胜利会师，奠定了中国革命的基石！',
    npcLore: '会宁城自古是陇东锁钥，红军三军在此会合，会师楼、会师塔耸立城中。会宁人崇文重教，被称为“西北高考状元县”。',
    questTitle: '【会师峥嵘岁月】登临会师楼瞻仰纪念塔',
    questObjective: '走过古城会师门，向红军会师纪念塔敬礼献花，品尝会宁小杂粮面锅盔',
    relicName: '会宁 · 红军长征草鞋纪念章',
    relicIcon: '🎖️',
    relicDescription: '以陇东黄土与红军老战士行军草鞋纤维精压成型的纪念徽章，佩之于胸让人热血沸腾、不知疲倦。',
    relicEffect: { temp: 4.5, stamina: 60, resistColdSec: 100 },
    secretLore: '长征途中，红军战士在会宁军民支持下，用木板和绳索迅速架起通义桥，数万大军在此紧紧拥抱，泪水洗尽二万五千里风尘。',
    campfireName: '会师故城红泥老暖炉',
  },
  jingtai: {
    npcName: '老周',
    npcTitle: '黄河石林大峡谷老羊皮筏子水手',
    npcIcon: '🚣',
    npcGreeting: '嗨嗬！天下黄河九十九道弯，伐子客敢闯龙王滩！十四具充气整羊皮扎成一架筏子，稳稳漂过两岸如刀削斧劈的石林峡谷！',
    npcLore: '景泰黄河石林形成于四百万年前的新生代晚期，巨型黄褐色砂砾岩峰林拔地数百米。羊皮筏子是古代黄河两岸最传奇的渡水工具。',
    questTitle: '【石林饮马图】乘羊皮筏破九曲黄河',
    questObjective: '穿越黄河石林神龙谷，乘坐老羊皮筏子横渡狂涛，品尝景泰枸杞与黑活鱼',
    relicName: '景泰 · 羊皮筏子古水手橹',
    relicIcon: '🪵',
    relicDescription: '浸润了黄河泥沙与羊皮油光的硬木长橹，手握之可稳住激流中的身形，不惧险滩惊涛。',
    relicEffect: { temp: 3.0, stamina: 45, resistColdSec: 75 },
    secretLore: '景泰县的龟城（永泰古城）建于明万历三十六年，城围呈独特的椭圆龟形，瓮城、烽燧、水池完整，如一只横卧戈壁的千年神龟。',
    campfireName: '黄河石林滩头胡杨木柴火',
  },
  qinzhou: {
    npcName: '成道长',
    npcTitle: '天水卦台山伏羲太极古坛司祝',
    npcIcon: '☯️',
    npcGreeting: '一画开天，文明肇启！天水古称成纪，乃三皇之首太昊伏羲氏诞生地。渭水绕卦台如天然太极，龙马负图而出！',
    npcLore: '天水是华夏文明的重要发祥地。伏羲庙是全国规模最大的明代伏羲祭祀建筑群，柏林苍郁，太极八卦文化源远流长。',
    questTitle: '【羲皇肇始纪】朝觐天水伏羲庙古柏',
    questObjective: '步入伏羲大庙先天下之忧敬上一炷香，在卦台山感悟阴阳八卦天地大道',
    relicName: '成纪伏羲 · 易经先天八卦镜',
    relicIcon: '🪞',
    relicDescription: '依照伏羲六十四卦天干地支铭刻的青铜宝镜，照见四方虚实，驱散阴霾严寒。',
    relicEffect: { temp: 4.0, stamina: 50, resistColdSec: 100 },
    secretLore: '伏羲庙大殿天花板绘有六十四卦和河图洛书彩绘，为明代原物，历经数百年地震风雨仍色泽鲜润，神光内敛。',
    campfireName: '伏羲古坛松柏香火铜鼎',
  },
  maiji: {
    npcName: '文先生',
    npcTitle: '麦积山石窟绝壁泥塑古建修复大师',
    npcIcon: '🗿',
    npcGreeting: '你看这麦积山高耸如麦垛，绝壁悬空栈道凌云霄！窟内两百余洞窟中，那些北魏至唐宋的泥塑佛像，嘴角那一抹微笑被誉为【东方的微笑】！',
    npcLore: '麦积山石窟始建于十六国后秦，以精美绝伦的泥塑艺术闻名于世，与敦煌、云冈、龙门并称中国四大石窟，更以独特的栈道飞架绝壁著称。',
    questTitle: '【麦积烟雨行】攀爬凌空千尺栈道',
    questObjective: '手攀麦积山悬崖绝壁栈道，瞻仰第133窟小沙弥微笑泥塑',
    relicName: '麦积山 · 东方微笑陶泥微雕',
    relicIcon: '🪨',
    relicDescription: '麦积山特种红土掺和麦秸与香料古法秘制的微型佛颜泥塑，神情宁静安详，视之令人心无挂碍。',
    relicEffect: { temp: 3.5, stamina: 50, resistColdSec: 90 },
    secretLore: '天水民谚云：“砍完南山柴，修起麦积崖。”可见当年在绝壁上搭建千百间悬空楼阁与栈道耗费的巨量木材与工匠心血。',
    campfireName: '麦积烟雨崖下暖茶柴炉',
  },
  liangzhou: {
    npcName: '贾馆长',
    npcTitle: '凉州雷台汉墓与中国旅游标志【马踏飞燕】研究长者',
    npcIcon: '🐎',
    npcGreeting: '南朝凉州大马，横行天下！武威自古为河西都会，马踏飞燕从雷台汉墓凌空飞出，一足掠过疾风之鸟，那是大汉雄风的绝顶写照！',
    npcLore: '汉武帝元狩二年骠骑将军霍去病收复河西，置武威郡以“彰显大汉武功军威”。鸠摩罗什在此译经十七载，凉州词名扬天下。',
    questTitle: '【天马行空纪】雷台寻访马踏飞燕神骏',
    questObjective: '探寻雷台汉墓古地下地宫，在鸠摩罗什舌舍利塔下倾听西域梵音',
    relicName: '武威 · 马踏飞燕青铜金印',
    relicIcon: '🐴',
    relicDescription: '东汉铜奔马的等比微缩青铜符印，三足腾空、飞鸟回顾，佩戴者行路健步如飞。',
    relicEffect: { temp: 3.0, stamina: 60, resistColdSec: 80 },
    secretLore: '后凉高僧鸠摩罗什圆寂前发誓：“若所译经典无误，焚身之后，唯舌不烂。”果然火化后肉身成灰，舌根宛如红莲，今留存武威寺塔中。',
    campfireName: '凉州官道驿站枣木红炭炉',
  },
  minqin: {
    npcName: '石老伯',
    npcTitle: '青土湖与巴丹吉林沙漠压沙防风林带治沙愚公',
    npcIcon: '🌲',
    npcGreeting: '绝不能让民勤成为第二个罗布泊！巴丹吉林和腾格里两座大沙漠像两只狼，想把民勤夹在当中吃掉。我们三代人插麦草方格，硬是把青土湖救活了！',
    npcLore: '民勤三面环沙，地处石羊河下游末端。曾干涸半个世纪的青土湖如今形成二十余平方公里水面与绿洲，是人类防沙治沙的奇迹。',
    questTitle: '【荒漠锁沙纪】扎下百丈麦草方格',
    questObjective: '在沙漠前沿扎下一排麦草方格固沙，采摘一捧金黄甘甜的民勤蜜瓜',
    relicName: '民勤 · 沙生梭梭玉雕枝',
    relicIcon: '🌿',
    relicDescription: '采自沙漠深处百年梭梭老根雕刻的护身枝，根系深扎地下数十米，象征坚韧不屈的生命力。',
    relicEffect: { temp: 2.0, stamina: 40, resistColdSec: 120 },
    secretLore: '民勤古称三危、三里城，也是苏武牧羊十九年的历史传说地之一。沙漠深处的瑞安堡是保存完好的民国大地主坞堡防御要塞。',
    campfireName: '沙漠压沙人防风红柳堆火',
  },
  ganzhou: {
    npcName: '释法真',
    npcTitle: '张掖大佛寺旃檀大佛守刹老僧',
    npcIcon: '🙏',
    npcGreeting: '阿弥陀佛！张掖乃“张国臂掖，以通西域”之金张掖。大佛寺内卧佛身长三十四米，为亚洲最大的室内木胎泥塑卧佛！',
    npcLore: '西夏国寺（张掖大佛寺）建于西夏永安元年，相传元世祖忽必烈便诞生于此。寺内藏有明英宗钦赐的六千卷金银字大藏经，举世罕见。',
    questTitle: '【甘州佛影抄】参谒大佛寺卧佛金光',
    questObjective: '在大佛殿内缓步绕佛经行，感悟西夏壁画与泥塑的沉静庄严',
    relicName: '张掖大佛寺 · 琉璃鸱吻残片',
    relicIcon: '✨',
    relicDescription: '西夏皇家大殿屋脊上的孔雀蓝琉璃古瓦残片，历经风雨仍透出幽蓝光华，清心定神。',
    relicEffect: { temp: 2.5, stamina: 45, resistColdSec: 90 },
    secretLore: '大佛寺卧佛腹部内藏有一个隐秘的三层空腔木阁，当年发掘时在内部发现了大量西夏波罗蜜多心经写本与精美丝织金锦。',
    campfireName: '大佛寺钟楼下老香炉火',
  },
  linze: {
    npcName: '红石翁',
    npcTitle: '张掖七彩丹霞国家地质公园守望地质师',
    npcIcon: '🌄',
    npcGreeting: '你看这片群山，色如渥丹，灿若明霞！这不是凡间的调色盘，而是一亿多年前白垩纪湖相红色砂砾岩在阳光下的天地奇观！',
    npcLore: '临泽七彩丹霞以色彩交错、层理分明著称。雨后初晴，红、黄、橙、绿、青灰条带在夕阳斜照下如巨幅锦缎铺展天地间。',
    questTitle: '【色如渥丹考】七彩屏前临摹彩带地貌',
    questObjective: '登上刀山火海观景台俯瞰七彩屏，品尝临泽红枣与小枣原汁',
    relicName: '临泽 · 七彩丹霞玛瑙纹石',
    relicIcon: '🪨',
    relicDescription: '在丹霞崖缝中拾得的七彩层理玛瑙石，截面红黄绿紫层层叠叠，如同将落日晚霞凝固在掌中。',
    relicEffect: { temp: 4.5, stamina: 35, resistColdSec: 60 },
    secretLore: '临泽小枣栽植历史超过两千余年，肉厚核小、甘甜如蜜，自汉唐以来便是古丝绸之路商队必备的能量干粮。',
    campfireName: '丹霞赤壁风干枣木篝火',
  },
  shandan: {
    npcName: '霍掌柜',
    npcTitle: '山丹军马场皇家牧马骠骑传人',
    npcIcon: '🐎',
    npcGreeting: '山丹马场是两千一百年前霍去病将军始建的世界上历史最悠久的皇家军马场！祁连雪峰下的大草原，奔驰着数十代军马的铁蹄！',
    npcLore: '山丹地处河西走廊咽喉，冷龙岭与大黄山夹峙。汉武帝在此设立军马监，繁育山丹马，为大汉骑兵远征大漠提供战马供应。',
    questTitle: '【骠骑纵马篇】山丹万亩草原驰骋',
    questObjective: '在山丹军马场策马奔腾三里，登临焉支山峰顶远眺大黄山奇观',
    relicName: '山丹军马场 · 汉代双耳铜马蹬',
    relicIcon: '🐎',
    relicDescription: '西汉大将霍去病收复山丹草场时军马所配青铜马镫拓样，系于腰带让人策马如风、步履轻盈。',
    relicEffect: { temp: 3.5, stamina: 60, resistColdSec: 90 },
    secretLore: '汉武帝时期匈奴失去祁连山与焉支山后曾作哀歌：“亡我祁连山，使我六畜不蕃息；失我焉支山，使我嫁妇无颜色。”',
    campfireName: '大马场草甸牧人牛粪取暖堆',
  },
  diebu: {
    npcName: '才旺',
    npcTitle: '扎尕那石匣仙境老藏向导',
    npcIcon: '🏔️',
    npcGreeting: '扎西德勒！这里是迭部扎尕那，“扎尕那”藏语意为石匣子。灰白的万仞巨石山如同一座天然的城墙，把我们藏寨紧紧抱在怀里！',
    npcLore: '美籍奥地利探险家约瑟夫·洛克在迭部扎尕那考察时曾赞叹：“我平生未见如此绮丽的景色，如果《创世纪》的作者曾看见迭部，定会把这里作为伊甸园。”',
    questTitle: '【石匣仙境探】穿越扎尕那天然石城',
    questObjective: '走入仙女滩高山草甸，登上扎尕那最高石林观景台，探查红军突破天险腊子口遗迹',
    relicName: '扎尕那 · 白石神峰天然石胆',
    relicIcon: '💎',
    relicDescription: '从扎尕那天然石城崩落的极寒结晶灵石，触之冰凉但置于胸前能护住周身阳气。',
    relicEffect: { temp: 4.0, stamina: 55, resistColdSec: 100 },
    secretLore: '红军长征途中著名的腊子口战役就在迭部境内打响，战士们借一根长绳攀上百米绝壁，手榴弹如冰雹般砸向敌堡，打开了北上通途。',
    campfireName: '扎尕那藏式踏板房青稞火塘',
  },
  xiahe: {
    npcName: '更登加措',
    npcTitle: '拉卜楞寺大经堂辩经法师',
    npcIcon: '📿',
    npcGreeting: '扎西德勒！欢迎来到世界藏学府拉卜楞寺。听那转经廊三公里木筒的转动声，六大学院的辩经声正传遍桑科大草原！',
    npcLore: '拉卜楞寺始建于清康熙年间，是格鲁派六大宗主寺之一，拥有世界上最长的转经筒长廊（二千余个转经筒）。寺内酥油花工艺精巧绝伦。',
    questTitle: '【转经万回福】转动拉卜楞三里经筒',
    questObjective: '顺时针走过拉卜楞寺转经长廊，在白石崖溶洞探寻古人类丹尼索瓦人骨化石遗迹',
    relicName: '夏河拉卜楞 · 酥油花精雕金印',
    relicIcon: '🪷',
    relicDescription: '以高原纯酥油与矿物矿彩依古法微雕的金莲花护身灵符，散发淡淡奶香，护持身心安宁。',
    relicEffect: { temp: 4.5, stamina: 40, resistColdSec: 120 },
    secretLore: '夏河白石崖溶洞出土了距今十六万年的丹尼索瓦人下颌骨化石，证实古老人类早在十六万年前就已经适应了青藏高原的高寒低氧环境。',
    campfireName: '桑科草原铜炉酥油柴火',
  },

  // === 青海省重点与特色县区 ===
  chengdong_xn: {
    npcName: '马掌柜',
    npcTitle: '东关清真大寺古茶坊老掌柜',
    npcIcon: '🍵',
    npcGreeting: '塞俩目！欢迎来到西宁东关！尝一口刚出锅的热乎羊肉抓面，再来一盅熬得滚烫的三泡台八宝盖碗茶，暖暖赶路的身子骨！',
    npcLore: '西宁城东区是青海开埠最早的城区之一，东关清真大寺始建于明洪武年间，大殿气势恢宏，回汉商贸集市自古繁盛。',
    questTitle: '【金城东关录】品三泡台听花儿清唱',
    questObjective: '探访东关清真大寺古朴宫殿建筑，饮一碗甘甜清凉的西宁老酸奶',
    relicName: '西宁 · 东关紫铜盖碗茶盅',
    relicIcon: '🍵',
    relicDescription: '老字号铜匠手工錾刻的紫铜八宝盖碗，注入沸水则冰糖化香，能使人体温久久不散。',
    relicEffect: { temp: 3.5, stamina: 45, resistColdSec: 70 },
    secretLore: '东关大寺在历史上多次扩建，融合了中国传统的重檐飞檐宫殿形制与伊斯兰砖雕圆顶艺术，是多民族文化共生交融的历史见证。',
    campfireName: '东关茶摊煨红茶老炭炉',
  },
  huzhu: {
    npcName: '索南花姑',
    npcTitle: '彩虹之乡土族七彩盘绣非遗传人',
    npcIcon: '👧',
    npcGreeting: '啊拉！来到我们互助彩虹之乡，快看这七彩花袖与高耸的轮子秋！喝一口浓烈的青稞酩馏酒，连高山风雪都化作了春泥！',
    npcLore: '互助是全国唯一的土族自治县。土族妇女身穿红黄绿蓝紫七彩花袖衣，如彩虹披身。国家级非遗【土族盘绣】一针两线，密如珠玑，极为精细。',
    questTitle: '【彩虹织锦纪】学盘绣体验飞旋轮子秋',
    questObjective: '向盘绣阿姑求取一枚太阳花盘绣荷包，在互助北山林海高山瀑布前驻足聆听',
    relicName: '互助土族 · 七彩盘绣太阳花荷包',
    relicIcon: '🧶',
    relicDescription: '用七彩丝线以“一针两线、盘旋密缝”古法刺绣的太阳花荷包，装有青稞酩馏酒糟，贴胸温暖无比。',
    relicEffect: { temp: 5.0, stamina: 40, resistColdSec: 90 },
    secretLore: '轮子秋相传起源于土族先民辗麦农耕时把大车轮卸下、竖起旋转玩乐的竞技活动，如今已成为土族人民展现力量与欢庆丰收的代表项目。',
    campfireName: '彩虹部落土家火塘煮青稞酒',
  },
  xunhua: {
    npcName: '韩把头',
    npcTitle: '循化撒拉族骆驼泉古商队驼把头',
    npcIcon: '👳',
    npcGreeting: '欢迎来到白驼泉与孟达天池的故乡！尝尝我们清甜的核桃与火辣纯香的循化红线椒，保你周身血脉通泰，体温回升！',
    npcLore: '撒拉族先民牵引白骆驼自中亚撒马尔罕东迁，见循化街子泉池清甜遂定居于此。循化红线椒肉厚油多、辣而不燥，名冠华夏。',
    questTitle: '【白驼神泉记】孟达天池与红线椒之乡',
    questObjective: '拜谒街子清真寺骆驼泉遗址，探寻青藏高原西双版纳孟达天池翡翠仙境',
    relicName: '循化 · 白驼泉青白玉镇尺',
    relicIcon: '🐫',
    relicDescription: '以骆驼泉边润泽白玉精雕的卧驼小件，象征穿越戈壁雪山、百折不回的开拓毅力。',
    relicEffect: { temp: 4.5, stamina: 50, resistColdSec: 85 },
    secretLore: '街子清真大寺珍藏有一部相传为撒拉族先民从中亚带来的手抄本《古兰经》，距今已有千余年历史，为国家一级文物。',
    campfireName: '积石峡畔红线椒油爆柴火',
  },
  menyuan: {
    npcName: '马阿爷',
    npcTitle: '百里油菜花海金川老养蜂人',
    npcIcon: '🐝',
    npcGreeting: '盛夏七月来门源，六十万亩油菜花从浩门河谷一直铺到祁连岗什卡雪峰脚下！万顷金黄映着千年白雪，蜜蜂采的百花蜜甜透心窝！',
    npcLore: '门源盆地气候冷凉湿润，盛产优质油菜。盛花期数十万亩油菜花如金色海洋，与巍峨雪山冷龙岭相互辉映，构成天下罕有的奇幻画卷。',
    questTitle: '【雪映金花赋】岗什卡雪峰俯瞰金川',
    questObjective: '登上圆山观花台饱览百里金花，采集一瓶纯正高山油菜雪蜜',
    relicName: '门源 · 岗什卡冰川高山雪蜜',
    relicIcon: '🍯',
    relicDescription: '由雪峰脚下纯净油菜花采酿的极稠高山蜜，含入口中清香化甘，能瞬间补充大量体力并抵御低血糖。',
    relicEffect: { temp: 3.5, stamina: 70, resistColdSec: 60 },
    secretLore: '岗什卡雪峰海拔5254米，峰顶常年白雪皑皑，银光闪烁，宛如一条玉龙横卧天际，是祁连山东段最高峰。',
    campfireName: '浩门河畔蜂箱旁松枝火',
  },
  qilian: {
    npcName: '才让',
    npcTitle: '东方小瑞士阿咪东索神山护山队长',
    npcIcon: '🏔️',
    npcGreeting: '扎西德勒！祁连在匈奴语中就是“天山”的意思。阿咪东索神山脚下，卓尔山赤壁与牛心山雪峰日夜相对，黑河自我们这里发源流向河西走廊！',
    npcLore: '祁连县被誉为“天境祁连”、“东方小瑞士”。卓尔山丹霞与万亩油菜花、青海云杉林、草原峡谷交相辉映，是祁连山国家公园核心区。',
    questTitle: '【天境祁连赋】登卓尔山瞻仰牛心山',
    questObjective: '攀登卓尔山观景台敲响和平祈福钟，在八宝河畔采集祁连黄玉原石',
    relicName: '祁连 · 阿咪东索神山美玉石',
    relicIcon: '💎',
    relicDescription: '自祁连山黑河河床淘洗出的祁连美玉，质地温润细腻，蕴含祁连山水源之灵。',
    relicEffect: { temp: 3.5, stamina: 50, resistColdSec: 100 },
    secretLore: '祁连山草原被评为中国最美六大草原之一，夏秋季节“大雪压青稞，冰雹打草场”的气候瞬息万变，却孕育出极优质的高山牧草。',
    campfireName: '卓尔山脚杉木烤肉暖炉',
  },
  tongren: {
    npcName: '更登大师',
    npcTitle: '热贡艺术唐卡绘制国家级非遗宗师',
    npcIcon: '🎨',
    npcGreeting: '扎西德勒！隆务河谷是我们热贡唐卡的故乡。每一幅唐卡都需要数月甚至数年，用纯金粉与天然矿物颜料点染，千年不变色！',
    npcLore: '黄南同仁是“热贡艺术”的发祥地（联合国教科文组织人类非遗），包括唐卡、壁画、堆绣、泥塑，风格精细绚丽，举世瞩目。',
    questTitle: '【热贡丹青卷】隆务大寺悟佛造化',
    questObjective: '拜访热贡吾屯下寺唐卡画院，亲手研磨孔雀石与朱砂矿物颜料',
    relicName: '热贡 · 泥金宝生佛唐卡微轴',
    relicIcon: '📜',
    relicDescription: '以真金细线勾勒轮廓的热贡唐卡微轴，线条如发丝游走，观之神智空明，防邪避寒。',
    relicEffect: { temp: 4.0, stamina: 45, resistColdSec: 90 },
    secretLore: '同仁热贡地区“家家有画室，人人精丹青”，许多家族几代人传承画笔，将藏族传统工笔与中原重彩艺术融合至化境。',
    campfireName: '吾屯画院松香暖炉',
  },
  wulan: {
    npcName: '莫师傅',
    npcTitle: '茶卡盐湖百年纯白采盐船老大',
    npcIcon: '⛵',
    npcGreeting: '欢迎来到天空之镜茶卡盐湖！这片三千平方公里的天然结晶盐海，倒映着蓝天白云，光着脚踩在水面上，就如同漫步在天际！',
    npcLore: '茶卡盐湖已有三千多年开采历史，储量极其丰富。结晶晶体洁白如雪，水面极浅平整，形成无与伦比的天然倒影“天空之镜”。',
    questTitle: '【天空之镜引】漫步茶卡纯白盐海',
    questObjective: '乘百年小铁轨盐车驶入湖心，采集茶卡天然大青盐晶体结晶',
    relicName: '茶卡 · 天空之镜大青盐晶宝',
    relicIcon: '🧂',
    relicDescription: '在茶卡极纯卤水中天然析出的六面体大青盐晶石，澄澈透明如钻石，含少许于口可提神解乏。',
    relicEffect: { temp: 3.0, stamina: 60, resistColdSec: 80 },
    secretLore: '茶卡盐湖不仅是风景奇观，更出产青海特有的食用大青盐，富含微量元素，古代便经由丝绸之路和茶马古道行销全国。',
    campfireName: '盐湖铁道旁防风汽灯地炉',
  },
  madoi: {
    npcName: '索南达杰后辈',
    npcTitle: '黄河源头两湖一碑巡源守护使',
    npcIcon: '🌊',
    npcGreeting: '扎西德勒！玛多在藏语中是“黄河源头”之意。这里海拔四千三百米，千湖泊散落草原，鄂陵湖与扎陵湖如两颗蓝宝石守护着中华母亲河的发端！',
    npcLore: '玛多县拥有数千个大小湖泊，被称为“千湖之县”。黄河源头纪念铜牛头碑巍峨耸立在措日尕则山顶，俯瞰两湖万顷碧波。',
    questTitle: '【河源千湖引】登牛头碑祭拜黄河源',
    questObjective: '登上海拔4610米牛头碑俯瞰扎陵湖与鄂陵湖，在极高寒中挺立施展听山术',
    relicName: '黄河源 · 牛头碑汉藏铜令符',
    relicIcon: '🦬',
    relicDescription: '黄河源头牛头铜碑微缩铸造符印，背面铭刻胡耀邦题词“黄河源头”，蕴含万里长河浩然气魄。',
    relicEffect: { temp: 5.0, stamina: 60, resistColdSec: 150 },
    secretLore: '扎陵湖意为“白色的长湖”，鄂陵湖意为“蓝色的亮湖”，两湖并蒂相连，如同两只巨大的明眸凝视着三江源大地的万古苍茫。',
    campfireName: '措日尕则山脚牦牛粪石块火塘',
  },
  yushu_city: {
    npcName: '嘉那阿爷',
    npcTitle: '新寨嘉那玛尼石堆三百年石刻老艺人',
    npcIcon: '🪨',
    npcGreeting: '扎西德勒！结古新寨的嘉那玛尼石堆，已有三十亿块六字真言嘛呢石！每一块石头都是信众与石匠一锤一凿刻下的祈愿与慈悲！',
    npcLore: '玉树新寨玛尼堆是世界上最大的玛尼石堆，历经三百余年积累。玉树还是唐蕃古道文成公主进藏的关键节点，康巴文化底蕴深厚。',
    questTitle: '【嘉那嘛呢福】顺时针绕行三十亿玛尼石堆',
    questObjective: '绕行新寨嘉那玛尼石堆三周，在文成公主庙石崖前瞻仰千年唐蕃摩崖造像',
    relicName: '玉树 · 嘉那玛尼红砂岩祈福石',
    relicIcon: '🪨',
    relicDescription: '老石匠用红砂岩手工錾刻的六字大明咒小石板，字口填金，佩之可避风雪凶煞，身心安和。',
    relicEffect: { temp: 4.5, stamina: 50, resistColdSec: 110 },
    secretLore: '文成公主当年进藏路过玉树贝纳沟，在此驻留逾月，教当地藏民耕种纺织并开凿摩崖大佛，如今文成公主庙香火千载不绝。',
    campfireName: '结古镇铜壶酥油炭火',
  },
  zhiduo: {
    npcName: '扎多队长',
    npcTitle: '可可西里索南达杰自然保护站巡护卫士',
    npcIcon: '🦌',
    npcGreeting: '可可西里！这是万山之祖昆仑山下的无人区，高原精灵藏羚羊的生命摇篮！当年索南达杰用生命保护羚羊，今天我们要守住这片纯洁的净土！',
    npcLore: '治多县地域辽阔，素有“万里长江第一县”之称，境内可可西里国家级自然保护区是世界自然遗产，每年六七月数万只藏羚羊在此产羔迁徙。',
    questTitle: '【守护藏羚羊】昆仑山下巡护无人区',
    questObjective: '穿越风火山与不冻泉，在索南达杰纪念碑前致敬巡山烈士，救助受伤的藏羚羊幼崽',
    relicName: '可可西里 · 巡山队防风铜哨',
    relicIcon: '📯',
    relicDescription: '可可西里野牦牛巡山队老队员传承的黄铜哨子，吹之能穿透狂风暴雪呼唤队友，镇定心神。',
    relicEffect: { temp: 5.0, stamina: 65, resistColdSec: 160 },
    secretLore: '治多是英雄杰桑·索南达杰的故乡。正是因为巡山队员们多年风雪无悔的持枪巡护，盗猎绝迹，藏羚羊种群从当年的不足两万只恢复到了七万只以上。',
    campfireName: '索南达杰保护站铁皮火炉',
  },
  geermu: {
    npcName: '老张工',
    npcTitle: '青藏铁路与青藏公路格尔木昆仑山口筑路老功臣',
    npcIcon: '🚂',
    npcGreeting: '当年慕生忠将军率两千军民，用铁锹和十字镐硬是在冻土戈壁上开辟出青藏公路！格尔木从昔日荒原帐篷变成了瀚海明珠！',
    npcLore: '格尔木是昆仑山下著名的兵城与交通枢纽，察尔汗盐湖万丈盐桥贯通湖面，青藏铁路在此翻越昆仑山口与唐古拉山口开往拉萨。',
    questTitle: '【巍巍昆仑纪】翻越昆仑山口眺望玉珠峰',
    questObjective: '登上昆仑山口四千七百米碑台，在察尔汗盐湖万丈盐桥上见证盐化工奇迹',
    relicName: '昆仑山 · 昆仑青玉护身璧',
    relicIcon: '🟢',
    relicDescription: '采自昆仑山玉矿脉的天然青玉小璧，玉质细腻油润，万山之祖的浩然之气护持体温不受寒侵。',
    relicEffect: { temp: 4.0, stamina: 55, resistColdSec: 100 },
    secretLore: '察尔汗盐湖是中国最大的可溶性钾镁盐矿床，面积达五千八百平方公里，青藏铁路与公路有一段著名的三十二公里路基直接铺在天然盐盖上，称为“万丈盐桥”。',
    campfireName: '昆仑驿站防风煤油柴炉',
  },
  mangya: {
    npcName: '王工',
    npcTitle: '柴达木盆地艾肯泉与翡翠湖地质探矿队长',
    npcIcon: '👁️',
    npcGreeting: '欢迎来到茫崖！这是青海最西端的戈壁明珠。艾肯泉喷涌硫磺泉水，被称为“大地恶魔之眼”；翡翠湖则碧绿如万顷碎玉，如同外星表面！',
    npcLore: '茫崖地处阿尔金山与祁漫塔格山之间，拥有雅丹地貌群、千佛崖、艾肯泉与茫崖翡翠湖等震撼地质奇观，是我国著名的石棉、石油与盐矿基地。',
    questTitle: '【恶魔之眼奇观】探查艾肯泉硫磺热泉',
    questObjective: '靠近茫崖艾肯泉俯瞰红褐飞鸟环绕的热泉眼，在翡翠湖碧玉水畔提取卤水结晶',
    relicName: '茫崖 · 翡翠湖高纯石盐翠晶',
    relicIcon: '🟢',
    relicDescription: '在茫崖翡翠湖翠绿盐水深处凝结的半透明含铜结晶，散发幽幽翠光，质如美玉。',
    relicEffect: { temp: 4.0, stamina: 50, resistColdSec: 90 },
    secretLore: '艾肯泉泉眼直径达十余米，深不可测，常年喷涌含硫磺的高矿化度热泉，周围土壤被硫磺矿物沉淀染成鲜艳红黄色，从空中俯瞰如同一只巨大的神眼。',
    campfireName: '戈壁探矿队汽柴暖炉',
  },
};

// Procedural County Content Synthesizer
// For any county without an explicit bespoke profile, dynamically synthesize authentic,
// deeply accurate, non-generic county content matching its geography, landmarks, crafts, and culture!
export function getCountyContent(county: CountyData): CountyContentProfile {
  if (BESPOKE_COUNTY_PROFILES[county.id]) {
    return BESPOKE_COUNTY_PROFILES[county.id];
  }

  // Synthesize rich bespoke content based on county properties
  const isTibetan = county.ethnicGroup === '藏族';
  const isMongol = county.ethnicGroup === '蒙古族';
  const isHui = county.ethnicGroup === '回族';
  const isKazakh = county.ethnicGroup === '哈萨克族';

  let defaultName = `${county.name}老向导`;
  let defaultTitle = `${county.culturalLandmark.tag}守望者 · 风物考证学者`;
  let defaultIcon = '📜';
  let defaultGreeting = `远方的行客，欢迎踏入【${county.name}】！此地海拔高达 ${county.altitude} 米，展现出【${county.terrainType}】之貌。远处巍巍可见【${county.naturalLandmark.name}】，近前即是【${county.culturalLandmark.name}】！`;

  if (county.isAutonomous) {
    if (isTibetan) {
      defaultName = '扎西多杰';
      defaultTitle = `${county.name}神山圣湖巡山使者`;
      defaultIcon = '🙏';
      defaultGreeting = `扎西德勒！神山【${county.naturalLandmark.name}】护佑着这片圣洁土地。快饮下一碗酥油茶暖身，听那经幡随长风呼啸！`;
    } else if (isMongol) {
      defaultName = '巴雅尔';
      defaultTitle = `${county.name}德都蒙古族草场长调歌者`;
      defaultIcon = '🏹';
      defaultGreeting = `赛音白努！辽阔大草原上，成吉思汗后裔的长调正在风中回响！欢迎来到【${county.name}】！`;
    } else if (isKazakh) {
      defaultName = '阿扎提';
      defaultTitle = `${county.name}哈萨克族金鹰猎手与阿肯`;
      defaultIcon = '🦅';
      defaultGreeting = `阿曼！弹响冬不拉，大漠孤烟直！在【${county.name}】的瀚海绿洲，草原雄鹰为你指引前程！`;
    } else if (isHui) {
      defaultName = '马阿洪';
      defaultTitle = `${county.name}古道茶坊掌柜`;
      defaultIcon = '🍵';
      defaultGreeting = `塞俩目！请进屋品一盅三泡台盖碗茶，润肺生津，祛除一路风沙寒气！`;
    }
  } else {
    // Specific Han / Silk Road characters based on prefecture
    if (county.prefecture.includes('酒泉')) {
      defaultName = '关城李老学士';
      defaultTitle = '西陲边关汉简与丝路史话考官';
      defaultIcon = '📜';
      defaultGreeting = `大汉置河西四郡，酒泉泉湖胜迹犹在！此去阳关风沙大，且收好【${county.culturalLandmark.name}】的碑刻拓印！`;
    } else if (county.prefecture.includes('张掖')) {
      defaultName = '甘州甘泉客';
      defaultTitle = '黑河湿地与丝路驿站老掌柜';
      defaultIcon = '🌾';
      defaultGreeting = `不望祁连山顶雪，错将张掖认江南！此地【${county.naturalLandmark.name}】钟灵毓秀，尽享金张掖之沃野风光！`;
    } else if (county.prefecture.includes('武威')) {
      defaultName = '凉州词隐生';
      defaultTitle = '西凉乐舞与汉魏碑学传人';
      defaultIcon = '🎶';
      defaultGreeting = `黄河远上白云间，一片孤城万仞山！欢迎步入古凉州境域之【${county.name}】，且听古刹松涛回荡！`;
    } else if (county.prefecture.includes('天水')) {
      defaultName = '秦州纪夫子';
      defaultTitle = '大地湾遗址与陇右历史考辨宗匠';
      defaultIcon = '🏺';
      defaultGreeting = `羲皇故里，陇上江南！【${county.name}】自古人杰地灵，【${county.culturalLandmark.name}】蕴含数千年中华文脉！`;
    } else if (county.prefecture.includes('平凉') || county.prefecture.includes('庆阳')) {
      defaultName = '陇东周老爹';
      defaultTitle = '黄帝问道崆峒与岐黄中医守坛老翁';
      defaultIcon = '🌄';
      defaultGreeting = `巍巍崆峒，岐黄故里！在【${county.name}】这片厚实黄土地上，农耕文明与道家仙踪代代相传！`;
    } else if (county.prefecture.includes('定西') || county.prefecture.includes('陇南')) {
      defaultName = '陇上老药农';
      defaultTitle = '中华药都高山深谷采药客';
      defaultIcon = '🌱';
      defaultGreeting = `秦巴灵秀，药草飘香！在【${county.name}】崇山峻岭间，名医奇草能驱散万般风雪寒毒！`;
    } else if (county.prefecture.includes('西宁') || county.prefecture.includes('海东')) {
      defaultName = '河湟老乡贤';
      defaultTitle = '河湟古道驿站与彩陶文化传承人';
      defaultIcon = '🏺';
      defaultGreeting = `湟水滔滔滋养金城西陲！来到【${county.name}】，且看这【${county.culturalLandmark.name}】见证着千百年民族相濡以沫！`;
    } else if (county.prefecture.includes('海西')) {
      defaultName = '瀚海地质老队副';
      defaultTitle = '柴达木盆地聚宝盆盐湖勘探先锋';
      defaultIcon = '🧭';
      defaultGreeting = `瀚海茫茫八百里，戈壁风蚀出奇观！在【${county.name}】不仅有壮丽盐湖，更蕴藏着无尽的天地奇珍！`;
    }
  }

  const firstSpecialty = county.ethnicFeatures.specialty.split('、')[0];
  const firstCraft = county.ethnicFeatures.crafts.split('（')[0].slice(0, 14);

  return {
    npcName: defaultName,
    npcTitle: defaultTitle,
    npcIcon: defaultIcon,
    npcGreeting: defaultGreeting,
    npcLore: `【地貌特征】${county.terrainType}。\n【自然奇观】${county.naturalLandmark.name} —— ${county.naturalLandmark.description}\n【人文名胜】${county.culturalLandmark.name} —— ${county.culturalLandmark.description}\n【民俗非遗】${county.ethnicFeatures.crafts}，盛产${county.ethnicFeatures.specialty}。`,
    questTitle: `【${county.name}风物志】考证${county.culturalLandmark.tag}`,
    questObjective: `在【${county.name}】实地探查${county.naturalLandmark.name}与${county.culturalLandmark.name}，并向驻地名宿请教${firstCraft}`,
    relicName: `【${county.name}】· ${county.culturalLandmark.tag}信物金印`,
    relicIcon: county.terrainArchetype === 'glacier' ? '❄️' : county.terrainArchetype === 'forest' ? '🌲' : county.terrainArchetype === 'saltlake' ? '🧂' : '📜',
    relicDescription: `在${county.name}探访${county.culturalLandmark.name}所得之信物，凝聚着${county.prefecture}天地的灵秀之气与历史厚重。`,
    relicEffect: {
      temp: county.altitude > 3000 ? 4.0 : 3.0,
      stamina: 45,
      resistColdSec: county.altitude > 3500 ? 100 : 70,
    },
    secretLore: `${county.name}自古隶属${county.prefecture}，地势${county.terrainDescription}。据旧志记载，此地${county.culturalLandmark.name}历经沧桑，孕育出独步华夏之${county.ethnicFeatures.specialty}，名扬河陇。`,
    campfireName: `【${county.name}】${county.terrainArchetype === 'forest' ? '松木柴火炉' : county.terrainArchetype === 'gobi' ? '红柳抗风地炉' : '传统暖心火塘'}`,
  };
}

// Generate the specific County Quest for any of the 132 counties
export function getCountyQuest(county: CountyData): CountyQuest {
  const profile = getCountyContent(county);
  const rewardItem: Item = {
    id: `relic_${county.id}`,
    name: profile.relicName,
    category: 'relic',
    icon: profile.relicIcon,
    description: profile.relicDescription,
    count: 1,
    effect: profile.relicEffect,
  };

  return {
    id: `quest_${county.id}`,
    countyId: county.id,
    title: profile.questTitle,
    objective: profile.questObjective,
    targetDescription: `${county.province}${county.prefecture}${county.name}（海拔 ${county.altitude}米）`,
    rewardItem,
    rewardStamina: 50,
  };
}
