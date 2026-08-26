import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * MUNDA Light Lab — one door, one light, five controls.
 * Every change renders live on the door. No accounts, no server:
 * the design persists locally.
 */

export type LightEffect = 'static' | 'pulse' | 'wave' | 'glow' | 'flash';

export interface LightDesign {
  power: boolean;
  color: string;
  /** 0..100. */
  brightness: number;
  /** 0..100 — glow/halo strength of the light. */
  intensity: number;
  effect: LightEffect;
  /** 0..100 — animation speed of the effect. */
  speed: number;
}

export const DEFAULT_DESIGN: LightDesign = {
  power: true,
  color: '#ffffff',
  brightness: 85,
  intensity: 45,
  effect: 'static',
  speed: 50,
};

interface DesignState extends LightDesign {
  setDesign: (patch: Partial<LightDesign>) => void;
  resetDesign: () => void;
}

export const useDesignStore = create<DesignState>()(
  persist(
    (set) => ({
      ...DEFAULT_DESIGN,
      setDesign: (patch) => set(patch),
      resetDesign: () => set({ ...DEFAULT_DESIGN }),
    }),
    {
      name: 'munda-light-design-v1',
      partialize: (s) => ({
        power: s.power,
        color: s.color,
        brightness: s.brightness,
        intensity: s.intensity,
        effect: s.effect,
        speed: s.speed,
      }),
    },
  ),
);
