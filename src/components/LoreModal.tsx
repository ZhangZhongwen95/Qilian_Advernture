import React, { useState } from 'react';
import { BookOpen, X, Mountain, Wind, History, Sparkles, Users, Award, Compass } from 'lucide-react';
import { LORE_ITEMS } from '../game/worldData';

interface LoreModalProps {
  onClose: () => void;
}

const NINE_ETHNICITIES_DATA = [
  {
    name: '裕固族',
    location: '甘肃省肃南裕固族自治县',
    costume: '头戴尖顶红缨毡帽（“红缨帽”），身着大领大襟高开衩长袍，佩戴五彩珊瑚“大头面”。',
    heritage: '裕固族无文字史诗民歌、天鹅琴拉奏技艺、手工皮雕与织褐地毯。',
    festivals: '祭鄂博神典、赛马会、天鹅琴弹唱会。',
    specialty: '高山黄菇手抓羊肉、酥油奶茶、风干牛羊肉。',
    quote: '祁连雪山是母亲，天鹅琴声伴放牧。红缨帽上缀云霞，古歌传唱千百年。',
    tag: '甘肃特有民族 · 丝路牧歌',
    accentColor: 'border-amber-500/40 bg-amber-950/20 text-amber-300',
  },
  {
    name: '东乡族',
    location: '甘肃省东乡族自治县',
    costume: '男子头戴素雅黑或白色无檐小帽，女子佩戴青、绿、紫丝质盖头，身着素雅短衫。',
    heritage: '国家级非遗【东乡擀毡技艺】、东乡刺绣、东乡语“花儿”山歌。',
    festivals: '古尔邦节、开斋节、传统婚礼“折羊”宴。',
    specialty: '享誉大江南北的东乡手抓羊肉、油香、油馓子。',
    quote: '黄土旱塬千沟壑，布楞丹霞巨龙腾。巧手擀得纯羊毡，手抓香气溢河州。',
    tag: '甘肃特有民族 · 陇原擀毡',
    accentColor: 'border-orange-500/40 bg-orange-950/20 text-orange-300',
  },
  {
    name: '保安族',
    location: '甘肃省积石山保安族东乡族撒拉族自治县',
    costume: '男子头戴白礼帽、穿对襟坎肩，腰佩保安名刀；女子着华美长衫佩盖头。',
    heritage: '国家级非物质文化遗产【保安腰刀制作技艺】（一把名刀历经40余道淬火打磨工序，削铁如泥）。',
    festivals: '保安宴席曲、克雷宴、对唱花儿。',
    specialty: '积石山大红袍花椒、保安风干肉、石核桃。',
    quote: '积石山雄扼黄河，大河家畔古陶烁。炼得昆仑精钢骨，一把腰刀动九州。',
    tag: '甘肃特有民族 · 神州名刀',
    accentColor: 'border-red-500/40 bg-red-950/20 text-red-300',
  },
  {
    name: '撒拉族',
    location: '青海省循化撒拉族自治县',
    costume: '男子喜戴六角或八角白礼帽，着黑坎肩；女子佩戴绿、红真丝盖头，饰以耳环手镯。',
    heritage: '撒拉族古老“骆驼舞”、撒拉篱笆木楼营建技艺、撒拉宴席曲。',
    festivals: '骆驼泉纪念会、六月花儿会、撒拉族古尔邦节。',
    specialty: '循化红线椒（香辣肉厚）、黄河冷水鳟鱼、撒拉麦仁面片。',
    quote: '白驼载经自西来，孟达天池碧玉开。黄河九曲温润地，红椒如火撒拉家。',
    tag: '青海特有民族 · 白驼东迁',
    accentColor: 'border-rose-500/40 bg-rose-950/20 text-rose-300',
  },
  {
    name: '土族',
    location: '青海省互助土族自治县、民和回族土族自治县',
    costume: '举世闻名的【七彩花袖衫】，红黄蓝白黑五彩布圈层层镶嵌，若彩虹绕身。',
    heritage: '国家级非遗【土族盘绣】（一针二线绝技）、古法青稞酩馏酒酿造、轮子秋竞技。',
    festivals: '轮子秋大型秋千竞技、“安召”踏歌圈舞、纳顿节（世界最长的狂欢节）。',
    specialty: '互助青稞酩馏酒、萱麻酥饼、狗浇尿油饼。',
    quote: '彩虹织成花袖锦，浪士当林漫松涛。轮子秋上飞如燕，酩馏一碗醉清霄。',
    tag: '青海特有民族 · 彩虹部落',
    accentColor: 'border-pink-500/40 bg-pink-950/20 text-pink-300',
  },
  {
    name: '藏族',
    location: '甘南夏河/碌曲/迭部/天祝；海北祁连/门源；海南共和；果洛玛多；玉树；黄南同仁',
    costume: '宽大厚重氆氇藏袍，袖长过膝，束五彩腰带，佩戴绿松石、蜜蜡珊瑚嘎乌盒。',
    heritage: '世界级非遗【热贡艺术】（唐卡/堆绣/泥塑）、格萨尔王说唱史诗、藏药炮制。',
    festivals: '藏历新年、毛兰姆祈愿大法会、晒佛节、香浪草原节、玉树赛马会。',
    specialty: '牦牛奶香酥油茶、手撕风干牦牛肉、青稞糌粑、冬虫夏草。',
    quote: '雪山万仞如玉龙，梵音远伴风马旗。通天江源水长碧，一碗酥油暖客心。',
    tag: '青藏之脊 · 雪域梵音',
    accentColor: 'border-sky-500/40 bg-sky-950/20 text-sky-300',
  },
  {
    name: '蒙古族',
    location: '甘肃肃北蒙古族自治县；青海河南蒙古族自治县；海西州德令哈/乌兰/都兰',
    costume: '德都蒙古族开衩丝棉长袍，宽大金丝腰带，足蹬软帮起翘皮靴，头戴红缨毡帽。',
    heritage: '蒙古长调呼麦、马头琴制作与弹唱、蒙古族搏克摔跤、雪山蒙古刺绣。',
    festivals: '草原那达慕盛会、祭敖包大典、黄河首曲草原赛马。',
    specialty: '烤全羊、手把肉、蒙古奶豆腐、奶酒。',
    quote: '阿尔金下戈壁阔，德都长袍策骏驰。苍茫呼麦声震宇，马头琴诉万古思。',
    tag: '草原雄鹰 · 呼麦长调',
    accentColor: 'border-cyan-500/40 bg-cyan-950/20 text-cyan-300',
  },
  {
    name: '哈萨克族',
    location: '甘肃省阿克塞哈萨克族自治县',
    costume: '戴白狐皮尖顶皮帽（“绍克列”），身着刺绣羊角纹开襟长袍，脚蹬精制皮靴。',
    heritage: '冬不拉弹唱艺术（阿肯阿依特斯对唱）、哈萨克金鹰驯鹰术、羊毛花毡。',
    festivals: '“姑娘追”马上竞技、叼羊大赛、阿肯阿依特斯音乐盛会。',
    specialty: '马奶酒、纳仁（手抓马肉大薄面片）、包尔萨克（油炸面点）。',
    quote: '苏干湖畔水草肥，冬不拉弦诉琴意。金鹰展翅上云霄，姑娘追马意情长。',
    tag: '金鹰骑士 · 冬不拉弹唱',
    accentColor: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300',
  },
  {
    name: '回族',
    location: '甘肃临夏市/临夏县/张家川；青海门源回族自治县/大通/化隆',
    costume: '男子头戴素白平顶无檐帽，着黑马甲短衫；女子佩戴真丝纯色或刺绣盖头。',
    heritage: '国家级非遗【临夏砖雕】、木雕雕刻技艺、河州花儿会念唱。',
    festivals: '开斋节、古尔邦节、圣纪节、松鸣岩花儿会。',
    specialty: '河州盖碗八宝茶、东乡手抓、门源黄花蜜菜籽油、酿皮油香。',
    quote: '八坊深巷砖雕秀，三泡台茶甘菊香。岗什雪峰花海阔，花儿一曲透云乡。',
    tag: '陇原古城 · 砖雕茶韵',
    accentColor: 'border-teal-500/40 bg-teal-950/20 text-teal-300',
  },
];

export const LoreModal: React.FC<LoreModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'ethnic' | 'lore'>('ethnic');
  const [selectedEthnicIndex, setSelectedEthnicIndex] = useState(0);
  const [selectedLoreIndex, setSelectedLoreIndex] = useState(0);

  const currentEthnic = NINE_ETHNICITIES_DATA[selectedEthnicIndex];
  const currentLore = LORE_ITEMS[selectedLoreIndex];

  const categoryIcons: Record<string, React.ReactNode> = {
    地理风貌: <Mountain className="w-4 h-4 text-emerald-400" />,
    古法秘术: <Wind className="w-4 h-4 text-sky-400" />,
    历史沉淀: <History className="w-4 h-4 text-amber-400" />,
    自然圣境: <Sparkles className="w-4 h-4 text-indigo-400" />,
  };

  return (
    <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-stone-900 border border-stone-700 w-full max-w-3xl rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4 text-stone-100 max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-stone-100 font-serif">甘青风物志 · 文化典册</h3>
              <p className="text-xs text-stone-400">探寻丝绸之路咽喉、三江之源与九大民族人文非遗</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab Switches */}
            <div className="flex bg-stone-950 p-1 rounded-xl border border-stone-800 text-xs">
              <button
                onClick={() => setActiveTab('ethnic')}
                className={`px-3 py-1 rounded-lg transition font-medium flex items-center gap-1.5 ${
                  activeTab === 'ethnic'
                    ? 'bg-amber-600 text-stone-950 font-bold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>甘青九大民族风情</span>
              </button>
              <button
                onClick={() => setActiveTab('lore')}
                className={`px-3 py-1 rounded-lg transition font-medium flex items-center gap-1.5 ${
                  activeTab === 'lore'
                    ? 'bg-indigo-600 text-stone-100 font-bold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>祁连山川考</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab 1: Nine Ethnicities Showcase */}
        {activeTab === 'ethnic' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 min-h-[360px] overflow-hidden">
            {/* Ethnic List */}
            <div className="flex flex-col gap-1.5 border-r border-stone-800/80 pr-2 overflow-y-auto max-h-[55vh]">
              {NINE_ETHNICITIES_DATA.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedEthnicIndex(idx)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition ${
                    selectedEthnicIndex === idx
                      ? 'bg-amber-950/60 border-amber-500 text-amber-200 font-bold shadow-sm'
                      : 'bg-stone-800/40 border-stone-800/80 text-stone-400 hover:bg-stone-800 hover:text-stone-200'
                  }`}
                >
                  <div className="text-xs font-serif">{item.name}</div>
                  <span className="text-[10px] text-stone-500 truncate max-w-[110px]">
                    {item.location.split('省')[1] || item.location}
                  </span>
                </button>
              ))}
            </div>

            {/* Selected Ethnic Detail */}
            <div className="sm:col-span-2 flex flex-col gap-3 overflow-y-auto max-h-[55vh] pr-1">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-bold font-serif text-amber-200">
                    {currentEthnic.name}
                  </h4>
                  <div className="text-xs text-amber-400/80 mt-0.5">{currentEthnic.location}</div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-serif">
                  {currentEthnic.tag}
                </span>
              </div>

              {/* Poetic Quote */}
              <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800 text-xs italic text-stone-300 font-serif border-l-2 border-l-amber-500">
                “{currentEthnic.quote}”
              </div>

              {/* Detail Blocks */}
              <div className="space-y-2.5 text-xs text-stone-300">
                <div className="bg-stone-950/50 p-3 rounded-xl border border-stone-800/80">
                  <div className="font-bold text-amber-400 mb-1">【传统服饰】</div>
                  <p className="text-stone-400 leading-relaxed">{currentEthnic.costume}</p>
                </div>

                <div className="bg-stone-950/50 p-3 rounded-xl border border-stone-800/80">
                  <div className="font-bold text-sky-400 mb-1">【非遗技艺与民歌】</div>
                  <p className="text-stone-400 leading-relaxed">{currentEthnic.heritage}</p>
                </div>

                <div className="bg-stone-950/50 p-3 rounded-xl border border-stone-800/80">
                  <div className="font-bold text-rose-400 mb-1">【传统节庆与习俗】</div>
                  <p className="text-stone-400 leading-relaxed">{currentEthnic.festivals}</p>
                </div>

                <div className="bg-stone-950/50 p-3 rounded-xl border border-stone-800/80">
                  <div className="font-bold text-emerald-400 mb-1">【风味特产】</div>
                  <p className="text-amber-200/90 leading-relaxed">{currentEthnic.specialty}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Lore Items */}
        {activeTab === 'lore' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 min-h-[360px] overflow-hidden">
            <div className="flex flex-col gap-2 border-r border-stone-800/80 pr-2 overflow-y-auto max-h-[55vh]">
              {LORE_ITEMS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedLoreIndex(idx)}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition ${
                    selectedLoreIndex === idx
                      ? 'bg-indigo-950/60 border-indigo-500 text-indigo-200 shadow-sm'
                      : 'bg-stone-800/50 border-stone-800 text-stone-400 hover:bg-stone-800 hover:text-stone-200'
                  }`}
                >
                  {categoryIcons[item.category] || <Mountain className="w-4 h-4" />}
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold truncate">{item.title}</div>
                    <div className="text-[10px] text-stone-500">{item.category}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="sm:col-span-2 flex flex-col gap-3 overflow-y-auto max-h-[55vh] pr-1">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-bold font-serif text-stone-100">
                  {currentLore.title}
                </h4>
                <span className="text-xs px-2.5 py-1 rounded-full bg-stone-800 text-indigo-300 font-medium">
                  {currentLore.category}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-stone-950 border border-stone-800/80 text-xs sm:text-sm text-stone-300 leading-relaxed whitespace-pre-line font-serif">
                {currentLore.desc}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
