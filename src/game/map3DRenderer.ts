import { CountyData } from '../types';

export interface MapCamera3D {
  pitch: number; // in radians (e.g. 0.65 for isometric tilt)
  yaw: number; // in radians (rotation around Z-axis)
  zoom: number;
  offsetX: number;
  offsetY: number;
}

export class InkWashMap3DRenderer {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private time: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Cannot get 2d context for 3D map');
    this.ctx = context;
  }

  // 3D coordinate projection onto 2D canvas screen
  public project(
    x: number,
    y: number,
    z: number,
    camera: MapCamera3D,
    width: number,
    height: number
  ): { x: number; y: number; scale: number; depth: number } {
    const cosYaw = Math.cos(camera.yaw);
    const sinYaw = Math.sin(camera.yaw);
    const cosPitch = Math.cos(camera.pitch);
    const sinPitch = Math.sin(camera.pitch);

    // World to Camera space rotation around Z
    const rx = x * cosYaw - y * sinYaw;
    const ry = x * sinYaw + y * cosYaw;
    const rz = z;

    // Pitch rotation (tilt)
    const px = rx;
    const py = ry * cosPitch - rz * sinPitch;
    const pz = ry * sinPitch + rz * cosPitch;

    // Camera perspective projection
    const fov = 900;
    const cameraDistance = 1200 / camera.zoom;
    const depth = cameraDistance + py;
    const factor = (fov / Math.max(100, depth)) * camera.zoom;

    const screenX = width / 2 + camera.offsetX + px * factor;
    const screenY = height / 2 + camera.offsetY - pz * factor;

    return { x: screenX, y: screenY, scale: factor, depth };
  }

  // Main rendering call
  public render(
    counties: CountyData[],
    selectedCountyId: string | null,
    hoveredCountyId: string | null,
    camera: MapCamera3D,
    dt: number
  ): { id: string; x: number; y: number; radius: number }[] {
    this.time += dt;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // 1. Classical Xuan Paper background with subtle ink vignette
    ctx.clearRect(0, 0, w, h);

    const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 50, w / 2, h / 2, Math.max(w, h));
    bgGrad.addColorStop(0, '#1c1917'); // warm stone dark ink
    bgGrad.addColorStop(0.5, '#0f0e0d');
    bgGrad.addColorStop(1, '#080706');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Subtle ancient paper texture watermark
    ctx.strokeStyle = 'rgba(214, 180, 140, 0.03)';
    ctx.lineWidth = 1;
    for (let r = 80; r < Math.max(w, h); r += 90) {
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 2. Draw 3D Topographical Grid & Ink-Wash Mountain Ridges
    this.drawTerrainElevationGrid(ctx, camera, w, h);

    // 3. Draw Major Rivers (Yellow River, Yangtze/Tongtian, Inland Rivers)
    this.drawMajorRivers(ctx, camera, w, h);

    // 4. Draw Plateau Lakes (Qinghai Lake, Zhaling/Eling, Salt Lakes)
    this.drawPlateauLakes(ctx, camera, w, h);

    // 5. Draw Province Borders & Silk Road Ancient Paths
    this.drawSilkRoadAndBoundaries(ctx, camera, w, h);

    // 6. Draw County Markers in Depth-Sorted Order
    return this.drawCountyMarkers(ctx, counties, selectedCountyId, hoveredCountyId, camera, w, h);
  }

  // Draw 3D topographical mesh with Shanshui ink brushstrokes
  private drawTerrainElevationGrid(
    ctx: CanvasRenderingContext2D,
    camera: MapCamera3D,
    w: number,
    h: number
  ) {
    const gridCols = 32;
    const gridRows = 24;
    const worldScale = 520;

    // Precalculate heightmap based on real Gansu & Qinghai geography
    // Gansu: northwest desert corridor to southeast mountains; Qinghai: high plateau basin & Kunlun/Qilian ridges
    const getHeight = (gx: number, gy: number): number => {
      // Normal coordinates: x [-1, 1], y [-1, 1]
      const nx = gx / (gridCols / 2) - 1;
      const ny = gy / (gridRows / 2) - 1;

      let elevation = 0;

      // Qilian Mountain Ridge (diagonal running from northwest -0.7, 0.5 to southeast 0.2, 0.1)
      const qilianDist = Math.abs(nx * 0.45 + ny * 0.85 - 0.15);
      if (qilianDist < 0.28) {
        elevation += Math.max(0, (0.28 - qilianDist) * 320);
      }

      // Kunlun Mountains & Bayan Har (South Qinghai)
      if (ny < -0.15 && nx < 0.2) {
        const kunlunDist = Math.abs(ny - (-0.45));
        elevation += Math.max(0, (0.35 - kunlunDist) * 260);
      }

      // Altun Mountains (Northwest border)
      if (nx < -0.5 && ny > 0.2) {
        elevation += Math.max(0, (nx + 0.9) * (ny) * 240);
      }

      // Qinghai Lake depression
      const qinghaiLakeDist = Math.hypot(nx - (-0.05), ny - 0.08);
      if (qinghaiLakeDist < 0.22) {
        elevation *= Math.max(0.1, qinghaiLakeDist / 0.22);
      }

      // Chaidamu Basin depression
      const chaidamuDist = Math.hypot(nx - (-0.45), ny - 0.05);
      if (chaidamuDist < 0.25) {
        elevation *= 0.4;
      }

      // Gobi Desert flat lowlands in Northwest Hexi
      if (nx < -0.6 && ny > 0.4) {
        elevation *= 0.35;
      }

      // Wave noise for natural mountain wrinkling
      elevation += Math.sin(nx * 8 + ny * 6) * 12 + Math.cos(nx * 14 - ny * 10) * 8;
      return Math.max(0, elevation);
    };

    // Draw ink-wash grid lines (longitude and latitude curves)
    ctx.save();
    ctx.lineWidth = 1;

    for (let r = 0; r < gridRows; r++) {
      ctx.beginPath();
      let started = false;

      for (let c = 0; c <= gridCols; c++) {
        const nx = c / (gridCols / 2) - 1;
        const ny = r / (gridRows / 2) - 1;
        const elev = getHeight(c, r);

        const worldX = nx * worldScale;
        const worldY = ny * worldScale * 0.85;
        const pt = this.project(worldX, worldY, elev, camera, w, h);

        // Alpha fade out distant edges
        if (!started) {
          ctx.moveTo(pt.x, pt.y);
          started = true;
        } else {
          ctx.lineTo(pt.x, pt.y);
        }
      }

      // Ink wash gradient stroke
      const alpha = 0.08 + (r / gridRows) * 0.08;
      ctx.strokeStyle = `rgba(180, 150, 120, ${alpha})`;
      ctx.stroke();
    }

    // Transverse lines
    for (let c = 0; c <= gridCols; c += 2) {
      ctx.beginPath();
      let started = false;

      for (let r = 0; r < gridRows; r++) {
        const nx = c / (gridCols / 2) - 1;
        const ny = r / (gridRows / 2) - 1;
        const elev = getHeight(c, r);

        const worldX = nx * worldScale;
        const worldY = ny * worldScale * 0.85;
        const pt = this.project(worldX, worldY, elev, camera, w, h);

        if (!started) {
          ctx.moveTo(pt.x, pt.y);
          started = true;
        } else {
          ctx.lineTo(pt.x, pt.y);
        }
      }
      ctx.strokeStyle = 'rgba(180, 150, 120, 0.06)';
      ctx.stroke();
    }

    ctx.restore();
  }

  // Draw Major Rivers in mineral turquoise/cyan ink lines
  private drawMajorRivers(
    ctx: CanvasRenderingContext2D,
    camera: MapCamera3D,
    w: number,
    h: number
  ) {
    const worldScale = 520;
    ctx.save();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.75)'; // cyan-blue ink
    ctx.shadowColor = 'rgba(56, 189, 248, 0.5)';
    ctx.shadowBlur = 6;

    // 1. 黄河 (Yellow River) Main Loop through Qinghai & Gansu
    const yellowRiverPoints = [
      { nx: -0.22, ny: -0.38, elev: 120 }, // 扎陵湖源头
      { nx: -0.15, ny: -0.35, elev: 110 },
      { nx: -0.05, ny: -0.28, elev: 90 },
      { nx: 0.12, ny: -0.25, elev: 85 }, // 河南蒙旗
      { nx: 0.14, ny: -0.15, elev: 75 }, // 玛曲大拐弯
      { nx: 0.05, ny: -0.08, elev: 65 }, // 贵德
      { nx: 0.16, ny: -0.06, elev: 55 }, // 循化
      { nx: 0.22, ny: -0.02, elev: 50 }, // 积石峡
      { nx: 0.35, ny: 0.06, elev: 40 }, // 兰州
      { nx: 0.45, ny: 0.18, elev: 35 }, // 白银景泰
    ];

    ctx.beginPath();
    yellowRiverPoints.forEach((pt, idx) => {
      const p = this.project(pt.nx * worldScale, pt.ny * worldScale * 0.85, pt.elev, camera, w, h);
      if (idx === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();

    // 2. 黑河 (Heihe River) from Qilian to Zhangye & Ejina
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(94, 234, 212, 0.65)';
    const heihePoints = [
      { nx: -0.12, ny: 0.28, elev: 140 }, // 祁连八一冰川源
      { nx: -0.18, ny: 0.38, elev: 80 }, // 肃南草场
      { nx: -0.22, ny: 0.44, elev: 45 }, // 张掖临泽
      { nx: -0.26, ny: 0.58, elev: 20 }, // 北入戈壁
    ];
    heihePoints.forEach((pt, idx) => {
      const p = this.project(pt.nx * worldScale, pt.ny * worldScale * 0.85, pt.elev, camera, w, h);
      if (idx === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();

    // 3. 通天河/长江源 (Tongtian River in Yushu)
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(14, 165, 233, 0.7)';
    const tongtianPoints = [
      { nx: -0.55, ny: -0.65, elev: 140 },
      { nx: -0.45, ny: -0.58, elev: 110 },
      { nx: -0.32, ny: -0.52, elev: 90 },
      { nx: -0.18, ny: -0.56, elev: 80 },
    ];
    tongtianPoints.forEach((pt, idx) => {
      const p = this.project(pt.nx * worldScale, pt.ny * worldScale * 0.85, pt.elev, camera, w, h);
      if (idx === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();

    ctx.restore();
  }

  // Draw Plateau Lakes (Qinghai Lake, Zhaling, Chaka Salt Lake)
  private drawPlateauLakes(
    ctx: CanvasRenderingContext2D,
    camera: MapCamera3D,
    w: number,
    h: number
  ) {
    const worldScale = 520;
    ctx.save();

    // 青海湖 (Qinghai Lake)
    const qlPt = this.project(-0.05 * worldScale, 0.06 * worldScale * 0.85, 30, camera, w, h);
    const qlGrad = ctx.createRadialGradient(qlPt.x, qlPt.y, 2, qlPt.x, qlPt.y, 42 * camera.zoom);
    qlGrad.addColorStop(0, 'rgba(14, 165, 233, 0.8)');
    qlGrad.addColorStop(0.7, 'rgba(2, 132, 199, 0.6)');
    qlGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
    ctx.fillStyle = qlGrad;
    ctx.beginPath();
    ctx.ellipse(qlPt.x, qlPt.y, 38 * camera.zoom, 22 * camera.zoom, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // 茶卡盐湖 (Chaka Salt Lake - Silver Crystal)
    const chakaPt = this.project(-0.28 * worldScale, 0.05 * worldScale * 0.85, 25, camera, w, h);
    ctx.fillStyle = 'rgba(240, 249, 255, 0.85)';
    ctx.beginPath();
    ctx.ellipse(chakaPt.x, chakaPt.y, 16 * camera.zoom, 9 * camera.zoom, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // 扎陵湖与鄂陵湖 (Twin lakes of Yellow River Source)
    const sourcePt = this.project(-0.2 * worldScale, -0.36 * worldScale * 0.85, 110, camera, w, h);
    ctx.fillStyle = 'rgba(34, 211, 238, 0.8)';
    ctx.beginPath();
    ctx.arc(sourcePt.x - 10 * camera.zoom, sourcePt.y, 9 * camera.zoom, 0, Math.PI * 2);
    ctx.arc(sourcePt.x + 8 * camera.zoom, sourcePt.y, 8 * camera.zoom, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Draw Silk Road Ancient Courier Route & Passageways
  private drawSilkRoadAndBoundaries(
    ctx: CanvasRenderingContext2D,
    camera: MapCamera3D,
    w: number,
    h: number
  ) {
    const worldScale = 520;
    ctx.save();

    // 丝绸之路古道金线 (Hexi Corridor Silk Road)
    ctx.lineWidth = 1.8;
    ctx.setLineDash([5, 4]);
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.65)'; // amber road

    const silkRoadStations = [
      { nx: 0.58, ny: 0.05, elev: 30 }, // 天水
      { nx: 0.35, ny: 0.06, elev: 40 }, // 兰州
      { nx: 0.18, ny: 0.22, elev: 50 }, // 乌鞘岭/天祝
      { nx: 0.08, ny: 0.3, elev: 45 }, // 武威
      { nx: -0.08, ny: 0.35, elev: 52 }, // 民乐扁都口
      { nx: -0.22, ny: 0.44, elev: 35 }, // 张掖
      { nx: -0.45, ny: 0.52, elev: 30 }, // 酒泉嘉峪关
      { nx: -0.88, ny: 0.65, elev: 20 }, // 敦煌玉门关阳关
    ];

    ctx.beginPath();
    silkRoadStations.forEach((pt, idx) => {
      const p = this.project(pt.nx * worldScale, pt.ny * worldScale * 0.85, pt.elev, camera, w, h);
      if (idx === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();
    ctx.setLineDash([]);

    // Province Label Calligraphy Watermarks in 3D
    ctx.font = `bold ${Math.round(20 * camera.zoom)}px serif`;
    ctx.textAlign = 'center';

    // 甘肃省 Watermark
    const gansuPos = this.project(-0.25 * worldScale, 0.5 * worldScale * 0.85, 30, camera, w, h);
    ctx.fillStyle = 'rgba(245, 158, 11, 0.18)';
    ctx.fillText('甘 肃 省 · 如 意 丝 路', gansuPos.x, gansuPos.y);

    // 青海省 Watermark
    const qinghaiPos = this.project(-0.25 * worldScale, -0.15 * worldScale * 0.85, 80, camera, w, h);
    ctx.fillStyle = 'rgba(56, 189, 248, 0.18)';
    ctx.fillText('青 海 省 · 三 江 之 源', qinghaiPos.x, qinghaiPos.y);

    ctx.restore();
  }

  // Draw County Markers with classical seals and badges
  private drawCountyMarkers(
    ctx: CanvasRenderingContext2D,
    counties: CountyData[],
    selectedCountyId: string | null,
    hoveredCountyId: string | null,
    camera: MapCamera3D,
    w: number,
    h: number
  ): { id: string; x: number; y: number; radius: number }[] {
    const worldScale = 520;
    const clickTargets: { id: string; x: number; y: number; radius: number }[] = [];

    // Calculate projected coordinates and depth sort
    const items = counties.map((c) => {
      const elevZ = c.mapCoord.elevation * 180;
      const pt = this.project(
        c.mapCoord.x * worldScale,
        c.mapCoord.y * worldScale * 0.85,
        elevZ,
        camera,
        w,
        h
      );
      return {
        county: c,
        x: pt.x,
        y: pt.y,
        scale: pt.scale,
        depth: pt.depth,
      };
    });

    // Sort by depth (render far to near)
    items.sort((a, b) => b.depth - a.depth);

    items.forEach(({ county, x, y, scale }) => {
      const isSelected = county.id === selectedCountyId;
      const isHovered = county.id === hoveredCountyId;
      const baseRadius = Math.max(5, 7 * scale);
      const hitRadius = Math.max(16, baseRadius * 2);

      clickTargets.push({ id: county.id, x, y, radius: hitRadius });

      ctx.save();

      // Elevation stem to ground
      const groundPt = this.project(
        county.mapCoord.x * worldScale,
        county.mapCoord.y * worldScale * 0.85,
        0,
        camera,
        w,
        h
      );
      ctx.strokeStyle = isSelected
        ? 'rgba(245, 158, 11, 0.6)'
        : isHovered
        ? 'rgba(255, 255, 255, 0.4)'
        : 'rgba(214, 180, 140, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(groundPt.x, groundPt.y);
      ctx.lineTo(x, y);
      ctx.stroke();

      // Glowing Aura for Autonomous or Selected
      if (isSelected || isHovered) {
        ctx.beginPath();
        ctx.arc(x, y, baseRadius * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? 'rgba(245, 158, 11, 0.35)' : 'rgba(255, 255, 255, 0.2)';
        ctx.fill();
      }

      // Pin Head (Cinnabar red for autonomous, Jade cyan for nature, Gold for ancient)
      ctx.beginPath();
      ctx.arc(x, y, baseRadius, 0, Math.PI * 2);

      if (county.isAutonomous) {
        ctx.fillStyle = isSelected ? '#f59e0b' : '#dc2626'; // Red Cinnabar Seal
      } else {
        ctx.fillStyle = isSelected ? '#f59e0b' : county.province === '甘肃' ? '#0284c7' : '#0d9488';
      }
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Ethnic / Autonomous Banner Tag or County Name
      const labelText = county.name;
      const fontSize = Math.max(10, Math.min(13, Math.round(11 * scale)));
      ctx.font = `bold ${fontSize}px sans-serif`;

      const textWidth = ctx.measureText(labelText).width;
      const labelX = x + baseRadius + 4;
      const labelY = y + 4;

      // Label background plate
      ctx.fillStyle = isSelected
        ? 'rgba(245, 158, 11, 0.95)'
        : isHovered
        ? 'rgba(30, 41, 59, 0.95)'
        : 'rgba(15, 23, 42, 0.75)';
      ctx.strokeStyle = isSelected
        ? '#fbbf24'
        : county.isAutonomous
        ? 'rgba(220, 38, 38, 0.6)'
        : 'rgba(100, 116, 139, 0.4)';
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.roundRect(labelX - 4, labelY - fontSize - 1, textWidth + 8, fontSize + 5, 4);
      ctx.fill();
      ctx.stroke();

      // Label text
      ctx.fillStyle = isSelected ? '#0f172a' : '#f8fafc';
      ctx.fillText(labelText, labelX, labelY);

      // Autonomous ethnic emblem badge
      if (county.isAutonomous) {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(labelX - 8, labelY - fontSize / 2, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });

    return clickTargets;
  }
}
