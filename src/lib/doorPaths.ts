import type { LightDesign, ShapeId } from '../store/designStore';
import { PANEL_PATH } from './light';

/**
 * The six light-guide shapes, drawn in the door's 400×640 viewBox.
 * Each has a slide axis (position control) and a translate range that
 * keeps the guide on the panel surface.
 */
export interface ShapeDef {
  id: ShapeId;
  d: string;
  /** axis the position slider slides along; null = fixed (wrap). */
  axis: 'x' | 'y' | null;
  range: [number, number];
}

export const SHAPES: ShapeDef[] = [
  { id: 'top', d: 'M 78 92 Q 200 66 322 92', axis: 'y', range: [-14, 40] },
  { id: 'mid', d: 'M 78 296 Q 200 272 322 296', axis: 'y', range: [-40, 52] },
  { id: 'lower', d: 'M 78 556 Q 200 540 322 556', axis: 'y', range: [-24, 28] },
  { id: 'left', d: 'M 88 70 Q 76 320 92 580', axis: 'x', range: [-12, 40] },
  { id: 'diag', d: 'M 84 120 C 180 260, 230 400, 316 570', axis: 'x', range: [-20, 46] },
  {
    id: 'wrap',
    d: 'M 64 88 L 336 88 Q 344 88 344 96 L 344 556 Q 344 564 336 564 L 64 564 Q 56 564 56 556 L 56 96 Q 56 88 64 88 Z',
    axis: null,
    range: [0, 0],
  },
];

export function shapeById(id: ShapeId): ShapeDef {
  return SHAPES.find((s) => s.id === id) ?? SHAPES[1];
}

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

/* ————————————————— door variant trim styles ————————————————— */

export const VARIANT_META: Record<
  LightDesign['door'],
  { texture: 'none' | 'textile' | 'carbon'; stitch: boolean; handle: 'thin' | 'chrome' | 'angle'; speakerH: number }
> = {
  '01': { texture: 'none', stitch: false, handle: 'thin', speakerH: 30 },
  '02': { texture: 'textile', stitch: true, handle: 'chrome', speakerH: 42 },
  '03': { texture: 'carbon', stitch: false, handle: 'angle', speakerH: 30 },
};

/* ————————————————— standalone SVG export (DOWNLOAD PREVIEW) ————————————————— */

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Self-contained front-view SVG of the door with the current light design. */
export function buildDoorSvg(d: LightDesign): string {
  const shape = shapeById(d.shape);
  const tr = shapeTranslate(shape, d.position);
  const total = pathLength(shape.d);
  const dashLen = (d.length / 100) * total;
  const b = d.brightness / 100;
  const on = d.power;
  const night = d.dayNight === 'night';
  const glowW = d.thickness * 2.2 + d.glow * 0.14;
  const glowO = Math.min(0.5, 0.16 * b + d.glow * 0.004 * b);
  const meta = VARIANT_META[d.door];
  const g = `translate(${tr.x} ${tr.y})`;
  const dash = `${dashLen.toFixed(1)} ${total.toFixed(1)}`;
  const core = Math.max(0.6, d.thickness * 0.32).toFixed(1);

  const pattern =
    meta.texture === 'textile'
      ? `<pattern id="tex" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M0 6 H12" stroke="rgba(255,255,255,0.06)" stroke-width="1"/><path d="M6 0 V12" stroke="rgba(255,255,255,0.04)" stroke-width="1"/></pattern>`
      : meta.texture === 'carbon'
        ? `<pattern id="tex" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 5 H10" stroke="rgba(255,255,255,0.055)" stroke-width="1"/></pattern>`
        : '';

  const stripPattern =
    on && d.pattern === 'flow'
      ? `<path d="${shape.d}" fill="none" stroke="#ffffff" stroke-width="${Math.max(1, d.thickness * 0.7)}" stroke-linecap="round" stroke-dasharray="10 ${dashLen.toFixed(1)}" opacity="0.85"><animate attributeName="stroke-dashoffset" from="0" to="${-dashLen.toFixed(1)}" dur="2.4s" repeatCount="indefinite"/></path>`
      : on && d.pattern === 'wave'
        ? `<path d="${shape.d}" fill="none" stroke="${esc(d.color)}" stroke-width="${(d.thickness * 2.4).toFixed(1)}" stroke-linecap="round" stroke-dasharray="${Math.max(24, dashLen * 0.35).toFixed(1)} ${dashLen.toFixed(1)}" opacity="0.5"><animate attributeName="stroke-dashoffset" from="0" to="${-dashLen.toFixed(1)}" dur="3.6s" repeatCount="indefinite"/></path>`
        : '';

  return `<svg viewBox="0 0 400 640" xmlns="http://www.w3.org/2000/svg" width="100%" style="max-width:460px;display:block;margin:0 auto;background:#050508">
<defs>${pattern}
<clipPath id="dc"><path d="${PANEL_PATH}"/></clipPath>
</defs>
<rect x="0" y="0" width="400" height="640" fill="#050508"/>
<path d="${PANEL_PATH}" fill="${night ? 'rgba(2,2,4,0.5)' : 'rgba(255,255,255,0.03)'}"/>
<path d="${PANEL_PATH}" fill="${meta.texture === 'none' ? 'rgba(22,22,28,0.9)' : 'url(#tex)'}" stroke="rgba(255,255,255,0.14)" stroke-width="1.2"/>
<g opacity="${night ? 0.75 : 1}">
${meta.stitch ? '<path d="M 90 26 L 310 26 Q 334 26 334 50 L 334 598 Q 334 622 310 622 L 90 622 Q 66 622 66 598 L 66 50 Q 66 26 90 26 Z" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1" stroke-dasharray="2 7"/>' : ''}
<rect x="252" y="150" width="58" height="20" rx="6" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.22)"/>
<rect x="262" y="156" width="38" height="8" rx="4" fill="${esc(d.color)}22" stroke="${esc(d.color)}33"/>
<rect x="96" y="404" width="208" height="${meta.speakerH}" rx="14" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)"/>
<circle cx="110" cy="520" r="26" stroke="rgba(255,255,255,0.12)" stroke-width="1" stroke-dasharray="1 3"/>
<circle cx="110" cy="520" r="16" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
<circle cx="110" cy="520" r="2.5" fill="rgba(255,255,255,0.18)"/>
</g>
<g clip-path="url(#dc)" transform="${g}">
<path d="${shape.d}" fill="none" stroke="${esc(d.color)}" stroke-width="${night ? 46 : 26}" stroke-linecap="round" opacity="${on ? ((night ? 0.1 : 0.04) * b).toFixed(3) : 0}"/>
<path d="${shape.d}" fill="none" stroke="${esc(d.color)}" stroke-width="${glowW.toFixed(1)}" stroke-linecap="round" opacity="${on ? glowO.toFixed(3) : 0}"/>
<path d="${shape.d}" fill="none" stroke="${esc(d.color)}" stroke-width="${d.thickness}" stroke-linecap="round" stroke-dasharray="${dash}" opacity="${on ? Math.max(0.25, b).toFixed(2) : 0}"/>
<path d="${shape.d}" fill="none" stroke="#ffffff" stroke-width="${core}" stroke-linecap="round" stroke-dasharray="${dash}" opacity="${on ? (0.6 * b).toFixed(2) : 0}"/>
${on && d.pattern === 'pulse' ? `<path d="${shape.d}" fill="none" stroke="${esc(d.color)}" stroke-width="${d.thickness}" stroke-linecap="round" stroke-dasharray="${dash}"><animate attributeName="opacity" values="0.35;1;0.35" dur="2.2s" repeatCount="indefinite"/></path>` : ''}
${stripPattern}
</g>
<text x="300" y="612" text-anchor="end" fill="rgba(255,255,255,0.22)" font-family="'JetBrains Mono',Consolas,monospace" font-size="8" letter-spacing="3">HERMES</text>
</svg>`;
}
