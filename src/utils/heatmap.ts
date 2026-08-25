import type { Led } from '../types';
import { insidePanel, ledRadius } from './light';

/**
 * Gameplay light simulation: every LED contributes a smooth falloff field
 * (1 - d/R)^2, fields add up, and the sum is mapped to a heatmap palette:
 * no light → very dark, weak → purple, medium → blue, strong → cyan, max → white.
 * Not physically exact by design — tuned for readable gameplay feedback.
 */

const STOPS: Array<[number, [number, number, number]]> = [
  [0.0, [8, 6, 16]], // near-black
  [0.12, [42, 18, 80]], // dark purple
  [0.35, [124, 58, 237]], // purple
  [0.55, [37, 99, 235]], // blue
  [0.75, [0, 229, 255]], // cyan
  [1.0, [255, 255, 255]], // white
];

function buildLut(): Uint8ClampedArray {
  const lut = new Uint8ClampedArray(256 * 3);
  for (let i = 0; i < 256; i++) {
    const v = i / 255;
    let r = STOPS[0][1][0];
    let g = STOPS[0][1][1];
    let b = STOPS[0][1][2];
    for (let s = 0; s < STOPS.length - 1; s++) {
      const [v0, c0] = STOPS[s];
      const [v1, c1] = STOPS[s + 1];
      if (v >= v0 && v <= v1) {
        const t = (v - v0) / (v1 - v0);
        r = c0[0] + (c1[0] - c0[0]) * t;
        g = c0[1] + (c1[1] - c0[1]) * t;
        b = c0[2] + (c1[2] - c0[2]) * t;
        break;
      }
    }
    lut[i * 3] = r;
    lut[i * 3 + 1] = g;
    lut[i * 3 + 2] = b;
  }
  return lut;
}

const LUT = buildLut();

export function renderHeatmap(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  leds: Led[],
  spread: number,
  panelW: number,
  panelH: number,
) {
  const img = ctx.createImageData(w, h);
  const data = img.data;

  for (let py = 0; py < h; py++) {
    for (let px = 0; px < w; px++) {
      const idx = (py * w + px) * 4;
      const x = ((px + 0.5) / w) * panelW;
      const y = ((py + 0.5) / h) * panelH;
      if (!insidePanel(x, y)) continue; // outside the panel → transparent

      let v = 0;
      for (const led of leds) {
        const R = ledRadius(led, spread);
        const dx = x - led.x;
        const dy = y - led.y;
        const d = Math.hypot(dx, dy);
        if (d < R) {
          const t = 1 - d / R;
          v += (led.intensity / 100) * t * t;
        }
      }
      if (v <= 0.004) continue;

      const n = Math.min(1, v);
      const li = Math.round(n * 255);
      data[idx] = LUT[li * 3];
      data[idx + 1] = LUT[li * 3 + 1];
      data[idx + 2] = LUT[li * 3 + 2];
      data[idx + 3] = Math.round((0.3 + n * 0.7) * 255);
    }
  }

  ctx.putImageData(img, 0, 0);
}
