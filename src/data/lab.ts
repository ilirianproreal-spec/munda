import type { LabStation } from '../types';

export const APP_VERSION = '0.1.0';

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
