import * as THREE from 'three';

/**
 * Procedural textures — generated once, cached, no network assets.
 * Keeps the 3D scene fully offline and lightweight.
 */

let _fabric: THREE.CanvasTexture | null = null;
let _grille: THREE.CanvasTexture | null = null;

/** Dark automotive textile weave with subtle noise. Cached singleton. */
export function getFabric(): THREE.CanvasTexture {
  if (_fabric) return _fabric;
  const size = 256;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;

  // base
  ctx.fillStyle = '#101018';
  ctx.fillRect(0, 0, size, size);

  // horizontal threads
  for (let y = 0; y < size; y += 6) {
    ctx.fillStyle = y % 12 === 0 ? '#15151f' : '#0c0c12';
    ctx.fillRect(0, y, size, 3);
  }
  // vertical threads
  for (let x = 0; x < size; x += 6) {
    ctx.fillStyle = x % 12 === 0 ? '#171721' : '#0d0d13';
    ctx.fillRect(x, 0, 3, size);
  }
  // fine noise
  for (let i = 0; i < 900; i++) {
    const v = 12 + Math.floor(Math.random() * 10);
    ctx.fillStyle = `rgba(${v},${v},${v + 4},0.35)`;
    ctx.fillRect(Math.random() * size, Math.random() * size, 1.4, 1.4);
  }

  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  _fabric = t;
  return t;
}

/** Speaker grille dot pattern. Cached singleton. */
export function getGrille(): THREE.CanvasTexture {
  if (_grille) return _grille;
  const size = 128;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;

  ctx.fillStyle = '#0b0b10';
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = 'rgba(255,255,255,0.28)';
  const r = 3;
  const step = 10;
  for (let y = step / 2; y < size; y += step) {
    for (let x = step / 2; x < size; x += step) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  // vignette
  const g = ctx.createRadialGradient(size / 2, size / 2, 18, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(1, 'rgba(0,0,0,0.55)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);

  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  _grille = t;
  return t;
}

/** Very dark radial backdrop (studio void). */
export function getBackdrop(): THREE.CanvasTexture {
  const size = 256;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 20, size / 2, size / 2, size / 2);
  g.addColorStop(0, '#0c0d16');
  g.addColorStop(0.6, '#08090f');
  g.addColorStop(1, '#05060a');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
