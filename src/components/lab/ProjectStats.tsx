import { useMemo } from 'react';
import { computeStats } from '../../utils/light';
import { useLabStore } from '../../store/labStore';
import { cn } from '../../utils/cn';

export function ProjectStats() {
  const leds = useLabStore((s) => s.leds);
  const material = useLabStore((s) => s.material);
  const fiberConfig = useLabStore((s) => s.fiberConfig);

  const stats = useMemo(
    () => computeStats(leds, material, fiberConfig),
    [leds, material, fiberConfig],
  );

  const rows = [
    { k: 'LED-ët', v: String(stats.ledCount) },
    { k: 'Drita totale', v: `${Math.round(stats.totalLumens)} lm` },
    { k: 'Energjia', v: `${stats.powerW.toFixed(1)} W` },
    { k: 'Kosto', v: `${stats.costEur.toFixed(1)} €` },
  ];

  const gradeColor =
    stats.grade === 'A'
      ? 'text-electric'
      : stats.grade === 'B'
        ? 'text-electric-bright'
        : stats.grade === 'C'
          ? 'text-violet-bright'
          : stats.grade === 'D'
            ? 'text-violet'
            : 'text-fog';

  const coveragePct = Math.round(stats.coverage * 100);

  return (
    <aside className="glass p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-fog">
          Statistikat e projektit
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] text-electric">
          <span className="size-1.5 animate-pulse-dot rounded-full bg-electric" />
          LIVE
        </span>
      </div>

      <ul className="space-y-3">
        {rows.map((r) => (
          <li
            key={r.k}
            className="flex items-baseline justify-between gap-4 border-b border-white/5 pb-3"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-fog">{r.k}</span>
            <span className="font-mono text-sm text-white">{r.v}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <div className="mb-2 flex items-baseline justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-fog">
            Mbulueshmëria
          </span>
          <span className="font-mono text-sm text-white">{coveragePct}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-electric to-violet transition-all duration-500"
            style={{ width: `${coveragePct}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-fog/60">
          <span>Objektivi 75%</span>
          <span>{stats.ledCount > 0 ? 'Aktiv' : 'Shto LED'}</span>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-fog">
          Vlerësimi
        </span>
        <span className={cn('font-display text-3xl font-extrabold', gradeColor)}>{stats.grade}</span>
      </div>
    </aside>
  );
}
