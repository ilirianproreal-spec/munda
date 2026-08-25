import type { Led, MaterialId, FiberConfigId } from '../types';
import { MATERIALS, FIBER_CONFIGS } from '../data/lab';

export interface LabStats {
  ledCount: number;
  totalLumens: number;
  powerW: number;
  costEur: number;
  coverage: number; // 0..1
  grade: string;
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
  // rounded corners
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

export function computeStats(
  leds: Led[],
  material: MaterialId,
  fiber: FiberConfigId,
): LabStats {
  const mat = MATERIALS.find((m) => m.id === material) ?? MATERIALS[0];
  const fib = FIBER_CONFIGS.find((f) => f.id === fiber) ?? FIBER_CONFIGS[0];

  const totalLumens = leds.reduce(
    (s, l) => s + 420 * (0.2 + 0.8 * (l.intensity / 100)),
    0,
  );
  const powerW = leds.reduce((s, l) => s + 0.35 + 2.3 * (l.intensity / 100), 0) + fib.power;
  const costEur = leds.length * 5.9 + mat.cost + fib.cost;

  // coverage: sampled grid over the panel, lit if within an LED's falloff
  let lit = 0;
  let total = 0;
  for (let y = MIN_Y + 8; y <= MAX_Y - 8; y += 14) {
    for (let x = MIN_X + 8; x <= MAX_X - 8; x += 14) {
      if (!insidePanel(x, y)) continue;
      total++;
      const isLit = leds.some((l) => {
        const dx = l.x - x;
        const dy = l.y - y;
        return dx * dx + dy * dy <= ledRadius(l, mat.spread) ** 2;
      });
      if (isLit) lit++;
    }
  }
  const coverage = total === 0 ? 0 : lit / total;
  const grade =
    coverage >= 0.85 ? 'A' : coverage >= 0.7 ? 'B' : coverage >= 0.55 ? 'C' : coverage >= 0.4 ? 'D' : 'F';

  return { ledCount: leds.length, totalLumens, powerW, costEur, coverage, grade };
}
