import * as THREE from 'three';
import { getWaveGradient } from './proceduralTextures';

/**
 * The textile-light layer of the scene, kept fully separate from the rest
 * so the control panel drives colour / brightness / intensity / effect /
 * speed independently. The LabPanel writes straight into `lightLayer`;
 * LabScene3D calls `syncLightLayer` every frame, so changes apply
 * immediately — no wiring required in the panel.
 */

export type LightEffect = 'static' | 'pulse' | 'wave' | 'glow' | 'flash';

export const lightLayer = {
  color: new THREE.Color('#ffffff'),
  enabled: true,
  /** 0..1 — overall brightness. */
  brightness: 0.8,
  /** 0..1 — LED intensity (halo strength). */
  intensity: 0.5,
  effect: 'static' as LightEffect,
  /** 0..100 — effect speed. */
  speed: 50,
};

type StripKind = 'strip' | 'spill';
const strips: { mesh: THREE.Mesh; kind: StripKind }[] = [];

/** Register an emissive light strip or spill plane (idempotent). */
export function registerStrip(m: THREE.Mesh, kind: StripKind = 'strip') {
  if (!strips.some((s) => s.mesh === m)) strips.push({ mesh: m, kind });
}

/** Effect envelope at time t (s). Speed 0..100 → 0.5..3.1 Hz. */
function effectFactor(effect: LightEffect, speed: number, t: number): number {
  const f = 0.5 + (speed / 100) * 2.6;
  switch (effect) {
    case 'pulse':
      return 0.08 + 0.92 * (0.5 + 0.5 * Math.sin(2 * Math.PI * f * t));
    case 'glow':
      return 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(2 * Math.PI * f * 0.45 * t));
    case 'flash': {
      const p = (t * f) % 1;
      return p < 0.28 ? 1 : 0.05;
    }
    case 'wave':
      return 1; // handled by the travelling emissive band below
    default:
      return 1; // static
  }
}

/** Shared travelling-band texture for the wave effect. */
const waveMap = getWaveGradient();

/** Push colour / intensity / effect into every registered strip. Call every frame. */
export function syncLightLayer(t: number, dt: number) {
  const on = lightLayer.enabled;
  const base = on ? (0.3 + 2.2 * lightLayer.intensity) * (0.35 + 0.65 * lightLayer.brightness) : 0;
  const mod = effectFactor(lightLayer.effect, lightLayer.speed, t);
  const isWave = lightLayer.effect === 'wave';
  const stripE = base * mod * (isWave ? 4.2 : 1);
  const spillE = base * 0.22 * (isWave ? 0.65 : mod);

  for (const { mesh, kind } of strips) {
    const m = mesh.material as THREE.MeshStandardMaterial;
    m.emissive.copy(lightLayer.color);
    m.color.copy(lightLayer.color);

    if (kind === 'spill') {
      // soft bleed on the textile — follows colour/pulse but never waves
      m.emissiveIntensity = spillE;
      continue;
    }

    m.emissiveIntensity = stripE;
    if (isWave) {
      if (m.emissiveMap !== waveMap) {
        m.emissiveMap = waveMap;
        m.needsUpdate = true;
      }
      waveMap.offset.x -= dt * (0.7 + (lightLayer.speed / 100) * 2.8);
    } else if (m.emissiveMap) {
      m.emissiveMap = null;
      m.needsUpdate = true;
    }
  }
}
