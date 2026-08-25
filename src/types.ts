export type LabStationId = 'configurator' | 'fiber-routing' | 'textile' | 'validation';

export type LabStationStatus = 'locked' | 'available' | 'completed';

export interface LabStation {
  id: LabStationId;
  code: string; // e.g. "STN-01"
  nameKey: string; // translation key
  description: string;
  status: LabStationStatus;
}

export interface GameSession {
  startedAt: string | null;
  activeStation: LabStationId | null;
  completedStations: LabStationId[];
}

/* ————— Design Lab (gameplay) ————— */

export interface Led {
  id: string;
  x: number; // panel viewBox coords (0..400)
  y: number; // panel viewBox coords (0..640)
  intensity: number; // 0..100
  color: string; // hex
}

export type MaterialId = 'textile' | 'carbon' | 'soft' | 'alu';

export type FiberConfigId = 'off' | 'linear' | 'distributed' | 'ring';
