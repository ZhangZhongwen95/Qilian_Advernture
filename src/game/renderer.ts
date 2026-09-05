import { InteractiveObject, NPC, PlayerState, WeatherType, ZoneConfig, ZoneId } from '../types';

export interface Snowflake {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
}

export class GameRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private snowflakes: Snowflake[] = [];
  private time: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not obtain 2D canvas context');
    this.ctx = context;
    this.initSnowflakes(160);
  }

  private initSnowflakes(count: number) {
    this.snowflakes = [];
    for (let i = 0; i < count; i++) {
      this.snowflakes.push({
        x: Math.random() * 1000,
        y: Math.random() * 600,
        size: 1 + Math.random() * 3,
        speedY: 1.2 + Math.random() * 2.5,
        speedX: -1 + Math.random() * 2,
        opacity: 0.3 + Math.random() * 0.7,
      });
    }
  }

  public render(
    zone: ZoneConfig,
    player: PlayerState,
    npcs: NPC[],
    objects: InteractiveObject[],
    weather: WeatherType,
    deltaTime: number
  ) {
    this.time += deltaTime;
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;

    // 1. Draw Sky & Horizon
    this.drawSky(zone, width, height);

    // 2. Draw Distant Mountain Ranges (Parallax & Ink-Wash Style)
    this.drawDistantPeaks(zone, width, height);

    // 3. Draw Mid-ground terrain & features (Danxia ridges, spruce pines, yurts, beacon towers)
    this.drawMidground(zone, width, height);

    // 4. Draw Ground / Trail / Snow Field
    this.drawGround(zone, width, height);

    // 5. Draw Interactive Objects (Campfires, steles, altars, herbs)
    this.drawObjects(objects, zone.id, player.isListening);

    // 6. Draw NPCs
    this.drawNPCs(npcs, zone.id);

    // 7. Draw Player Character
    this.drawPlayer(player);

    // 8. "Mountain Listening" (听山) Spiritual Aura & Ley Lines
    if (player.isListening) {
      this.drawListeningEffect(player, objects, width, height);
    }

    // 9. Weather Particle Systems (Snow, Blizzard, Mist)
    this.drawWeather(weather, width, height);

    // 10. Atmospheric Frost Vignette (when cold)
    if (player.bodyTemp < 35.0) {
      this.drawFrostVignette(player.bodyTemp, width, height);
    }
  }

  private drawSky(zone: ZoneConfig, w: number, h: number) {
    const ctx = this.ctx;
    const grad = ctx.createLinearGradient(0, 0, 0, h * 0.7);
    grad.addColorStop(0, zone.bgPalette.skyTop);
    grad.addColorStop(1, zone.bgPalette.skyBottom);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Draw stylized sun / moon / mist glow
    if (zone.id === 'meadow' || zone.id === 'glacier') {
      const sunGrad = ctx.createRadialGradient(w * 0.8, h * 0.22, 10, w * 0.8, h * 0.22, 90);
      sunGrad.addColorStop(0, 'rgba(255, 250, 220, 0.85)');
      sunGrad.addColorStop(0.5, 'rgba(254, 240, 138, 0.3)');
      sunGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(w * 0.8, h * 0.22, 90, 0, Math.PI * 2);
      ctx.fill();
    } else if (zone.id === 'danxia') {
      // Golden hour sunset glow
      const sunsetGrad = ctx.createRadialGradient(w * 0.3, h * 0.35, 10, w * 0.3, h * 0.35, 160);
      sunsetGrad.addColorStop(0, 'rgba(253, 186, 116, 0.7)');
      sunsetGrad.addColorStop(0.6, 'rgba(234, 88, 12, 0.2)');
      sunsetGrad.addColorStop(1, 'rgba(234, 88, 12, 0)');
      ctx.fillStyle = sunsetGrad;
      ctx.beginPath();
      ctx.arc(w * 0.3, h * 0.35, 160, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private drawDistantPeaks(zone: ZoneConfig, w: number, h: number) {
    const ctx = this.ctx;

    // Distant snow mountains (Qilian main ridge)
    ctx.save();
    ctx.fillStyle = zone.bgPalette.mountainFar;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.55);

    const peaks = [
      { x: 0.1, y: 0.28 },
      { x: 0.22, y: 0.38 },
      { x: 0.35, y: 0.2 },
      { x: 0.5, y: 0.35 },
      { x: 0.68, y: 0.16 }, // highest sacred peak
      { x: 0.82, y: 0.3 },
      { x: 0.95, y: 0.24 },
      { x: 1.05, y: 0.42 },
    ];

    for (let i = 0; i < peaks.length; i++) {
      ctx.lineTo(w * peaks[i].x, h * peaks[i].y);
    }
    ctx.lineTo(w, h * 0.65);
    ctx.lineTo(0, h * 0.65);
    ctx.closePath();
    ctx.fill();

    // Snow caps & ridges on distant peaks
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    peaks.forEach((peak) => {
      ctx.beginPath();
      ctx.moveTo(w * peak.x, h * peak.y);
      ctx.lineTo(w * (peak.x - 0.05), h * (peak.y + 0.1));
      ctx.lineTo(w * (peak.x + 0.04), h * (peak.y + 0.08));
      ctx.closePath();
      ctx.fill();
    });

    // Secondary mid mountain ridge
    ctx.fillStyle = zone.bgPalette.mountainMid;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.6);
    const midPeaks = [
      { x: 0.05, y: 0.42 },
      { x: 0.18, y: 0.48 },
      { x: 0.32, y: 0.39 },
      { x: 0.45, y: 0.45 },
      { x: 0.58, y: 0.38 },
      { x: 0.75, y: 0.44 },
      { x: 0.9, y: 0.36 },
      { x: 1.0, y: 0.5 },
    ];
    for (let i = 0; i < midPeaks.length; i++) {
      ctx.lineTo(w * midPeaks[i].x, h * midPeaks[i].y);
    }
    ctx.lineTo(w, h * 0.7);
    ctx.lineTo(0, h * 0.7);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  private drawMidground(zone: ZoneConfig, w: number, h: number) {
    const ctx = this.ctx;

    if (zone.id === 'meadow') {
      // Rolling green pastures & yurt & grazing black yaks
      this.drawYurt(w * 0.36, h * 0.54, 75, 55);
      this.drawPrayerFlags(w * 0.62, h * 0.52, w * 0.8, h * 0.53);
      this.drawYak(w * 0.15, h * 0.58, 42, 28);
      this.drawYak(w * 0.22, h * 0.61, 35, 24);
    } else if (zone.id === 'danxia') {
      // Stratified Danxia rainbow rock ridges
      this.drawDanxiaStrata(w, h);
      // Beacon Tower ruin on high ridge
      this.drawBeaconTower(w * 0.75, h * 0.44, 60, 85);
    } else if (zone.id === 'forest') {
      // Majestic Qilian spruce pine forest
      this.drawSprucePines(w, h);
    } else if (zone.id === 'glacier') {
      // Grand glacial ice wall and blue seracs
      this.drawGlacialIceWall(w, h);
    }
  }

  private drawYurt(x: number, y: number, w: number, h: number) {
    const ctx = this.ctx;
    ctx.save();
    // Yurt dome
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(x, y, w / 2, h / 2, 0, Math.PI, 0);
    ctx.lineTo(x + w / 2, y + h * 0.35);
    ctx.lineTo(x - w / 2, y + h * 0.35);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Traditional red/gold ornamental band
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(x - w / 2 + 2, y + h * 0.05, w - 4, 6);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(x - w / 2 + 2, y + h * 0.14, w - 4, 3);

    // Doorway
    ctx.fillStyle = '#78350f';
    ctx.fillRect(x - 10, y + h * 0.08, 20, h * 0.28);

    // Roof chimney with gentle smoke
    ctx.fillStyle = '#475569';
    ctx.fillRect(x - 3, y - h / 2 - 6, 6, 8);

    // Rising smoke puffs
    ctx.fillStyle = 'rgba(241, 245, 249, 0.4)';
    for (let i = 0; i < 3; i++) {
      const puffOffset = (this.time * 25 + i * 20) % 60;
      const puffX = x + Math.sin(this.time * 2 + i) * 8;
      const puffY = y - h / 2 - 10 - puffOffset;
      const radius = 4 + puffOffset * 0.15;
      ctx.beginPath();
      ctx.arc(puffX, puffY, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  private drawPrayerFlags(x1: number, y1: number, x2: number, y2: number) {
    const ctx = this.ctx;
    ctx.save();
    // String line
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo((x1 + x2) / 2, (y1 + y2) / 2 + 12, x2, y2);
    ctx.stroke();

    // 5 Buddhist colors: Blue, White, Red, Green, Yellow (Sky, Cloud, Fire, Water, Earth)
    const colors = ['#2563eb', '#ffffff', '#dc2626', '#16a34a', '#eab308'];
    const flagCount = 10;
    for (let i = 0; i < flagCount; i++) {
      const t = i / (flagCount - 1);
      const fx = x1 + (x2 - x1) * t;
      const fy = y1 + (y2 - y1) * t + Math.sin(t * Math.PI) * 12;
      const flutter = Math.sin(this.time * 6 + i) * 4;

      ctx.fillStyle = colors[i % colors.length];
      ctx.beginPath();
      ctx.moveTo(fx, fy);
      ctx.lineTo(fx + 8 + flutter, fy + 12);
      ctx.lineTo(fx - 2, fy + 12);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  private drawYak(x: number, y: number, w: number, h: number) {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = '#1c1917';
    // Body
    ctx.beginPath();
    ctx.ellipse(x, y, w / 2, h / 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.beginPath();
    ctx.arc(x - w * 0.45, y + h * 0.1, h * 0.35, 0, Math.PI * 2);
    ctx.fill();

    // Horns
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x - w * 0.45, y);
    ctx.quadraticCurveTo(x - w * 0.55, y - h * 0.4, x - w * 0.62, y - h * 0.3);
    ctx.stroke();

    // Legs
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#1c1917';
    ctx.beginPath();
    ctx.moveTo(x - w * 0.25, y + h * 0.3);
    ctx.lineTo(x - w * 0.25, y + h * 0.6);
    ctx.moveTo(x + w * 0.25, y + h * 0.3);
    ctx.lineTo(x + w * 0.25, y + h * 0.6);
    ctx.stroke();
    ctx.restore();
  }

  private drawDanxiaStrata(w: number, h: number) {
    const ctx = this.ctx;
    ctx.save();
    // Multi-colored rainbow mineral stripes
    const bands = [
      '#991b1b', // brick red
      '#ea580c', // burnt orange
      '#ca8a04', // ochre yellow
      '#15803d', // celadon green mineral
      '#7c2d12', // deep terracotta
    ];

    bands.forEach((color, idx) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      const baseY = h * (0.46 + idx * 0.035);
      ctx.moveTo(0, baseY);
      for (let x = 0; x <= w; x += 40) {
        const wave = Math.sin((x / w) * 8 + idx) * 14 + Math.cos((x / w) * 4) * 8;
        ctx.lineTo(x, baseY + wave);
      }
      ctx.lineTo(w, h * 0.7);
      ctx.lineTo(0, h * 0.7);
      ctx.closePath();
      ctx.fill();
    });
    ctx.restore();
  }

  private drawBeaconTower(x: number, y: number, w: number, h: number) {
    const ctx = this.ctx;
    ctx.save();
    // Ancient rammed earth fortress/beacon tower
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.moveTo(x - w * 0.4, y + h);
    ctx.lineTo(x + w * 0.4, y + h);
    ctx.lineTo(x + w * 0.32, y);
    ctx.lineTo(x - w * 0.32, y);
    ctx.closePath();
    ctx.fill();

    // Crenellations (battlements)
    ctx.fillStyle = '#78350f';
    for (let i = -2; i <= 2; i += 2) {
      ctx.fillRect(x + i * 8 - 4, y - 6, 8, 7);
    }

    // Observation slit / arch
    ctx.fillStyle = '#451a03';
    ctx.fillRect(x - 5, y + h * 0.25, 10, 16);
    ctx.restore();
  }

  private drawSprucePines(w: number, h: number) {
    const ctx = this.ctx;
    const treePositions = [
      { x: w * 0.08, y: h * 0.54, scale: 0.9 },
      { x: w * 0.16, y: h * 0.52, scale: 1.1 },
      { x: w * 0.24, y: h * 0.56, scale: 0.8 },
      { x: w * 0.72, y: h * 0.52, scale: 1.15 },
      { x: w * 0.82, y: h * 0.55, scale: 1.0 },
      { x: w * 0.91, y: h * 0.51, scale: 1.25 },
    ];

    treePositions.forEach((tree) => {
      this.drawSpruceTree(tree.x, tree.y, 44 * tree.scale, 85 * tree.scale);
    });
  }

  private drawSpruceTree(x: number, y: number, w: number, h: number) {
    const ctx = this.ctx;
    ctx.save();
    // Trunk
    ctx.fillStyle = '#3e2723';
    ctx.fillRect(x - w * 0.1, y + h * 0.6, w * 0.2, h * 0.4);

    // Multi-tiered evergreen needle tiers
    const tiers = 4;
    for (let i = 0; i < tiers; i++) {
      const tierWidth = w * (0.35 + (i / tiers) * 0.65);
      const tierHeight = h * 0.35;
      const tierY = y + i * (h * 0.18);

      ctx.fillStyle = '#1e3a29'; // deep spruce green
      ctx.beginPath();
      ctx.moveTo(x, tierY - tierHeight * 0.3);
      ctx.lineTo(x + tierWidth / 2, tierY + tierHeight * 0.7);
      ctx.lineTo(x - tierWidth / 2, tierY + tierHeight * 0.7);
      ctx.closePath();
      ctx.fill();

      // Snow cover on branches
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.moveTo(x, tierY - tierHeight * 0.3);
      ctx.lineTo(x + tierWidth / 2, tierY + tierHeight * 0.45);
      ctx.lineTo(x - tierWidth / 2, tierY + tierHeight * 0.45);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  private drawGlacialIceWall(w: number, h: number) {
    const ctx = this.ctx;
    ctx.save();
    // Towering Bayi Glacier wall
    const grad = ctx.createLinearGradient(0, h * 0.4, 0, h * 0.68);
    grad.addColorStop(0, '#e0f2fe');
    grad.addColorStop(0.4, '#7dd3fc');
    grad.addColorStop(1, '#0284c7');
    ctx.fillStyle = grad;

    ctx.beginPath();
    ctx.moveTo(0, h * 0.48);
    for (let x = 0; x <= w; x += 30) {
      const jagged = Math.sin(x * 0.05) * 12 + Math.cos(x * 0.1) * 8;
      ctx.lineTo(x, h * 0.45 + jagged);
    }
    ctx.lineTo(w, h * 0.7);
    ctx.lineTo(0, h * 0.7);
    ctx.closePath();
    ctx.fill();

    // Crystal ice fissures
    ctx.strokeStyle = '#bae6fd';
    ctx.lineWidth = 2;
    for (let i = 1; i <= 6; i++) {
      ctx.beginPath();
      const fx = (w * i) / 7;
      ctx.moveTo(fx, h * 0.46);
      ctx.lineTo(fx + 10, h * 0.54);
      ctx.lineTo(fx - 6, h * 0.65);
      ctx.stroke();
    }
    ctx.restore();
  }

  private drawGround(zone: ZoneConfig, w: number, h: number) {
    const ctx = this.ctx;
    ctx.save();
    const groundY = h * 0.62;

    const grad = ctx.createLinearGradient(0, groundY, 0, h);
    grad.addColorStop(0, zone.bgPalette.ground);
    grad.addColorStop(1, '#1c1917');
    ctx.fillStyle = grad;
    ctx.fillRect(0, groundY, w, h - groundY);

    // Trail / Pathway curve
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 28;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.75);
    ctx.bezierCurveTo(w * 0.3, h * 0.78, w * 0.7, h * 0.72, w, h * 0.76);
    ctx.stroke();

    // Natural landscape ground details:
    if (zone.id === 'meadow') {
      // Grass tufts & yellow alpine poppies
      ctx.fillStyle = '#eab308';
      for (let i = 0; i < 20; i++) {
        const gx = ((i * 47) % (w - 40)) + 20;
        const gy = groundY + ((i * 31) % (h - groundY - 40)) + 15;
        ctx.beginPath();
        ctx.arc(gx, gy, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (zone.id === 'forest' || zone.id === 'glacier') {
      // Deep snow patches
      ctx.fillStyle = 'rgba(248, 250, 252, 0.85)';
      for (let i = 0; i < 15; i++) {
        const sx = ((i * 63) % (w - 80)) + 40;
        const sy = groundY + ((i * 29) % (h - groundY - 30)) + 10;
        ctx.beginPath();
        ctx.ellipse(sx, sy, 22, 6, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  private drawObjects(objects: InteractiveObject[], zoneId: ZoneId, isListening: boolean) {
    const ctx = this.ctx;

    objects.forEach((obj) => {
      if (obj.zone !== zoneId) return;

      // Hidden objects only visible during listening or once revealed
      if (obj.discoveredOnlyByListening && !obj.revealed && !isListening) {
        return;
      }

      ctx.save();
      const cx = obj.x;
      const cy = obj.y;

      if (obj.type === 'campfire') {
        // Campfire
        this.drawCampfire(cx, cy, obj.lit ?? false);
      } else if (obj.type === 'prayer_cairn') {
        // Mani Stone Cairn
        this.drawManiCairn(cx, cy);
      } else if (obj.type === 'stele') {
        // Ancient Stone Stele / Monument
        this.drawStele(cx, cy, obj.id === 'glacier_altar');
      } else if (obj.type === 'chest') {
        // Ancient Bronze Relic Chest
        this.drawBronzeChest(cx, cy, obj.collected ?? false, isListening);
      } else if (obj.type === 'herb') {
        // Snow Lotus
        this.drawSnowLotus(cx, cy, obj.collected ?? false, isListening);
      } else if (obj.type === 'passage') {
        // Mountain Pass marker / archway
        this.drawPassageMarker(cx, cy, obj.name);
      }
      ctx.restore();
    });
  }

  private drawCampfire(x: number, y: number, lit: boolean) {
    const ctx = this.ctx;
    // Stones encircling fire
    ctx.fillStyle = '#57534e';
    for (let i = 0; i < 7; i++) {
      const angle = (i / 7) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(x + Math.cos(angle) * 18, y + Math.sin(angle) * 10, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Wood logs
    ctx.strokeStyle = '#44403c';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x - 14, y + 4);
    ctx.lineTo(x + 14, y - 4);
    ctx.moveTo(x - 14, y - 4);
    ctx.lineTo(x + 14, y + 4);
    ctx.stroke();

    if (lit) {
      // Dynamic warm light cast
      const glow = ctx.createRadialGradient(x, y, 4, x, y, 110);
      glow.addColorStop(0, 'rgba(249, 115, 22, 0.45)');
      glow.addColorStop(0.6, 'rgba(234, 88, 12, 0.15)');
      glow.addColorStop(1, 'rgba(234, 88, 12, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, 110, 0, Math.PI * 2);
      ctx.fill();

      // Flickering fire core
      const flicker = Math.sin(this.time * 18) * 3;
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.moveTo(x - 10, y + 2);
      ctx.quadraticCurveTo(x, y - 28 + flicker, x + 10, y + 2);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.moveTo(x - 5, y + 2);
      ctx.quadraticCurveTo(x, y - 16 + flicker * 0.7, x + 5, y + 2);
      ctx.closePath();
      ctx.fill();

      // Sparks
      ctx.fillStyle = '#f59e0b';
      for (let s = 0; s < 3; s++) {
        const sparkOffset = (this.time * 40 + s * 30) % 45;
        const sx = x + Math.sin(this.time * 5 + s) * 8;
        const sy = y - sparkOffset;
        ctx.beginPath();
        ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      // Unlit / cold campfire ashes
      ctx.fillStyle = '#292524';
      ctx.beginPath();
      ctx.arc(x, y, 9, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private drawManiCairn(x: number, y: number) {
    const ctx = this.ctx;
    // Stacked slate stones
    ctx.fillStyle = '#78716c';
    ctx.beginPath();
    ctx.ellipse(x, y + 8, 20, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#a8a29e';
    ctx.beginPath();
    ctx.ellipse(x, y, 15, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e7e5e4';
    ctx.beginPath();
    ctx.ellipse(x, y - 7, 10, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Small willow stick with white khata (哈达)
    ctx.strokeStyle = '#d6d3d1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y - 12);
    ctx.lineTo(x, y - 24);
    ctx.stroke();

    // White silk prayer scarf fluttering
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(x, y - 22);
    ctx.quadraticCurveTo(x + 10, y - 20 + Math.sin(this.time * 4) * 3, x + 16, y - 16);
    ctx.lineTo(x + 10, y - 12);
    ctx.closePath();
    ctx.fill();
  }

  private drawStele(x: number, y: number, isAltar: boolean) {
    const ctx = this.ctx;
    if (isAltar) {
      // Glacial Eye Mandala Altar
      const aura = ctx.createRadialGradient(x, y, 8, x, y, 65);
      aura.addColorStop(0, 'rgba(56, 189, 248, 0.6)');
      aura.addColorStop(0.7, 'rgba(14, 165, 233, 0.2)');
      aura.addColorStop(1, 'rgba(14, 165, 233, 0)');
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(x, y, 65, 0, Math.PI * 2);
      ctx.fill();

      // Rotating sacred mandala rings
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 26, 0, Math.PI * 2);
      ctx.stroke();

      // Floating crystal shards
      for (let i = 0; i < 4; i++) {
        const angle = (this.time * 0.8 + (i * Math.PI) / 2) % (Math.PI * 2);
        const sx = x + Math.cos(angle) * 32;
        const sy = y + Math.sin(angle) * 16;
        ctx.fillStyle = '#e0f2fe';
        ctx.beginPath();
        ctx.moveTo(sx, sy - 8);
        ctx.lineTo(sx + 5, sy);
        ctx.lineTo(sx, sy + 8);
        ctx.lineTo(sx - 5, sy);
        ctx.closePath();
        ctx.fill();
      }
    } else {
      // Han Dynasty Stone Stele
      ctx.fillStyle = '#44403c';
      ctx.fillRect(x - 14, y - 24, 28, 38);
      // Carved head of stele
      ctx.beginPath();
      ctx.arc(x, y - 24, 14, Math.PI, 0);
      ctx.fill();

      // Inscribed horizontal lines
      ctx.strokeStyle = '#78716c';
      ctx.lineWidth = 1.5;
      for (let l = -14; l <= 6; l += 6) {
        ctx.beginPath();
        ctx.moveTo(x - 8, y + l);
        ctx.lineTo(x + 8, y + l);
        ctx.stroke();
      }
    }
  }

  private drawBronzeChest(x: number, y: number, collected: boolean, isListening: boolean) {
    const ctx = this.ctx;
    if (collected) return;

    if (isListening) {
      // Golden spiritual beacon
      ctx.fillStyle = 'rgba(250, 204, 21, 0.4)';
      ctx.beginPath();
      ctx.arc(x, y, 28 + Math.sin(this.time * 6) * 6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Bronze chest body
    ctx.fillStyle = '#059669'; // bronze patina green
    ctx.fillRect(x - 14, y - 10, 28, 18);
    // Gold trim
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 2;
    ctx.strokeRect(x - 14, y - 10, 28, 18);

    // Lock
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(x, y - 1, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawSnowLotus(x: number, y: number, collected: boolean, isListening: boolean) {
    const ctx = this.ctx;
    if (collected) return;

    if (isListening) {
      // Cyan radiant aura
      ctx.fillStyle = 'rgba(56, 189, 248, 0.5)';
      ctx.beginPath();
      ctx.arc(x, y, 24 + Math.sin(this.time * 8) * 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Sacred Snow Lotus petals
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1;
    for (let p = 0; p < 8; p++) {
      const angle = (p / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.ellipse(x + Math.cos(angle) * 7, y + Math.sin(angle) * 7, 7, 3, angle, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    // Golden center
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawPassageMarker(x: number, y: number, name: string) {
    const ctx = this.ctx;
    // Ancient stone road marker
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.ellipse(x, y, 22, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Floating destination indicator
    const floatY = y - 30 + Math.sin(this.time * 3) * 4;
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.moveTo(x, floatY + 8);
    ctx.lineTo(x - 6, floatY);
    ctx.lineTo(x + 6, floatY);
    ctx.closePath();
    ctx.fill();
  }

  private drawNPCs(npcs: NPC[], currentZone: ZoneId) {
    const ctx = this.ctx;

    npcs.forEach((npc) => {
      if (npc.zone !== currentZone) return;

      ctx.save();
      const x = npc.x;
      const y = npc.y;

      if (npc.id === 'mountain_spirit') {
        // Sacred Mountain Spirit Snow Leopard
        this.drawSnowLeopardSpirit(x, y);
      } else {
        // Human NPCs (Abudu, Stonekeeper, Zhuoma)
        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(x, y + 16, 16, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        // Cloak / Robe
        ctx.fillStyle = npc.avatarColor;
        ctx.beginPath();
        ctx.moveTo(x - 12, y + 16);
        ctx.lineTo(x + 12, y + 16);
        ctx.lineTo(x + 8, y - 8);
        ctx.lineTo(x - 8, y - 8);
        ctx.closePath();
        ctx.fill();

        // Fur collar
        ctx.fillStyle = '#f1f5f9';
        ctx.beginPath();
        ctx.ellipse(x, y - 8, 11, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Head
        ctx.fillStyle = '#fed7aa';
        ctx.beginPath();
        ctx.arc(x, y - 17, 8, 0, Math.PI * 2);
        ctx.fill();

        // Hat / Headwear
        if (npc.id === 'abudu') {
          // Traditional wool herder cap
          ctx.fillStyle = '#78350f';
          ctx.beginPath();
          ctx.arc(x, y - 21, 8.5, Math.PI, 0);
          ctx.fill();
        } else if (npc.id === 'zhuoma') {
          // Braid & head ornament
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.arc(x, y - 20, 8, Math.PI, 0);
          ctx.fill();
          // Turquoise bead
          ctx.fillStyle = '#06b6d4';
          ctx.beginPath();
          ctx.arc(x, y - 22, 3, 0, Math.PI * 2);
          ctx.fill();
        }

        // Name tag & dialog prompt indicator
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(npc.name, x, y - 32);

        // Interaction bubble [E]
        const bob = Math.sin(this.time * 4) * 3;
        ctx.fillStyle = 'rgba(250, 204, 21, 0.9)';
        ctx.fillRect(x - 12, y - 56 + bob, 24, 18);
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 11px system-ui, sans-serif';
        ctx.fillText('E', x, y - 43 + bob);
      }
      ctx.restore();
    });
  }

  private drawSnowLeopardSpirit(x: number, y: number) {
    const ctx = this.ctx;
    ctx.save();
    // Ethereal glowing aura
    const glow = ctx.createRadialGradient(x, y, 10, x, y, 65);
    glow.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
    glow.addColorStop(1, 'rgba(56, 189, 248, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, 65, 0, Math.PI * 2);
    ctx.fill();

    // Snow Leopard Body (ethereal snow white with blue rosettes)
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.ellipse(x, y, 32, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Majestic head
    ctx.beginPath();
    ctx.arc(x - 28, y - 6, 14, 0, Math.PI * 2);
    ctx.fill();

    // Ears
    ctx.beginPath();
    ctx.moveTo(x - 34, y - 18);
    ctx.lineTo(x - 28, y - 18);
    ctx.lineTo(x - 31, y - 26);
    ctx.closePath();
    ctx.fill();

    // Glowing turquoise eyes
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(x - 32, y - 7, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Long furry tail with gentle curl
    const tailCurl = Math.sin(this.time * 2.5) * 5;
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(x + 28, y);
    ctx.quadraticCurveTo(x + 46, y - 8 + tailCurl, x + 54, y - 22 + tailCurl);
    ctx.stroke();

    // Name tag
    ctx.fillStyle = '#e0f2fe';
    ctx.font = 'bold 13px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('祁连山神 · 傲雪', x, y - 36);

    ctx.restore();
  }

  private drawPlayer(player: PlayerState) {
    const ctx = this.ctx;
    ctx.save();
    const x = player.x;
    const y = player.y;

    // Shiver effect when freezing (<33.5°C)
    let shiverX = 0;
    if (player.bodyTemp < 34.0) {
      shiverX = (Math.random() - 0.5) * 2.5;
    }

    const px = x + shiverX;

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(px, y + 18, 14, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Legs animation
    const walkCycle = player.moving ? Math.sin(this.time * 12) * 6 : 0;
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(px - 4, y + 10);
    ctx.lineTo(px - 4 + walkCycle, y + 18);
    ctx.moveTo(px + 4, y + 10);
    ctx.lineTo(px + 4 - walkCycle, y + 18);
    ctx.stroke();

    // Mountain Wanderer Cloak (Traditional traveler teal/indigo robes)
    ctx.fillStyle = '#0f766e';
    ctx.beginPath();
    ctx.moveTo(px - 11, y + 12);
    ctx.lineTo(px + 11, y + 12);
    ctx.lineTo(px + 7, y - 8);
    ctx.lineTo(px - 7, y - 8);
    ctx.closePath();
    ctx.fill();

    // Fur-lined warm collar
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.ellipse(px, y - 8, 10, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Face / head
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.arc(px, y - 16, 7.5, 0, Math.PI * 2);
    ctx.fill();

    // Bamboo Hat (斗笠 / 笠帽)
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.moveTo(px - 17, y - 18);
    ctx.lineTo(px + 17, y - 18);
    ctx.lineTo(px, y - 27);
    ctx.closePath();
    ctx.fill();

    // Bamboo hat top rim
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Walking staff in hand
    ctx.strokeStyle = '#92400e';
    ctx.lineWidth = 2.5;
    const staffX = player.direction === 'left' ? px - 14 : px + 14;
    ctx.beginPath();
    ctx.moveTo(staffX, y - 14);
    ctx.lineTo(staffX, y + 18);
    ctx.stroke();

    // Breath vapor puff in cold air
    if (Math.sin(this.time * 2) > 0.4) {
      const breathOffset = (this.time * 20) % 25;
      const dirMult = player.direction === 'left' ? -1 : 1;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.arc(px + 8 * dirMult + breathOffset * 0.4 * dirMult, y - 16 - breathOffset * 0.2, 3 + breathOffset * 0.15, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  private drawListeningEffect(player: PlayerState, objects: InteractiveObject[], w: number, h: number) {
    const ctx = this.ctx;
    ctx.save();

    // Expanding concentric ripples of mountain insight
    const maxRadius = player.listeningRadius;
    const rippleCount = 3;

    for (let r = 0; r < rippleCount; r++) {
      const currentR = ((this.time * 120 + r * (maxRadius / rippleCount)) % maxRadius);
      const alpha = 1 - currentR / maxRadius;

      ctx.strokeStyle = `rgba(56, 189, 248, ${alpha * 0.8})`;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(player.x, player.y, currentR, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Sacred golden ley lines radiating through the earth
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 6]);
    objects.forEach((obj) => {
      if (obj.zone === player.zone) {
        ctx.beginPath();
        ctx.moveTo(player.x, player.y);
        ctx.lineTo(obj.x, obj.y);
        ctx.stroke();
      }
    });
    ctx.setLineDash([]);

    // Listening focus overlay text
    ctx.fillStyle = 'rgba(240, 249, 255, 0.9)';
    ctx.font = '14px serif, "Noto Serif SC", STSong, SimSun';
    ctx.textAlign = 'center';
    ctx.fillText('—— 听山凝息 · 万仞地脉尽在耳畔 ——', w / 2, 45);

    ctx.restore();
  }

  private drawWeather(weather: WeatherType, w: number, h: number) {
    const ctx = this.ctx;
    ctx.save();

    const speedMultiplier = weather === 'blizzard' ? 2.8 : weather === 'light_snow' ? 1.0 : 0.5;
    const windPush = weather === 'blizzard' ? -3.5 : -0.8;

    this.snowflakes.forEach((flake) => {
      flake.y += flake.speedY * speedMultiplier;
      flake.x += flake.speedX + windPush;

      if (flake.y > h) {
        flake.y = -10;
        flake.x = Math.random() * (w + 200);
      }
      if (flake.x < -20) {
        flake.x = w + 20;
      }

      ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
      ctx.beginPath();
      ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
      ctx.fill();
    });

    if (weather === 'blizzard') {
      // Wind streaks & whiteout fog
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 20; i++) {
        const sx = ((this.time * 500 + i * 97) % (w + 300)) - 100;
        const sy = (i * 37) % h;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx - 70, sy + 18);
        ctx.stroke();
      }
    }

    if (weather === 'mist') {
      // Atmospheric mountain mist bands
      ctx.fillStyle = 'rgba(226, 232, 240, 0.18)';
      for (let m = 0; m < 3; m++) {
        const mistY = h * (0.35 + m * 0.18);
        ctx.fillRect(0, mistY + Math.sin(this.time + m) * 10, w, 40);
      }
    }

    ctx.restore();
  }

  private drawFrostVignette(temp: number, w: number, h: number) {
    const ctx = this.ctx;
    ctx.save();
    // Severity from 0 (35.0°C) to 1 (30.0°C)
    const severity = Math.min(1, Math.max(0, (35.0 - temp) / 5.0));

    // Radial blue-white frost vignette
    const vignette = ctx.createRadialGradient(w / 2, h / 2, w * 0.35, w / 2, h / 2, w * 0.7);
    vignette.addColorStop(0, 'rgba(186, 230, 253, 0)');
    vignette.addColorStop(0.7, `rgba(56, 189, 248, ${0.25 * severity})`);
    vignette.addColorStop(1, `rgba(224, 242, 254, ${0.75 * severity})`);

    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, w, h);

    // Shivering warning message at critical temp
    if (temp <= 32.5) {
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 16px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('【严寒侵蚀】体温极低！行动迟缓，请立即寻觅营火取暖或饮用热茶！', w / 2, h - 35);
    }
    ctx.restore();
  }
}
