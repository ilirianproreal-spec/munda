import type { LabStation, MaterialId, FiberConfigId } from '../types';

export const APP_VERSION = '0.1.0';

export const MAX_LEDS = 12;

export const LAB_STATIONS: LabStation[] = [
  {
    id: 'configurator',
    code: 'STN-01',
    name: 'Light Configurator',
    description:
      'Compose LED, optical fiber and textile layers into the door-panel light signature.',
    status: 'available',
  },
  {
    id: 'fiber-routing',
    code: 'STN-02',
    name: 'Fiber Routing',
    description: 'Route side-emitting fiber strands along panel geometry and validate bend radius.',
    status: 'locked',
  },
  {
    id: 'textile',
    code: 'STN-03',
    name: 'Textile Integration',
    description: 'Weave light-emitting textile substrates into the surface layer.',
    status: 'locked',
  },
  {
    id: 'validation',
    code: 'STN-04',
    name: 'Validation Bench',
    description: 'Run the final photometric, thermal and durability validation sequence.',
    status: 'locked',
  },
];

/* ————— Design Lab ————— */

export const PANEL = { viewW: 400, viewH: 640 };

export const MATERIALS: {
  id: MaterialId;
  name: string;
  desc: string;
  spread: number; // light diffusion factor
  cost: number; // €
}[] = [
  { id: 'textile', name: 'Tekstil', desc: 'Shpërndarje e gjerë e dritës', spread: 1.25, cost: 22 },
  { id: 'carbon', name: 'Karbon', desc: 'Dritë e fokusuar, peshë e lehtë', spread: 0.9, cost: 34 },
  { id: 'soft', name: 'Soft-touch', desc: 'Ekuilibër cilësi–kosto', spread: 1.0, cost: 18 },
  { id: 'alu', name: 'Alumini', desc: 'Reflektim i fortë, më pak shpërndarje', spread: 0.8, cost: 26 },
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
  name: string;
  desc: string;
  anchors: string[];
  power: number; // W
  cost: number; // €
}[] = [
  { id: 'off', name: 'Pa fibra', desc: 'Vetëm LED', anchors: [], power: 0, cost: 0 },
  {
    id: 'linear',
    name: 'Lineare',
    desc: 'Një bosht kryesor drite',
    anchors: ['top', 'botC'],
    power: 1.2,
    cost: 8,
  },
  {
    id: 'distributed',
    name: 'Shpërndarëse',
    desc: 'Fibra drejt zonave anësore',
    anchors: ['left', 'right', 'botL', 'botR'],
    power: 2.4,
    cost: 14,
  },
  {
    id: 'ring',
    name: 'Unazore',
    desc: 'Perimetër i plotë ndriçimi',
    anchors: ['top', 'left', 'right', 'botL', 'botR'],
    power: 3.6,
    cost: 18,
  },
];
