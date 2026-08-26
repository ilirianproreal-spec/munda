import type { LightDesign } from '../store/designStore';

/**
 * The light-guide shapes, drawn in the door's 400×640 viewBox.
 * The lab currently renders the mid guide; the set stays available
 * for shape experiments without UI clutter.
 */
export interface ShapeDef {
  id: string;
  d: string;
  axis: 'x' | 'y' | null;
  range: [number, number];
}

export const SHAPES: ShapeDef[] = [
  { id: 'top', d: 'M 78 92 Q 200 66 322 92', axis: 'y', range: [-14, 40] },
  { id: 'mid', d: 'M 78 296 Q 200 272 322 296', axis: 'y', range: [-40, 52] },
  { id: 'lower', d: 'M 78 556 Q 200 540 322 556', axis: 'y', range: [-24, 28] },
  { id: 'left', d: 'M 88 70 Q 76 320 92 580', axis: 'x', range: [-12, 40] },
  { id: 'diag', d: 'M 84 120 C 180 260, 230 400, 316 570', axis: 'x', range: [-20, 46] },
];

/** The guide currently shown on the door. */
export const GUIDE = SHAPES[1]; // mid

/** Second guide — a shorter segment lower-right, like the two-piece textile light. */
export const GUIDE2 = { id: 'low-right', d: 'M 196 452 Q 260 438 322 448', axis: null, range: [0, 0] } as const;

/** Position 0..100 → translate applied to the guide group. */
export function shapeTranslate(s: ShapeDef, position: number): { x: number; y: number } {
  if (!s.axis) return { x: 0, y: 0 };
  const [min, max] = s.range;
  const v = min + (max - min) * (position / 100);
  return s.axis === 'x' ? { x: v, y: 0 } : { x: 0, y: v };
}

/** Exact path length, measured once per path and cached. */
const lenCache = new Map<string, number>();
export function pathLength(d: string): number {
  const cached = lenCache.get(d);
  if (cached !== undefined) return cached;
  const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  p.setAttribute('d', d);
  const len = p.getTotalLength();
  lenCache.set(d, len);
  return len;
}

/** Effect cycle duration (s) from the speed slider (0..100). */
export function effectDuration(effect: LightDesign['effect'], speed: number): number {
  const s = speed / 100;
  switch (effect) {
    case 'pulse':
      return 3.0 - s * 2.2;
    case 'wave':
      return 4.0 - s * 2.8;
    case 'glow':
      return 3.6 - s * 2.6;
    case 'flash':
      return 1.8 - s * 1.4;
    default:
      return 0;
  }
}
