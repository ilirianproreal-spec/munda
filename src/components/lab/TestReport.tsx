import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Wrench } from 'lucide-react';
import { useLabStore } from '../../store/labStore';
import { GlowButton } from '../ui/GlowButton';
import { cn } from '../../utils/cn';

export function TestReport() {
  const phase = useLabStore((s) => s.testPhase);
  const report = useLabStore((s) => s.report);
  const exitTest = useLabStore((s) => s.exitTest);

  if (phase !== 'report' || !report) return null;

  const pass = report.total > 80;
  const rows = [
    { k: 'Uniformiteti', v: Math.round(report.uniformity) },
    { k: 'Energjia', v: Math.round(report.energy) },
    { k: 'Kostoja', v: Math.round(report.cost) },
    { k: 'Dizajni', v: Math.round(report.design) },
    { k: 'Prodhueshmëria', v: Math.round(report.manufacturability) },
  ];

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
        className="glass w-full max-w-md p-8 text-center"
      >
        <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.35em] text-electric">
          Raporti i validimit
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

        <div className="mt-6 border-t border-white/10 pt-5">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-fog">
            Rezultati total
          </div>
          <div
            className={cn(
              'mt-1 font-display text-6xl font-extrabold leading-none',
              pass ? 'text-electric' : 'text-violet-bright',
            )}
          >
            {Math.round(report.total)}
            <span className="text-2xl text-fog">/100</span>
          </div>
          <div
            className={cn(
              'mt-4 inline-flex items-center gap-2 border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.3em]',
              pass
                ? 'border-electric/60 bg-electric/10 text-electric'
                : 'border-violet/60 bg-violet/10 text-violet-bright',
            )}
          >
            {pass ? <CheckCircle2 className="size-4" /> : <AlertTriangle className="size-4" />}
            {pass ? 'Projekti kalon' : 'Projekti duhet optimizuar'}
          </div>
        </div>

        <div className="mt-6">
          <GlowButton onClick={exitTest} className="w-full">
            <Wrench className="size-4" />
            Optimizo dizajnin
          </GlowButton>
        </div>
      </motion.div>
    </motion.div>
  );
}
