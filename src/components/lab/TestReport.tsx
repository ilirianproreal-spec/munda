import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, Wrench, ArrowRight, Package, RotateCcw } from 'lucide-react';
import { useLabStore } from '../../store/labStore';
import { GlowButton } from '../ui/GlowButton';
import { LEVELS, evaluateLevel } from '../../data/levels';
import { gradeFor } from '../../lib/light';
import { useT } from '../../lib/translations';
import { play } from '../../lib/sound';
import { cn } from '../../lib/cn';

export function TestReport() {
  const t = useT();
  const phase = useLabStore((s) => s.testPhase);
  const report = useLabStore((s) => s.report);
  const exitTest = useLabStore((s) => s.exitTest);
  const startTest = useLabStore((s) => s.startTest);
  const currentLevel = useLabStore((s) => s.currentLevel);
  const completeLevel = useLabStore((s) => s.completeLevel);
  const setLevel = useLabStore((s) => s.setLevel);
  const revealProduct = useLabStore((s) => s.revealProduct);

  const level = LEVELS[currentLevel - 1] ?? LEVELS[0];
  const evaluation = report ? evaluateLevel(level, report) : null;
  const passed = evaluation?.passed ?? false;
  const isLast = level.id === LEVELS.length;
  const gradeKey = report ? gradeFor(report.total) : 'grade_needs_improvement';

  /* celebratory score count-up */
  const [shownScore, setShownScore] = useState(0);
  useEffect(() => {
    if (phase !== 'report' || !report) {
      setShownScore(0);
      return;
    }
    const target = Math.round(report.total);
    const start = performance.now();
    const DUR = 950;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / DUR);
      const eased = 1 - Math.pow(1 - p, 3);
      setShownScore(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, report]);

  useEffect(() => {
    if (phase === 'report' && report) play(passed ? 'pass' : 'fail');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  if (phase !== 'report' || !report || !evaluation) return null;

  const { criteria } = evaluation;

  const rows = [
    { k: t('metric_uniformity'), v: Math.round(report.uniformity) },
    { k: t('metric_energy'), v: Math.round(report.energy) },
    { k: t('metric_cost'), v: Math.round(report.cost) },
    { k: t('metric_design'), v: Math.round(report.design) },
    { k: t('metric_manufacturability'), v: Math.round(report.manufacturability) },
  ];

  const handlePass = () => {
    completeLevel(level.id);
    if (!isLast) {
      setLevel(level.id + 1);
    } else {
      revealProduct();
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
          {level.code} · {t(level.nameKey)}
        </div>
        <h2 className="font-display text-2xl font-extrabold tracking-[0.08em] text-white">
          {t('report_title')}
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

        <div className="mt-5 border-t border-white/10 pt-4 text-left">
          <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-fog">
            {t('report_criteria')}
          </div>
          <ul className="space-y-2.5">
            {criteria.map((c) => (
              <li key={c.labelKey}>
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-fog">
                    {c.met ? (
                      <CheckCircle2 className="size-3.5 shrink-0 text-electric" />
                    ) : (
                      <XCircle className="size-3.5 shrink-0 text-fog" />
                    )}
                    {t(c.labelKey)}
                  </span>
                  <span className="shrink-0 font-mono text-[10px] text-white">
                    {c.value} <span className="text-fog/60">/ {c.target}</span>
                  </span>
                </div>
                {!c.met && c.need && (
                  <div className="mt-1 flex items-center gap-1.5 pl-5 font-mono text-[10px] text-fog">
                    <AlertTriangle className="size-3 shrink-0" />
                    {t(c.need.key).replace('{n}', String(c.need.n))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-5 border-t border-white/10 pt-5">
          <div className="relative mx-auto flex size-14 items-center justify-center">
            {passed && (
              <>
                <span className="fr-ring absolute inset-0 rounded-full border border-electric/60" />
                <span
                  className="fr-ring absolute inset-0 rounded-full border border-electric/30"
                  style={{ animationDelay: '0.55s' }}
                />
              </>
            )}
            <div
              className={cn(
                'relative flex size-14 items-center justify-center rounded-full border',
                passed ? 'border-electric/50 bg-electric/10' : 'border-white/25 bg-white/5',
              )}
            >
              {passed ? (
                <CheckCircle2 className="size-7 animate-pop text-electric" />
              ) : (
                <XCircle className="size-7 animate-shake text-white/80" />
              )}
            </div>
          </div>

          <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-fog">
            {t('total_score')}
          </div>
          <div
            className={cn(
              'mt-1 font-display text-6xl font-extrabold leading-none',
              passed ? 'text-electric' : 'text-white/80',
            )}
          >
            {shownScore}
            <span className="text-2xl text-fog">/100</span>
          </div>

          {/* score grade */}
          <div
            className={cn(
              'mt-3 inline-flex items-center gap-2 border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em]',
              gradeKey === 'grade_master'
                ? 'border-electric/60 bg-electric/10 text-electric'
                : gradeKey === 'grade_excellent'
                  ? 'border-electric-bright/50 bg-electric-bright/10 text-electric-bright'
                  : gradeKey === 'grade_good'
                    ? 'border-white/40 bg-white/5 text-white'
                      : gradeKey === 'grade_passed'
                        ? 'border-white/30 bg-white/5 text-white'
                        : 'border-white/25 bg-white/5 text-fog',
            )}
          >
            {t(gradeKey)}
          </div>

          <div
            className={cn(
              'mt-4 inline-flex items-center gap-2 border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.3em]',
              passed
                ? 'border-electric/60 bg-electric/10 text-electric'
                : 'border-white/25 bg-white/5 text-fog',
            )}
          >
            {passed ? (
              <CheckCircle2 className="size-4" />
            ) : (
              <AlertTriangle className="size-4" />
            )}
            {passed ? t('report_pass') : t('report_fail')}
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {passed ? (
            <>
              <GlowButton onClick={handlePass} className="w-full">
                {isLast ? (
                  <>
                    <Package className="size-4" />
                    {t('view_product')}
                  </>
                ) : (
                  <>
                    {t('report_next')}
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </GlowButton>
              <GlowButton onClick={exitTest} variant="glass" className="w-full">
                <Wrench className="size-4" />
                {t('optimize_design')}
              </GlowButton>
            </>
          ) : (
            <>
              <GlowButton
                onClick={() => {
                  play('test');
                  startTest();
                }}
                className="w-full"
              >
                <RotateCcw className="size-4" />
                {t('try_again')}
              </GlowButton>
              <GlowButton onClick={exitTest} variant="glass" className="w-full">
                <Wrench className="size-4" />
                {t('optimize_design')}
              </GlowButton>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
