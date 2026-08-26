import { useMemo } from 'react';
import { CheckCircle2, Circle, Lightbulb, Target } from 'lucide-react';
import { useLabStore } from '../../store/labStore';
import { computeMetrics } from '../../lib/light';
import { LEVELS, evaluateLevel } from '../../data/levels';
import { useT } from '../../lib/translations';
import { cn } from '../../lib/cn';

/**
 * Live objectives panel for the current level: every criterion gets a
 * real-time progress bar, a ✓ TARGET REACHED state, and an all-reached banner.
 */
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
  const { criteria, passed } = evaluateLevel(level, metrics);

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
          <span className="border border-white/20 bg-white/5 px-1.5 py-0.5 font-mono text-[8px] tracking-[0.2em] text-white/70">
            {t(level.difficultyKey)}
          </span>
        </span>
      </div>

      {/* criteria with live progress */}
      <ul className="space-y-3">
        {criteria.map((c) => (
          <li key={c.labelKey}>
            <div className="flex items-center justify-between gap-3">
              <span
                className={cn(
                  'flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em]',
                  c.met ? 'text-white' : 'text-fog',
                )}
              >
                {c.met ? (
                  <CheckCircle2 className="size-3.5 shrink-0 text-electric" />
                ) : (
                  <Circle className="size-3.5 shrink-0 text-fog/50" />
                )}
                {t(c.labelKey)}
              </span>
              <span
                className={cn(
                  'shrink-0 font-mono text-[10px]',
                  c.met ? 'text-electric' : 'text-fog',
                )}
              >
                {c.value} <span className="text-fog/50">/ {c.target}</span>
              </span>
            </div>

            {/* live progress toward the target */}
            <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/10">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  c.met ? 'bg-electric shadow-[0_0_8px_rgba(0,229,255,0.6)]' : 'bg-white/30',
                )}
                style={{ width: `${c.progress}%` }}
              />
            </div>

            {c.met && (
              <div className="mt-1 flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.2em] text-electric">
                <CheckCircle2 className="size-2.5" />
                ✓ {t('target_reached')}
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* all-reached banner */}
      <div
        className={cn(
          'mt-4 flex items-center gap-2.5 border px-3 py-2.5 transition-all duration-500',
          passed
            ? 'border-electric/60 bg-electric/10 shadow-[0_0_20px_rgba(0,229,255,0.2)]'
            : 'border-white/10 bg-white/[0.02]',
        )}
      >
        <Target
          className={cn('size-4 shrink-0', passed ? 'text-electric' : 'text-fog/40')}
        />
        {passed ? (
          <span className="animate-pop font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-electric">
            ✓ {t('all_targets_reached')}
          </span>
        ) : (
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-fog/70">
            {criteria.filter((c) => c.met).length}/{criteria.length} {t('target')}
          </span>
        )}
      </div>

      {/* hint */}
      <div className="mt-3 flex gap-2.5 border border-white/10 bg-white/[0.03] px-3 py-2.5">
        <Lightbulb className="size-4 shrink-0 text-fog" />
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-fog">
            {t('tip')}
          </div>
          <p className="mt-1 text-xs leading-relaxed text-fog">{t(level.hintKey)}</p>
        </div>
      </div>
    </div>
  );
}
