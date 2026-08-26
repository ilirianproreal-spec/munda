import type { LabMetrics } from '../lib/light';
import type { TKey } from '../lib/translations';

export interface LevelCriterion {
  labelKey: TKey;
  met: boolean;
  value: string;
  target: string;
  /** 'min' = reach at least the target (≥), 'max' = stay at or below the limit (≤). */
  kind: 'min' | 'max';
  /** 0..100 — how close the player is to satisfying the criterion (drives the live progress bar). */
  progress: number;
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

/** Criterion of type "reach ≥ target" (uniformity, energy, cost, design, manufacturability). */
const minCrit = (
  labelKey: TKey,
  value: number,
  target: number,
  needKey?: TKey,
  needN?: number,
): LevelCriterion => ({
  labelKey,
  met: value >= target,
  value: `${Math.round(value)}%`,
  target: `≥ ${target}%`,
  kind: 'min',
  progress: Math.min(100, (value / target) * 100),
  need: needKey ? need(needKey, needN ?? 0) : undefined,
});

/** Criterion of type "stay ≤ max" (LED count limits). */
const maxCrit = (labelKey: TKey, count: number, max: number): LevelCriterion => ({
  labelKey,
  met: count <= max,
  value: `${count} LED`,
  target: `≤ ${max}`,
  kind: 'max',
  progress: Math.min(100, (count / Math.max(1, max)) * 100),
  need: need('need_remove_leds', count - max),
});

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
      minCrit('l1_c1', m.uniformity, 75, 'need_more_uniformity', 75 - m.uniformity),
      maxCrit('l1_c2', m.ledCount, 3),
      minCrit('l1_c3', m.design, 60, 'need_more_design', 60 - m.design),
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
      minCrit('l2_c1', m.uniformity, 70, 'need_more_uniformity', 70 - m.uniformity),
      minCrit('l2_c2', m.energy, 60, 'need_more_energy', 60 - m.energy),
      maxCrit('l2_c3', m.ledCount, 4),
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
      minCrit('l3_c1', m.uniformity, 70, 'need_more_uniformity', 70 - m.uniformity),
      minCrit('l3_c2', m.design, 70, 'need_more_design', 70 - m.design),
      minCrit('l3_c3', m.energy, 50, 'need_more_energy', 50 - m.energy),
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
      minCrit('l4_c1', m.uniformity, 65, 'need_more_uniformity', 65 - m.uniformity),
      minCrit('l4_c2', m.cost, 60, 'need_more_cost', 60 - m.cost),
      minCrit('l4_c3', m.manufacturability, 60, 'need_more_manufacturability', 60 - m.manufacturability),
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
      minCrit('l5_c1', m.uniformity, 75, 'need_more_uniformity', 75 - m.uniformity),
      minCrit('l5_c2', m.energy, 60, 'need_more_energy', 60 - m.energy),
      minCrit('l5_c3', m.design, 70, 'need_more_design', 70 - m.design),
      minCrit('l5_c4', m.manufacturability, 60, 'need_more_manufacturability', 60 - m.manufacturability),
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
