import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, Wrench, ArrowRight, Check } from 'lucide-react';
import { useLabStore } from '../../store/labStore';
import { GlowButton } from '../ui/GlowButton';
import { LEVELS, evaluateLevel } from '../../data/levels';
import { play } from '../../lib/sound';
import { cn } from '../../lib/cn';

export function TestReport() {
  const phase = useLabStore((s) => s.testPhase);
  const report = useLabStore((s) => s.report);
  const exitTest = useLabStore((s) => s.exitTest);
  const currentLevel = useLabStore((s) => s.currentLevel);
  const completeLevel = useLabStore((s) => s.completeLevel);
  const setLevel = useLabStore((s) => s.setLevel);

  if (phase !== 'report' || !report) return null;

  const level = LEVELS[currentLevel - 1] ?? LEVELS[0];
  const { criteria, passed } = evaluateLevel(level, report);
  const isLast = level.id === LEVELS.length;

  useEffect(() => {
    if (phase === 'report') play(passed ? 'pass' : 'fail');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const rows = [
    { k: 'Uniformiteti', v: Math.round(report.uniformity) },
    { k: 'Energjia', v: Math.round(report.energy) },
    { k: 'Kostoja', v: Math.round(report.cost) },
    { k: 'Dizajni', v: Math.round(report.design) },
    { k: 'Prodhueshmëria', v: Math.round(report.manufacturability) },
  ];

  const handlePass = () => {
    completeLevel(level.id);
    if (!isLast) {
      setLevel(level.id + 1);
    } else {
      exitTest();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-6 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.94, y: 16, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="glass max-h-[92vh] w-full max-w-md overflow-y-auto p-8 text-center"
      >
        <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.35em] text-electric">
          {level.code} · {level.name}
        </div>
        <h2 className="font-display text-2xl font-extrabold tracking-[0.08em] text-white">
          TESTI I PËRFUNDUAR
        </h2>

        <ul className="mt-6 space-y-2.5 text-left">
          {rows.map((r) => (
            <li
              key={r.k}
              className="flex items-baseline justify-between border-b border-white/5 pb-2"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-fog">
                {r.k}
              </span>
              <span className="font-mono text-sm text-white">{r.v}%</span>
            </li>
          ))}
        </ul>

        {/* level criteria */}
        <div className="mt-5 border-t border-white/10 pt-4 text-left">
          <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-fog">
            Kriteret e nivelit
          </div>
          <ul className="space-y-2.5">
            {criteria.map((c) => (
              <li key={c.label} className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-fog">
                  {c.met ? (
                    <CheckCircle2 className="size-3.5 shrink-0 text-electric" />
                  ) : (
                    <XCircle className="size-3.5 shrink-0 text-violet-bright" />
                  )}
                  {c.label}
                </span>
                <span className="shrink-0 font-mono text-[10px] text-white">
                  {c.value} <span className="text-fog/60">/ {c.target}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-5 border-t border-white/10 pt-5">
          {/* success / failure animation */}
          <div
            className={cn(
              'mx-auto flex size-14 items-center justify-center rounded-full border',
              passed ? 'border-electric/50 bg-electric/10' : 'border-violet/50 bg-violet/10',
            )}
          >
            {passed ? (
              <CheckCircle2 className="size-7 animate-pop text-electric" />
            ) : (
              <XCircle className="size-7 animate-shake text-violet-bright" />
            )}
          </div>

          <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-fog">
            Rezultati total
          </div>
          <div
            className={cn(
              'mt-1 font-display text-6xl font-extrabold leading-none',
              passed ? 'text-electric' : 'text-violet-bright',
            )}
          >
            {Math.round(report.total)}
            <span className="text-2xl text-fog">/100</span>
          </div>
          <div
            className={cn(
              'mt-4 inline-flex items-center gap-2 border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.3em]',
              passed
                ? 'border-electric/60 bg-electric/10 text-electric'
                : 'border-violet/60 bg-violet/10 text-violet-bright',
            )}
          >
            {passed ? (
              <CheckCircle2 className="size-4" />
            ) : (
              <AlertTriangle className="size-4" />
            )}
            {passed ? 'Niveli i përfunduar' : 'Projekti duhet optimizuar'}
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {passed ? (
            <>
              <GlowButton onClick={handlePass} className="w-full">
                {isLast ? (
                  <>
                    <Check className="size-4" />
                    Përfundo
                  </>
                ) : (
                  <>
                    Niveli tjetër
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </GlowButton>
              <GlowButton onClick={exitTest} variant="glass" className="w-full">
                <Wrench className="size-4" />
                Optimizo dizajnin
              </GlowButton>
            </>
          ) : (
            <GlowButton onClick={exitTest} className="w-full">
              <Wrench className="size-4" />
              Optimizo dizajnin
            </GlowButton>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
