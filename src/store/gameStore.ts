import { create } from 'zustand';
import type { LabStationId } from '../types';

interface GameState {
  sessionStarted: boolean;
  startedAt: string | null;
  activeStation: LabStationId | null;
  completedStations: LabStationId[];
  startSession: () => void;
  selectStation: (id: LabStationId | null) => void;
  completeStation: (id: LabStationId) => void;
}

export const useGameStore = create<GameState>((set) => ({
  sessionStarted: false,
  startedAt: null,
  activeStation: null,
  completedStations: [],
  startSession: () =>
    set({ sessionStarted: true, startedAt: new Date().toISOString() }),
  selectStation: (id) => set({ activeStation: id }),
  completeStation: (id) =>
    set((s) => ({
      completedStations: s.completedStations.includes(id)
        ? s.completedStations
        : [...s.completedStations, id],
    })),
}));
