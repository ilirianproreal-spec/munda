import type { LabMetrics } from '../lib/light';
import type { TKey } from '../lib/translations';

export interface LevelCriterion {
  labelKey: TKey;
  met: boolean;
  value: string;
  target: string;
}

export interface LevelDef {
  id: number;
  code: string;
  nameKey: TKey;
  objectiveKey: TKey;
  constraints: TKey[];
  evaluate: (m: LabMetrics) => LevelCriterion[];
}

export const LEVELS: LevelDef[] = [
  {
    id: 1,
    code: 'NIVELI 1',
    nameKey: 'l1_name',
    objectiveKey: 'l1_objective',
    constraints: ['l1_c1', 'l1_c2'],
    evaluate: (m) => [
      {
        labelKey: 'l1_c1',
        met: m.uniformity >= 80,
        value: `${Math.round(m.uniformity)}%`,
        target: '≥ 80%',
      },
      {
        labelKey: 'l1_c2',
        met: m.ledCount <= 3,
        value: `${m.ledCount} LED`,
        target: '≤ 3',
      },
    ],
  },
  {
    id: 2,
    code: 'NIVELI 2',
    nameKey: 'l2_name',
    objectiveKey: 'l2_objective',
    constraints: ['l2_c1', 'l2_c2'],
    evaluate: (m) => [
      {
        labelKey: 'l2_c1',
        met: m.uniformity >= 85,
        value: `${Math.round(m.uniformity)}%`,
        target: '≥ 85%',
      },
      {
        labelKey: 'l2_c2',
        met: m.energy >= 75,
        value: `${Math.round(m.energy)}%`,
        target: '≥ 75%',
      },
    ],
  },
  {
    id: 3,
    code: 'NIVELI 3',
    nameKey: 'l3_name',
    objectiveKey: 'l3_objective',
    constraints: ['l3_c1'],
    evaluate: (m) => [
      {
        labelKey: 'l3_c1',
        met: m.design >= 80,
        value: `${Math.round(m.design)}%`,
        target: '≥ 80%',
      },
    ],
  },
  {
    id: 4,
    code: 'NIVELI 4',
    nameKey: 'l4_name',
    objectiveKey: 'l4_objective',
    constraints: ['l4_c1', 'l4_c2'],
    evaluate: (m) => [
      {
        labelKey: 'l4_c1',
        met: m.cost >= 75,
        value: `${Math.round(m.cost)}%`,
        target: '≥ 75%',
      },
      {
        labelKey: 'l4_c2',
        met: m.manufacturability >= 80,
        value: `${Math.round(m.manufacturability)}%`,
        target: '≥ 80%',
      },
    ],
  },
  {
    id: 5,
    code: 'NIVELI 5',
    nameKey: 'l5_name',
    objectiveKey: 'l5_objective',
    constraints: ['l5_c1'],
    evaluate: (m) => [
      {
        labelKey: 'l5_c1',
        met: m.total >= 90,
        value: `${Math.round(m.total)}/100`,
        target: '≥ 90',
      },
    ],
  },
];

export interface LevelEvaluation {
  criteria: LevelCriterion[];
  passed: boolean;
}

export function evaluateLevel(level: LevelDef, m: LabMetrics): LevelEvaluation {
  const criteria = level.evaluate(m);
  return { criteria, passed: criteria.every((c) => c.met) };
}
