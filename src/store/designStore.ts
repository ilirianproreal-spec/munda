import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * HERMES Light Lab — the light design on the Audi door.
 * One small state, persisted locally. No accounts, no server.
 */

export type ShapeId = 'top' | 'mid' | 'lower' | 'left' | 'diag' | 'wrap';
export type DoorVariant = '01' | '02' | '03';
export type LightPattern = 'static' | 'pulse' | 'flow' | 'wave';
export type DoorView = 'front' | 'side' | 'closeup';
export type DayNight = 'day' | 'night';
export type LabStep = 'door' | 'design' | 'final';

export interface LightDesign {
  door: DoorVariant;
  shape: ShapeId;
  /** 0..100 — slide of the light guide along the door. */
  position: number;
  /** 20..100 — % of the guide path that is lit. */
  length: number;
  /** 1..7 — stroke width of the guide (viewBox units). */
  thickness: number;
  /** 0..100. */
  brightness: number;
  color: string;
  /** 0..100 — halo size/amount. */
  glow: number;
  pattern: LightPattern;
  power: boolean;
  view: DoorView;
  dayNight: DayNight;
}

export const DEFAULT_DESIGN: LightDesign = {
  door: '01',
  shape: 'mid',
  position: 50,
  length: 80,
  thickness: 3,
  brightness: 85,
  color: '#ffffff',
  glow: 45,
  pattern: 'static',
  power: true,
  view: 'front',
  dayNight: 'night',
};

interface DesignState extends LightDesign {
  step: LabStep;
  /** True briefly after SAVE DESIGN — drives the "DESIGN SAVED" flash. */
  savedFlash: boolean;
  setDesign: (patch: Partial<LightDesign>) => void;
  setStep: (s: LabStep) => void;
  flashSaved: () => void;
}

export const useDesignStore = create<DesignState>()(
  persist(
    (set) => ({
      ...DEFAULT_DESIGN,
      step: 'door',
      savedFlash: false,

      setDesign: (patch) => set(patch),
      setStep: (step) => set({ step }),
      flashSaved: () => set({ savedFlash: true }),
    }),
    {
      name: 'hermes-light-lab-v1',
      partialize: (s) => ({
        door: s.door,
        shape: s.shape,
        position: s.position,
        length: s.length,
        thickness: s.thickness,
        brightness: s.brightness,
        color: s.color,
        glow: s.glow,
        pattern: s.pattern,
        power: s.power,
        dayNight: s.dayNight,
      }),
    },
  ),
);
