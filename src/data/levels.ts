import type { LabMetrics } from '../lib/light';
import type { TKey } from '../lib/translations';

export interface LevelCriterion {
  labelKey: TKey;
  met: boolean;
  value: string;
  target: string;
  /** Shown when the criterion fails: what exactly is missing. */
  need?: { key: TKey; n: number };
}

export interface LevelDef {
  id: number;
  code: string;
  nameKey: TKey;
  objectiveKey: TKey;
  difficultyKey: TKey;
  hintKey: TKey;
  maxLeds: number;
  constraints: TKey[];
  evaluate: (m: LabMetrics) => LevelCriterion[];
}

const need = (key: TKey, n: number) => (n > 0.5 ? { key, n: Math.ceil(n) } : undefined);

export const LEVELS: LevelDef[] = [
  {
    id: 1,
    code: 'NIVELI 1',
    nameKey: 'l1_name',
    objectiveKey: 'l1_objective',
    difficultyKey: 'diff_easy',
    hintKey: 'level1_hint',
    maxLeds: 3,
    constraints: ['l1_c1', 'l1_c2', 'l1_c3'],
    evaluate: (m) => [
      {
        labelKey: 'l1_c1',
        met: m.uniformity >= 75,
        value: `${Math.round(m.uniformity)}%`,
        target: '≥ 75%',
        need: need('need_more_uniformity', 75 - m.uniformity),
      },
      {
        labelKey: 'l1_c2',
        met: m.ledCount <= 3,
        value: `${m.ledCount} LED`,
        target: '≤ 3',
        need: need('need_remove_leds', m.ledCount - 3),
      },
      {
        labelKey: 'l1_c3',
        met: m.design >= 60,
        value: `${Math.round(m.design)}%`,
        target: '≥ 60%',
        need: need('need_more_design', 60 - m.design),
      },
    ],
  },
  {
    id: 2,
    code: 'NIVELI 2',
    nameKey: 'l2_name',
    objectiveKey: 'l2_objective',
    difficultyKey: 'diff_easy',
    hintKey: 'l2_hint',
    maxLeds: 4,
    constraints: ['l2_c1', 'l2_c2', 'l2_c3'],
    evaluate: (m) => [
      {
        labelKey: 'l2_c1',
        met: m.uniformity >= 70,
        value: `${Math.round(m.uniformity)}%`,
        target: '≥ 70%',
        need: need('need_more_uniformity', 70 - m.uniformity),
      },
      {
        labelKey: 'l2_c2',
        met: m.energy >= 60,
        value: `${Math.round(m.energy)}%`,
        target: '≥ 60%',
        need: need('need_more_energy', 60 - m.energy),
      },
      {
        labelKey: 'l2_c3',
        met: m.ledCount <= 4,
        value: `${m.ledCount} LED`,
        target: '≤ 4',
        need: need('need_remove_leds', m.ledCount - 4),
      },
    ],
  },
  {
    id: 3,
    code: 'NIVELI 3',
    nameKey: 'l3_name',
    objectiveKey: 'l3_objective',
    difficultyKey: 'diff_easy_medium',
    hintKey: 'l3_hint',
    maxLeds: 5,
    constraints: ['l3_c1', 'l3_c2', 'l3_c3'],
    evaluate: (m) => [
      {
        labelKey: 'l3_c1',
        met: m.uniformity >= 70,
        value: `${Math.round(m.uniformity)}%`,
        target: '≥ 70%',
        need: need('need_more_uniformity', 70 - m.uniformity),
      },
      {
        labelKey: 'l3_c2',
        met: m.design >= 70,
        value: `${Math.round(m.design)}%`,
        target: '≥ 70%',
        need: need('need_more_design', 70 - m.design),
      },
      {
        labelKey: 'l3_c3',
        met: m.energy >= 50,
        value: `${Math.round(m.energy)}%`,
        target: '≥ 50%',
        need: need('need_more_energy', 50 - m.energy),
      },
    ],
  },
  {
    id: 4,
    code: 'NIVELI 4',
    nameKey: 'l4_name',
    objectiveKey: 'l4_objective',
    difficultyKey: 'diff_medium',
    hintKey: 'l4_hint',
    maxLeds: 5,
    constraints: ['l4_c1', 'l4_c2', 'l4_c3'],
    evaluate: (m) => [
      {
        labelKey: 'l4_c1',
        met: m.uniformity >= 65,
        value: `${Math.round(m.uniformity)}%`,
        target: '≥ 65%',
        need: need('need_more_uniformity', 65 - m.uniformity),
      },
      {
        labelKey: 'l4_c2',
        met: m.cost >= 60,
        value: `${Math.round(m.cost)}%`,
        target: '≥ 60%',
        need: need('need_more_cost', 60 - m.cost),
      },
      {
        labelKey: 'l4_c3',
        met: m.manufacturability >= 60,
        value: `${Math.round(m.manufacturability)}%`,
        target: '≥ 60%',
        need: need('need_more_manufacturability', 60 - m.manufacturability),
      },
    ],
  },
  {
    id: 5,
    code: 'NIVELI 5',
    nameKey: 'l5_name',
    objectiveKey: 'l5_objective',
    difficultyKey: 'diff_medium',
    hintKey: 'l5_hint',
    maxLeds: 6,
    constraints: ['l5_c1', 'l5_c2', 'l5_c3', 'l5_c4'],
    evaluate: (m) => [
      {
        labelKey: 'l5_c1',
        met: m.uniformity >= 75,
        value: `${Math.round(m.uniformity)}%`,
        target: '≥ 75%',
        need: need('need_more_uniformity', 75 - m.uniformity),
      },
      {
        labelKey: 'l5_c2',
        met: m.energy >= 60,
        value: `${Math.round(m.energy)}%`,
        target: '≥ 60%',
        need: need('need_more_energy', 60 - m.energy),
      },
      {
        labelKey: 'l5_c3',
        met: m.design >= 70,
        value: `${Math.round(m.design)}%`,
        target: '≥ 70%',
        need: need('need_more_design', 70 - m.design),
      },
      {
        labelKey: 'l5_c4',
        met: m.manufacturability >= 60,
        value: `${Math.round(m.manufacturability)}%`,
        target: '≥ 60%',
        need: need('need_more_manufacturability', 60 - m.manufacturability),
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
