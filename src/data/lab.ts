import type { LabStation, MaterialId, FiberConfigId } from '../types';
import type { TKey } from '../lib/translations';

export const APP_VERSION = '0.1.0';

export const MAX_LEDS = 12;

export const LAB_STATIONS: LabStation[] = [
  {
    id: 'configurator',
    code: 'STN-01',
    nameKey: 'stn_configurator',
    description:
      'Compose LED, optical fiber and textile layers into the door-panel light signature.',
    status: 'available',
  },
  {
    id: 'fiber-routing',
    code: 'STN-02',
    nameKey: 'stn_fiber',
    description: 'Route side-emitting fiber strands along panel geometry and validate bend radius.',
    status: 'locked',
  },
  {
    id: 'textile',
    code: 'STN-03',
    nameKey: 'stn_textile',
    description: 'Weave light-emitting textile substrates into the surface layer.',
    status: 'locked',
  },
  {
    id: 'validation',
    code: 'STN-04',
    nameKey: 'stn_validation',
    description: 'Run the final photometric, thermal and durability validation sequence.',
    status: 'locked',
  },
];

/* ————— Design Lab ————— */

export const PANEL = { viewW: 400, viewH: 640 };

export const MATERIALS: {
  id: MaterialId;
  nameKey: TKey;
  descKey: TKey;
  spread: number; // light diffusion factor
  cost: number; // €
}[] = [
  { id: 'textile', nameKey: 'mat_textile_name', descKey: 'mat_textile_desc', spread: 1.25, cost: 22 },
  { id: 'carbon', nameKey: 'mat_carbon_name', descKey: 'mat_carbon_desc', spread: 0.9, cost: 34 },
  { id: 'soft', nameKey: 'mat_soft_name', descKey: 'mat_soft_desc', spread: 1.0, cost: 18 },
  { id: 'alu', nameKey: 'mat_alu_name', descKey: 'mat_alu_desc', spread: 0.8, cost: 26 },
];

export const FIBER_ANCHORS: Record<string, { x: number; y: number }> = {
  top: { x: 200, y: 34 },
  left: { x: 76, y: 210 },
  right: { x: 324, y: 210 },
  handle: { x: 280, y: 158 },
  armL: { x: 112, y: 420 },
  armR: { x: 288, y: 420 },
  botL: { x: 108, y: 572 },
  botR: { x: 292, y: 572 },
  botC: { x: 200, y: 596 },
};

export const FIBER_CONFIGS: {
  id: FiberConfigId;
  nameKey: TKey;
  descKey: TKey;
  anchors: string[];
  power: number; // W
  cost: number; // €
}[] = [
  { id: 'off', nameKey: 'fiber_off_name', descKey: 'fiber_off_desc', anchors: [], power: 0, cost: 0 },
  {
    id: 'linear',
    nameKey: 'fiber_linear_name',
    descKey: 'fiber_linear_desc',
    anchors: ['top', 'botC'],
    power: 1.2,
    cost: 8,
  },
  {
    id: 'distributed',
    nameKey: 'fiber_distributed_name',
    descKey: 'fiber_distributed_desc',
    anchors: ['left', 'right', 'botL', 'botR'],
    power: 2.4,
    cost: 14,
  },
  {
    id: 'ring',
    nameKey: 'fiber_ring_name',
    descKey: 'fiber_ring_desc',
    anchors: ['top', 'left', 'right', 'botL', 'botR'],
    power: 3.6,
    cost: 18,
  },
];
