import * as THREE from 'three';

/**
 * The textile-light layer of the scene, kept fully separate from the rest
 * so phase 03 can drive colour / intensity / animation independently.
 *
 * Phase 03 (control panel) writes to `lightLayer`; LabScene3D syncs every
 * frame via LightSync, so any change is applied immediately — no wiring
 * required in the panel.
 */

export const lightLayer = {
  color: new THREE.Color('#ffffff'),
  intensity: 1.35,
  enabled: true,
};

const strips: THREE.Mesh[] = [];

/** Register an emissive light strip or spill plane (idempotent). */
export function registerStrip(m: THREE.Mesh) {
  if (!strips.includes(m)) strips.push(m);
}

/** Push the current lightLayer config into every registered material. */
export function applyLightLayer() {
  for (const m of strips) {
    const mat = m.material as THREE.MeshStandardMaterial;
    mat.color.copy(lightLayer.color);
    mat.emissive.copy(lightLayer.color);
    mat.emissiveIntensity = lightLayer.enabled ? lightLayer.intensity : 0;
  }
}
