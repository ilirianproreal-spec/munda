import type { Led, MaterialId, FiberConfigId } from '../types';
import { MATERIALS, FIBER_CONFIGS } from '../data/lab';

export interface LabMetrics {
  uniformity: number; // 0..100
  energy: number; // 0..100
  cost: number; // 0..100
  design: number; // 0..100
  manufacturability: number; // 0..100
  total: number; // 0..100 (weighted)
}

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

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
  return 58 * spread * (0.5 + 0.7 * (led.intensity / 100));
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

  // uniformity: how evenly light spreads across the lit region,
  // scaled by how much of the panel is actually lit
  const litValues = values.filter((v) => v > 0.02);
  const litCount = litValues.length;
  let evenness = 0;
  if (litCount > 1) {
    const litMean = litValues.reduce((a, b) => a + b, 0) / litCount;
    const litSd = Math.sqrt(
      litValues.reduce((a, b) => a + (b - litMean) ** 2, 0) / litCount,
    );
    evenness = 100 * Math.max(0, 1 - litSd / litMean);
  }
  const uniformity = clamp(coverage * evenness * 1.5, 0, 100);

  /* — raw engineering values — */
  const totalLumens = leds.reduce((s, l) => s + 420 * (0.2 + 0.8 * (l.intensity / 100)), 0);
  const powerW = leds.reduce((s, l) => s + 0.35 + 2.3 * (l.intensity / 100), 0) + fib.power;
  const costEur = leds.length * 5.9 + mat.cost + fib.cost;

  /* — metric scores — */
  const energy = clamp((totalLumens / Math.max(0.1, powerW)) / 180, 0, 1) * 100;
  const cost = clamp((130 - costEur) / 112, 0, 1) * 100;
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

  return { uniformity, energy, cost, design, manufacturability, total };
}
