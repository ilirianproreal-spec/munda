import type { LabMetrics } from '../utils/light';

export interface LevelCriterion {
  label: string;
  met: boolean;
  value: string;
  target: string;
}

export interface LevelDef {
  id: number;
  code: string;
  name: string;
  objective: string;
  constraints: string[];
  evaluate: (m: LabMetrics) => LevelCriterion[];
}

export const LEVELS: LevelDef[] = [
  {
    id: 1,
    code: 'NIVELI 1',
    name: 'NDRIÇIMI BAZË',
    objective: 'Arri 80% uniformitet të dritës në panel.',
    constraints: ['Maksimumi 3 LED'],
    evaluate: (m) => [
      {
        label: 'Uniformiteti ≥ 80%',
        met: m.uniformity >= 80,
        value: `${Math.round(m.uniformity)}%`,
        target: '≥ 80%',
      },
      {
        label: 'Maksimumi 3 LED',
        met: m.ledCount <= 3,
        value: `${m.ledCount} LED`,
        target: '≤ 3',
      },
    ],
  },
  {
    id: 2,
    code: 'NIVELI 2',
    name: 'EFIKASITETI',
    objective: 'Arri 85% uniformitet duke e përdorur energjinë në mënyrë efikase.',
    constraints: ['Uniformiteti ≥ 85%', 'Efikasiteti i energjisë ≥ 75%'],
    evaluate: (m) => [
      {
        label: 'Uniformiteti ≥ 85%',
        met: m.uniformity >= 85,
        value: `${Math.round(m.uniformity)}%`,
        target: '≥ 85%',
      },
      {
        label: 'Efikasiteti i energjisë ≥ 75%',
        met: m.energy >= 75,
        value: `${Math.round(m.energy)}%`,
        target: '≥ 75%',
      },
    ],
  },
  {
    id: 3,
    code: 'NIVELI 3',
    name: 'INTERIOR PREMIUM',
    objective: 'Krijo një dizajn me cilësi të lartë vizuale.',
    constraints: ['Cilësia e dizajnit ≥ 80%'],
    evaluate: (m) => [
      {
        label: 'Cilësia e dizajnit ≥ 80%',
        met: m.design >= 80,
        value: `${Math.round(m.design)}%`,
        target: '≥ 80%',
      },
    ],
  },
  {
    id: 4,
    code: 'NIVELI 4',
    name: 'PRODHIMI',
    objective: 'Balanco koston e prodhimit me prodhueshmërinë.',
    constraints: ['Kostoja ≥ 75%', 'Prodhueshmëria ≥ 80%'],
    evaluate: (m) => [
      {
        label: 'Kostoja e prodhimit ≥ 75%',
        met: m.cost >= 75,
        value: `${Math.round(m.cost)}%`,
        target: '≥ 75%',
      },
      {
        label: 'Prodhueshmëria ≥ 80%',
        met: m.manufacturability >= 80,
        value: `${Math.round(m.manufacturability)}%`,
        target: '≥ 80%',
      },
    ],
  },
  {
    id: 5,
    code: 'NIVELI 5',
    name: 'MUNDA MASTER',
    objective: 'Arri të paktën 90/100 në rezultatin total.',
    constraints: ['Rezultati total ≥ 90'],
    evaluate: (m) => [
      {
        label: 'Rezultati total ≥ 90',
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
