import type { Led, MaterialId, FiberConfigId } from '../types';
import { MATERIALS, FIBER_CONFIGS } from '../data/lab';
import type { TKey } from './translations';

/** Score → grade label. A level passes by meeting its objectives, not by score. */
export function gradeFor(total: number): TKey {
  if (total >= 90) return 'grade_master';
  if (total >= 80) return 'grade_excellent';
  if (total >= 70) return 'grade_good';
  if (total >= 60) return 'grade_passed';
  return 'grade_needs_improvement';
}

export interface LabMetrics {
  uniformity: number; // 0..100
  energy: number; // 0..100
  cost: number; // 0..100
  design: number; // 0..100
  manufacturability: number; // 0..100
  total: number; // 0..100 (weighted)
  /* raw values used by level criteria */
  ledCount: number;
  powerW: number;
  costEur: number;
  coverage: number; // 0..1
}

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** '#00e5ff' → [0, 229, 255]. Accepts 3- and 6-digit hex. */
export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const v = parseInt(n, 16);
  if (Number.isNaN(v) || n.length !== 6) return [0, 229, 255];
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

/** '#00e5ff' + alpha → 'rgba(0,229,255,a)'. */
export function rgba(hex: string, a: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
}

/* panel geometry (viewBox 0 0 400 640) */
const MIN_X = 60;
const MAX_X = 340;
const MIN_Y = 20;
const MAX_Y = 628;
const CORNER = 24;

export function insidePanel(x: number, y: number): boolean {
  if (x < MIN_X || x > MAX_X || y < MIN_Y || y > MAX_Y) return false;
  const corners: Array<[number, number]> = [
    [MIN_X, MIN_Y],
    [MAX_X, MIN_Y],
    [MIN_X, MAX_Y],
    [MAX_X, MAX_Y],
  ];
  for (const [cx, cy] of corners) {
    if (Math.abs(x - cx) < CORNER && Math.abs(y - cy) < CORNER) {
      if ((x - cx) ** 2 + (y - cy) ** 2 > CORNER * CORNER) return false;
    }
  }
  // handle cutout
  if (x > 250 && x < 310 && y > 150 && y < 172) return false;
  return true;
}

/** Glow radius of an LED on the panel, in viewBox units. */
export function ledRadius(led: Led, spread: number): number {
  return 80 * spread * (0.5 + 0.7 * (led.intensity / 100));
}

export const PANEL_PATH =
  'M 84 20 L 316 20 Q 340 20 340 44 L 340 604 Q 340 628 316 628 L 84 628 Q 60 628 60 604 L 60 44 Q 60 20 84 20 Z';

function strandControls(led: Led, ax: number, ay: number) {
  const dx = ax - led.x;
  const dy = ay - led.y;
  const len = Math.max(1, Math.hypot(dx, dy));
  const nx = -dy / len;
  const ny = dx / len;
  const bend = 14 + len * 0.12;
  return {
    c1x: led.x + dx * 0.35 + nx * bend,
    c1y: led.y + dy * 0.35 + ny * bend,
    c2x: ax - dx * 0.35 + nx * bend,
    c2y: ay - dy * 0.35 + ny * bend,
  };
}

/** Cubic-bezier fiber strand from an LED to an anchor point. */
export function strandPath(led: Led, a: { x: number; y: number }) {
  const { c1x, c1y, c2x, c2y } = strandControls(led, a.x, a.y);
  return `M ${led.x} ${led.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${a.x} ${a.y}`;
}

/** Point along the strand at parameter t (0..1). */
export function strandPoint(led: Led, ax: number, ay: number, t: number): [number, number] {
  const { c1x, c1y, c2x, c2y } = strandControls(led, ax, ay);
  const u = 1 - t;
  return [
    u * u * u * led.x + 3 * u * u * t * c1x + 3 * u * t * t * c2x + t * t * t * ax,
    u * u * u * led.y + 3 * u * u * t * c1y + 3 * u * t * t * c2y + t * t * t * ay,
  ];
}

const FIBER_PENALTY: Record<FiberConfigId, number> = {
  off: 0,
  linear: 6,
  distributed: 12,
  ring: 18,
};

const MATERIAL_PENALTY: Record<MaterialId, number> = {
  textile: 0,
  soft: 4,
  alu: 8,
  carbon: 10,
};

/**
 * Scores the current design on five 0–100 metrics plus a weighted total:
 * Uniformity 30% · Energy 20% · Cost 20% · Design 15% · Manufacturability 15%.
 * Everything is derived from the live design state (LEDs, material, fibers).
 */
export function computeMetrics(
  leds: Led[],
  material: MaterialId,
  fiber: FiberConfigId,
): LabMetrics {
  const mat = MATERIALS.find((m) => m.id === material) ?? MATERIALS[0];
  const fib = FIBER_CONFIGS.find((f) => f.id === fiber) ?? FIBER_CONFIGS[0];

  /* — light field sampling (same grid as the heatmap) — */
  const values: number[] = [];
  let lit = 0;
  for (let y = MIN_Y + 8; y <= MAX_Y - 8; y += 14) {
    for (let x = MIN_X + 8; x <= MAX_X - 8; x += 14) {
      if (!insidePanel(x, y)) continue;
      let v = 0;
      for (const l of leds) {
        const R = ledRadius(l, mat.spread);
        const d = Math.hypot(l.x - x, l.y - y);
        if (d < R) {
          const t = 1 - d / R;
          v += (l.intensity / 100) * t * t;
        }
      }
      const n = Math.min(1, v);
      values.push(n);
      if (n > 0.004) lit++;
    }
  }

  const sampleCount = values.length;
  const coverage = sampleCount === 0 ? 0 : lit / sampleCount;

  // uniformity: coverage-driven curve (calibrated so 3 well-placed
  // max-intensity LEDs on textile reach ~90%, and 1 LED sits ~30%)
  const uniformity = clamp(100 * Math.pow(coverage, 0.85) * 1.45, 0, 100);

  /* — raw engineering values — */
  const totalLumens = leds.reduce((s, l) => s + 420 * (0.2 + 0.8 * (l.intensity / 100)), 0);
  const powerW = leds.reduce((s, l) => s + 0.35 + 2.3 * (l.intensity / 100), 0) + fib.power;
  const costEur = leds.length * 5.9 + mat.cost + fib.cost;

  /* — metric scores — */
  const energy = clamp((totalLumens / Math.max(0.1, powerW)) / 185, 0, 1) * 100;
  const cost = clamp((160 - costEur) / 130, 0, 1) * 100;
  const design = clamp(0.55 * coverage * 100 + 0.45 * uniformity, 0, 100);
  const manufacturability = clamp(
    100 - Math.max(0, leds.length - 4) * 4 - FIBER_PENALTY[fiber] - MATERIAL_PENALTY[material],
    0,
    100,
  );

  const total = clamp(
    0.3 * uniformity + 0.2 * energy + 0.2 * cost + 0.15 * design + 0.15 * manufacturability,
    0,
    100,
  );

  return {
    uniformity,
    energy,
    cost,
    design,
    manufacturability,
    total,
    ledCount: leds.length,
    powerW,
    costEur,
    coverage,
  };
}
