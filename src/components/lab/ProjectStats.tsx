import { useMemo } from 'react';
import { Play } from 'lucide-react';
import { computeMetrics } from '../../utils/light';
import { useLabStore } from '../../store/labStore';
import { GlowButton } from '../ui/GlowButton';
import { play } from '../../utils/sound';
import { cn } from '../../utils/cn';

const METRICS = [
  {
    key: 'uniformity',
    label: 'Uniformiteti i dritës',
    text: 'text-electric',
    bar: 'bg-electric',
  },
  {
    key: 'energy',
    label: 'Efikasiteti i energjisë',
    text: 'text-electric-bright',
    bar: 'bg-electric-bright',
  },
  {
    key: 'cost',
    label: 'Kostoja e prodhimit',
    text: 'text-violet-bright',
    bar: 'bg-violet',
  },
  {
    key: 'design',
    label: 'Cilësia e dizajnit',
    text: 'text-violet-bright',
    bar: 'bg-violet-bright',
  },
  {
    key: 'manufacturability',
    label: 'Mundësia e prodhimit',
    text: 'text-white',
    bar: 'bg-white/70',
  },
] as const;

export function ProjectStats() {
  const leds = useLabStore((s) => s.leds);
  const material = useLabStore((s) => s.material);
  const fiberConfig = useLabStore((s) => s.fiberConfig);

  const m = useMemo(
    () => computeMetrics(leds, material, fiberConfig),
    [leds, material, fiberConfig],
  );

  const testPhase = useLabStore((s) => s.testPhase);
  const startTest = useLabStore((s) => s.startTest);

  const totalColor =
    m.total >= 80
      ? 'text-electric'
      : m.total >= 60
        ? 'text-electric-bright'
        : m.total >= 40
          ? 'text-violet-bright'
          : 'text-fog';

  return (
    <aside className="glass p-5">
      <div className="mb-5 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-fog">
          Statistikat e projektit
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] text-electric">
          <span className="size-1.5 animate-pulse-dot rounded-full bg-electric" />
          LIVE
        </span>
      </div>

      <ul className="space-y-4">
        {METRICS.map((mt) => (
          <li key={mt.key}>
            <div className="mb-1.5 flex items-baseline justify-between gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-fog">
                {mt.label}
              </span>
              <span className={cn('font-mono text-xs', mt.text)}>
                {Math.round(m[mt.key])}%
              </span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-white/10">
              <div
                className={cn('h-full rounded-full transition-all duration-500', mt.bar)}
                style={{ width: `${m[mt.key]}%` }}
              />
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 border-t border-white/10 pt-5 text-center">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-fog">
          Rezultati total
        </div>
        <div
          className={cn(
            'mt-2 font-display text-6xl font-extrabold leading-none',
            totalColor,
            m.total >= 80 && '[text-shadow:0_0_30px_rgba(0,229,255,0.45)]',
          )}
        >
          {Math.round(m.total)}
        </div>
        <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet via-electric to-white transition-all duration-500"
            style={{ width: `${m.total}%` }}
          />
        </div>
        <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.2em] text-fog/60">
          U 30% · E 20% · K 20% · D 15% · P 15%
        </div>
      </div>

      {testPhase === 'idle' && (
        <div className="mt-6">
          <GlowButton
            onClick={() => {
              play('test');
              startTest();
            }}
            className="w-full"
          >
            <Play className="size-4 fill-current" />
            Fillo testin
          </GlowButton>
        </div>
      )}
    </aside>
  );
}
