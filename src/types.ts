export type LabStationId = 'configurator' | 'fiber-routing' | 'textile' | 'validation';

export type LabStationStatus = 'locked' | 'available' | 'completed';

export interface LabStation {
  id: LabStationId;
  code: string; // e.g. "STN-01"
  name: string;
  description: string;
  status: LabStationStatus;
}

export interface GameSession {
  startedAt: string | null;
  activeStation: LabStationId | null;
  completedStations: LabStationId[];
}
