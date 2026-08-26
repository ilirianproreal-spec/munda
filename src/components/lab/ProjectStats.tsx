import { useMemo } from 'react';
import { Play } from 'lucide-react';
import { computeMetrics } from '../../lib/light';
import { useLabStore } from '../../store/labStore';
import { GlowButton } from '../ui/GlowButton';
import { useT } from '../../lib/translations';
import { play } from '../../lib/sound';
import { cn } from '../../lib/cn';

const METRICS = [
  { key: 'uniformity', labelKey: 'metric_uniformity' as const, text: 'text-electric', bar: 'bg-electric' },
  { key: 'energy', labelKey: 'metric_energy' as const, text: 'text-electric-bright', bar: 'bg-electric-bright' },
  { key: 'cost', labelKey: 'metric_cost' as const, text: 'text-white', bar: 'bg-white/50' },
  { key: 'design', labelKey: 'metric_design' as const, text: 'text-electric/80', bar: 'bg-electric/40' },
  { key: 'manufacturability', labelKey: 'metric_manufacturability' as const, text: 'text-white', bar: 'bg-white/70' },
] as const;

export function ProjectStats() {
  const t = useT();
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
          ? 'text-white'
          : 'text-fog';

  return (
    <aside className="glass p-5">
      <div className="mb-5 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-fog">
          {t('project_stats')}
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] text-electric">
          <span className="size-1.5 animate-pulse-dot rounded-full bg-electric" />
          {t('live')}
        </span>
      </div>

      <ul className="space-y-4">
        {METRICS.map((mt) => (
          <li key={mt.key}>
            <div className="mb-1.5 flex items-baseline justify-between gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-fog">
                {t(mt.labelKey)}
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
          {t('total_score')}
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
            className="h-full rounded-full bg-electric transition-all duration-500"
            style={{ width: `${m.total}%` }}
          />
        </div>
        <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.2em] text-fog/60">
          {t('weights')}
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
            {t('fillo_testin')}
          </GlowButton>
        </div>
      )}
    </aside>
  );
}
