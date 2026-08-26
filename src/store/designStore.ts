import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * HERMES Light Lab — one door, four controls, live preview.
 * No accounts, no server: the design persists locally.
 */

export type ShapeId = 'top' | 'mid' | 'lower' | 'left' | 'diag' | 'wrap';
export type DayNight = 'day' | 'night';
export type LabStep = 'design' | 'final';

export interface LightDesign {
  shape: ShapeId;
  /** 0..100 — slide of the light guide along the door. */
  position: number;
  color: string;
  /** 0..100. */
  brightness: number;
  dayNight: DayNight;
}

export const DEFAULT_DESIGN: LightDesign = {
  shape: 'mid',
  position: 50,
  color: '#ffffff',
  brightness: 85,
  dayNight: 'night',
};

interface DesignState extends LightDesign {
  step: LabStep;
  setDesign: (patch: Partial<LightDesign>) => void;
  setStep: (s: LabStep) => void;
  resetDesign: () => void;
}

export const useDesignStore = create<DesignState>()(
  persist(
    (set) => ({
      ...DEFAULT_DESIGN,
      step: 'design',

      setDesign: (patch) => set(patch),
      setStep: (step) => set({ step }),
      resetDesign: () => set({ ...DEFAULT_DESIGN }),
    }),
    {
      name: 'hermes-light-lab-v1',
      partialize: (s) => ({
        shape: s.shape,
        position: s.position,
        color: s.color,
        brightness: s.brightness,
        dayNight: s.dayNight,
      }),
    },
  ),
);
