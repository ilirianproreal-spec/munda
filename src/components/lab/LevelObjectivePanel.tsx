import { useMemo } from 'react';
import { CheckCircle2, XCircle, Lightbulb } from 'lucide-react';
import { useLabStore } from '../../store/labStore';
import { computeMetrics } from '../../lib/light';
import { LEVELS, evaluateLevel } from '../../data/levels';
import { useT } from '../../lib/translations';
import { cn } from '../../lib/cn';

/** Live objectives panel for the current level: real-time checks, target indicator, hint. */
export function LevelObjectivePanel() {
  const t = useT();
  const currentLevel = useLabStore((s) => s.currentLevel);
  const leds = useLabStore((s) => s.leds);
  const material = useLabStore((s) => s.material);
  const fiberConfig = useLabStore((s) => s.fiberConfig);

  const metrics = useMemo(
    () => computeMetrics(leds, material, fiberConfig),
    [leds, material, fiberConfig],
  );

  const level = LEVELS[currentLevel - 1] ?? LEVELS[0];
  const { criteria } = evaluateLevel(level, metrics);
  const target = criteria[0]; // uniformity target — always the first criterion
  const targetReached = target.met;

  return (
    <div className="glass border-l-2 border-electric p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-electric">
          {t('objectives')}
        </span>
        <span className="flex items-center gap-2">
          <span className="font-mono text-[9px] tracking-[0.2em] text-fog/60">
            {t('level_prefix')} {currentLevel}
          </span>
          <span className="border border-violet/40 bg-violet/10 px-1.5 py-0.5 font-mono text-[8px] tracking-[0.2em] text-violet-bright">
            {t(level.difficultyKey)}
          </span>
        </span>
      </div>

      <ul className="space-y-2.5">
        {criteria.map((c) => (
          <li key={c.labelKey} className="flex items-center justify-between gap-3">
            <span
              className={cn(
                'flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em]',
                c.met ? 'text-white' : 'text-fog',
              )}
            >
              {c.met ? (
                <CheckCircle2 className="size-3.5 shrink-0 text-electric" />
              ) : (
                <XCircle className="size-3.5 shrink-0 text-violet-bright" />
              )}
              {t(c.labelKey)}
            </span>
            <span
              className={cn('shrink-0 font-mono text-[11px]', c.met ? 'text-electric' : 'text-fog')}
            >
              {c.value}
            </span>
          </li>
        ))}
      </ul>

      {/* target indicator */}
      <div
        className={cn(
          'mt-4 border px-3 py-2.5 transition-colors duration-300',
          targetReached ? 'border-electric/60 bg-electric/10' : 'border-white/10',
        )}
      >
        <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-fog">
          <span>{t('target')}</span>
          <span>{t(target.labelKey)}</span>
        </div>
        {targetReached ? (
          <div className="mt-1 animate-pop text-sm font-bold tracking-[0.05em] text-electric">
            ✓ {t('target_reached')}
          </div>
        ) : (
          <div className="mt-1 font-mono text-xs text-white">
            {target.value} <span className="text-fog/60">/ {target.target}</span>
          </div>
        )}
      </div>

      {/* hint */}
      <div className="mt-4 flex gap-2.5 border border-white/10 bg-white/[0.03] px-3 py-2.5">
        <Lightbulb className="size-4 shrink-0 text-violet-bright" />
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-violet-bright">
            💡 {t('tip')}
          </div>
          <p className="mt-1 text-xs leading-relaxed text-fog">{t(level.hintKey)}</p>
        </div>
      </div>
    </div>
  );
}
