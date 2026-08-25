import { create } from 'zustand';
import type { Led, MaterialId, FiberConfigId } from '../types';
import { MAX_LEDS, PANEL } from '../data/lab';
import { clamp } from '../utils/light';
import type { LabMetrics } from '../utils/light';

const MARGIN = 26;

export type TestPhase = 'idle' | 'running' | 'report';

interface LabState {
  leds: Led[];
  selectedLedId: string | null;
  material: MaterialId;
  fiberConfig: FiberConfigId;
  testPhase: TestPhase;
  report: LabMetrics | null;
  addLed: (x: number, y: number) => void;
  moveLed: (id: string, x: number, y: number) => void;
  removeLed: (id: string) => void;
  selectLed: (id: string | null) => void;
  updateLed: (id: string, patch: Partial<Pick<Led, 'intensity' | 'color'>>) => void;
  setMaterial: (m: MaterialId) => void;
  setFiberConfig: (f: FiberConfigId) => void;
  startTest: () => void;
  finishTest: (m: LabMetrics) => void;
  exitTest: () => void;
}

let ledSeq = 2;
const newId = () => `led-${ledSeq++}`;

export const useLabStore = create<LabState>((set) => ({
  leds: [{ id: 'led-1', x: 200, y: 300, intensity: 65, color: '#00e5ff' }],
  selectedLedId: 'led-1',
  material: 'textile',
  fiberConfig: 'distributed',
  testPhase: 'idle',
  report: null,

  addLed: (x, y) =>
    set((s) => {
      if (s.leds.length >= MAX_LEDS) return s;
      const led: Led = {
        id: newId(),
        x: clamp(x, MARGIN, PANEL.viewW - MARGIN),
        y: clamp(y, MARGIN, PANEL.viewH - MARGIN),
        intensity: 65,
        color: '#00e5ff',
      };
      return { leds: [...s.leds, led], selectedLedId: led.id };
    }),

  moveLed: (id, x, y) =>
    set((s) => ({
      leds: s.leds.map((l) =>
        l.id === id
          ? {
              ...l,
              x: clamp(x, MARGIN, PANEL.viewW - MARGIN),
              y: clamp(y, MARGIN, PANEL.viewH - MARGIN),
            }
          : l,
      ),
    })),

  removeLed: (id) =>
    set((s) => ({
      leds: s.leds.filter((l) => l.id !== id),
      selectedLedId: s.selectedLedId === id ? null : s.selectedLedId,
    })),

  selectLed: (id) => set({ selectedLedId: id }),

  updateLed: (id, patch) =>
    set((s) => ({
      leds: s.leds.map((l) => (l.id === id ? { ...l, ...patch } : l)),
    })),

  setMaterial: (m) => set({ material: m }),
  setFiberConfig: (f) => set({ fiberConfig: f }),

  startTest: () => set({ testPhase: 'running', report: null }),
  finishTest: (m) => set({ testPhase: 'report', report: m }),
  exitTest: () => set({ testPhase: 'idle', report: null }),
}));
