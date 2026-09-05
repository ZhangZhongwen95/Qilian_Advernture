# 祁连山海志 (Qilian Shan-Hai: A Silk Road Alpine RPG)

> 以巍峨祁连山为背景的沉浸式国风角色扮演冒险游戏。融合手绘山川、天籁听山秘术、动态风雪与核心体温生存机制，支持桌面端与移动端，零外部素材与 CDN 依赖，纯静态构建，可直接一键部署至 GitHub Pages！

---

## 🏔️ 游戏背景与世界观

祁连山，古称“天山”，横亘于青藏高原与河西走廊之间，千百年来宛如一条巨大的冰雪玉龙，孕育了黑河、疏勒河与石羊河三大水系。若是没有祁连山千载不绝的冰川融雪，便无河西走廊武威、张掖、酒泉、敦煌之千里绿洲。

玩家将扮演一名踏访丝绸古道的游侠旅者，从山脚草场出发，历经【扁都口草场】、【张掖丹霞】、【祁连冷杉林】，最终登上海拔 4680 米的【八一冰川】之巅，领悟古老的“听山”秘术，抗击极寒风雪，并在守护灵雪豹面前，抉择千载雪脉的最终归宿。

---

## 🎮 核心系统与玩法特色

1. **纯代码程序化渲染（Canvas Procedural Art）**
   - 零外部图片、字体或第三方图床依赖，彻底杜绝 GitHub Pages 404 资源加载失效问题。
   - 包含多层视差水墨雪山、流动的白云金曦、丹霞七彩砂岩层理、祁连冷杉林与万年八一冰川。
   - 动态粒子天气系统：随海拔与天气切换晴朗、晨雾、细雪与呼啸狂暴暴风雪。

2. **核心生存机制：体温与营火系统**
   - **体温系统**：正常体温 37.0°C。随海拔升高与风雪加剧，核心体温会持续流失。当体温跌至 33.5°C 时，角色将出现剧烈颤抖与行动减速，屏幕边缘凝结冰霜；
   - **营火恢复**：在营火旁坐下取暖可驱散寒气、恢复全部体温与体力；旅途遭遇熄灭的营火，可用火镰与红松松枝重新点燃；
   - **藏地饮食**：热腾腾的酥油茶可大幅恢复体温并赋予长达 50 秒的御寒暖意屏障；青稞干粮可恢复充沛体力。

3. **专属异能：“听山”秘术（Mountain Listening）**
   - 游牧先民代代相传的通灵感知。按下【空格键】（移动端轻触【听山】按键），角色闭气凝神，向四周扩散出青蓝色精神声波涟漪。
   - 激活时地脉金线浮现，能够勘破肉眼难辨的悬崖雪莲、古汉唐烽燧遗迹铜匣、风脉流向与秘径。

4. **双结局剧情分支（Dual Endings）**
   - **结局一：【风雪长宁 · 山岳孤绝】**：将古铜镜深埋于圣坛冰穴，封存冰川圣域，令大山永葆千载纯洁与孤绝之神圣。
   - **结局二：【丝路春融 · 生生不息】**：折射晨曦引动玄冰融化为甘冽春泉，奔流润泽河西千里绿洲，成就人山共存的繁荣乐土。

5. **原生 Web Audio API 拟真音效与国风古韵**
   - 采用原生振荡器与频段滤波合成踩雪脚步声、呼啸山风、营火噼啪爆裂声、西藏颂钵“听山”共鸣音，以及清雅悠远的五声音阶古琴韵律，无需加载任何 MP3 文件。

6. **全平台操控支持**
   - **桌面端**：`WASD` 或 `方向键` 移动，`E` 键互动/对话，`空格` 施展听山，`I` 打开行囊，`M` 打开舆图，`ESC` 暂停与关闭界面。
   - **移动端**：适配触摸屏幕，左侧拥有虚拟四向摇杆，右侧配备高对比度【交互】、【听山】、【行囊】、【营火】圆钮。

7. **自动存档（Local Storage）与数据导出**
   - 每 10 秒自动保存探索进度、背包、已点燃营火与任务状态；
   - 支持一键导出与备份 JSON 存档文件。

---

## 🚀 部署到 GitHub Pages 指南

本项目基于 Vite + React + TypeScript 构建，已在 `vite.config.ts` 中配置了相对路径基准（`base: './'`），非常适合作为静态站点部署在 GitHub Pages 的根目录或子路径下。

### 方法一：通过 GitHub 仓库分支部署（推荐）

1. **推送代码至 GitHub 仓库**：
   ```bash
   git init
   git add .
   git commit -m "feat: initial Qilian RPG game"
   git remote add origin https://github.com/<你的用户名>/<仓库名称>.git
   git branch -M main
   git push -u origin main
   ```

2. **开启 GitHub Pages**：
   - 打开 GitHub 仓库页面，点击顶部 **Settings**（设置）；
   - 在左侧菜单栏中选择 **Pages**；
   - 在 **Build and deployment** 下的 **Source** 下拉菜单中选择 **Deploy from a branch**；
   - Branch 选择 `main`（或构建后的 `gh-pages` 分支），文件夹选择 `/(root)` 或 `/dist`；
   - 点击 **Save**。

3. **访问游戏**：
   - 等待 1~2 分钟，GitHub Pages 状态变为绿色后，即可通过 `https://<你的用户名>.github.io/<仓库名称>/` 访问并开始冒险！

### 方法二：本地运行与测试

在本地终端运行以下命令：

```bash
# 1. 安装依赖
npm install

# 2. 启动本地开发服务
npm run dev

# 3. 本地构建并预览测试生产包
npm run build
npm run preview
```

或者使用 Python 简易 HTTP 服务在 dist 目录下启动测试：

```bash
cd dist
python -m http.server 8000
```
然后在浏览器中打开 `http://localhost:8000` 即可开始游玩。

---

## 📁 项目结构说明

```text
├── index.html                 # 网页入口文件（配置全屏触摸与视口参数）
├── vite.config.ts             # Vite 构建配置文件（配置 base: './' 兼容 GitHub Pages）
├── package.json               # 项目依赖与运行脚本
├── metadata.json              # 应用元数据
├── README.md                  # 详细项目部署与架构文档
├── src/
│   ├── main.tsx               # React 根渲染挂载入口
│   ├── App.tsx                # 游戏主循环、物理移动、体温判定与状态管理
│   ├── index.css              # 全局样式配置与 Tailwind CSS 引入
│   ├── types.ts               # 游戏状态、区域、道具与任务 TypeScript 类型定义
│   ├── game/
│   │   ├── audio.ts           # Web Audio API 纯原生音频与古风五声音律合成引擎
│   │   ├── renderer.ts        # Canvas 纯代码程序化山川、天气粒子与人物绘制引擎
│   │   └── worldData.ts       # 祁连四境、NPC、对话树、任务与风物百科配置
│   └── components/
│       ├── MainMenu.tsx       # 游戏开屏主菜单与存档读取
│       ├── GameHUD.tsx        # 顶部生存仪表盘（体温/体力/海拔/天气/任务）
│       ├── DialogueBox.tsx    # RPG 叙事对话框与分支选择组件
│       ├── CampfireModal.tsx  # 营火休整、煮酥油茶与烤青稞干粮系统
│       ├── InventoryModal.tsx # 行囊道具背包管理与使用
│       ├── MapModal.tsx       # 祁连天脉行舆图与快速传送系统
│       ├── LoreModal.tsx      # 祁连风物志与丝路历史百科
│       ├── EndingModal.tsx    # 双结局画卷与终章结算
│       ├── DeployGuideModal.tsx # 游戏内嵌入式 GitHub Pages 部署指南
│       └── MobileControls.tsx # 移动端屏幕虚拟摇杆与触控按键
```

---

## 📜 开源协议

本项目采用 [MIT License](https://opensource.org/licenses/MIT) 授权，欢迎自由交流、分发与二次创作。
