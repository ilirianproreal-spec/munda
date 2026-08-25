import { useState } from 'react';
import type { ComponentType } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { TopBar } from '../components/layout/TopBar';
import { GlowButton } from '../components/ui/GlowButton';
import { LEDArt, FiberArt, TextileArt, OptimizeArt } from '../components/fx/TutorialArt';
import { LAB_STATIONS } from '../data/lab';
import { useT } from '../lib/translations';
import type { TKey } from '../lib/translations';
import { cn } from '../lib/cn';

const STEPS: Array<{
  titleKey: TKey;
  textKey: TKey;
  Art: ComponentType;
  accent: string;
}> = [
  {
    titleKey: 'tut_1_title',
    textKey: 'tut_1_text',
    Art: LEDArt,
    accent: 'text-electric',
  },
  {
    titleKey: 'tut_2_title',
    textKey: 'tut_2_text',
    Art: FiberArt,
    accent: 'text-violet-bright',
  },
  {
    titleKey: 'tut_3_title',
    textKey: 'tut_3_text',
    Art: TextileArt,
    accent: 'text-electric-bright',
  },
  {
    titleKey: 'tut_4_title',
    textKey: 'tut_4_text',
    Art: OptimizeArt,
    accent: 'text-violet-bright',
  },
];

const ROADMAP: Array<{ n: string; titleKey: TKey; textKey: TKey }> = [
  { n: '01', titleKey: 'tut_step1_title', textKey: 'tut_step1_text' },
  { n: '02', titleKey: 'tut_step2_title', textKey: 'tut_step2_text' },
  { n: '03', titleKey: 'tut_step3_title', textKey: 'tut_step3_text' },
];

export function TutorialScreen() {
  const t = useT();
  const [step, setStep] = useState(0);
  const last = step === STEPS.length - 1;
  const current = STEPS[step];
  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip bg-ink">
      <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-electric/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-violet/10 blur-[120px]" />
      <div className="pointer-events-none fixed inset-0 bg-blueprint [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />

      <TopBar />

      <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 pb-16 pt-28">
        {/* header + progress */}
        <div className="mb-8">
          <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.35em] text-electric">
            {t('tut_header')}
          </div>
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => (
              <div key={s.titleKey} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className={cn(
                    'h-full rounded-full bg-electric transition-all duration-500',
                    i <= step ? 'w-full' : 'w-0',
                  )}
                />
              </div>
            ))}
          </div>
          <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-fog">
            {t('step')} {step + 1} / {STEPS.length}
          </div>
        </div>

        {/* step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="glass flex h-56 items-center justify-center p-6 sm:h-64">
              <current.Art />
            </div>

            <div className="mt-8 text-center">
              <div className={cn('font-mono text-[11px] uppercase tracking-[0.4em]', current.accent)}>
                {t('step')} {step + 1}
              </div>
              <h1 className="mt-2 font-display text-3xl font-extrabold tracking-[0.1em] text-white sm:text-4xl">
                {t(current.titleKey)}
              </h1>
              <p className="mx-auto mt-4 max-w-md font-mono text-sm leading-relaxed text-fog">
                {t(current.textKey)}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* controls */}
        <div className="mt-10 flex items-center justify-between gap-4">
          {step > 0 ? (
            <button
              type="button"
              onClick={prev}
              className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-fog transition-colors hover:text-white"
            >
              <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
              {t('back')}
            </button>
          ) : (
            <span />
          )}

          {last ? (
            <GlowButton to="/light-lab/lab">
              {t('start_lab')}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </GlowButton>
          ) : (
            <GlowButton onClick={next}>
              {t('next')}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </GlowButton>
          )}
        </div>

        {/* modules + roadmap (compact, below the wizard) */}
        <div className="mt-14 grid gap-4 lg:grid-cols-2">
          <div className="glass p-6">
            <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-fog">
              {t('tut_modules')}
            </div>
            <ul className="space-y-3">
              {LAB_STATIONS.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-4">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-fog">{s.code}</span>
                  <span className="flex-1 font-display text-xs font-bold uppercase tracking-[0.15em] text-white">
                    {t(s.nameKey as TKey)}
                  </span>
                  <span
                    className={cn(
                      'border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.25em]',
                      s.status === 'locked'
                        ? 'border-white/10 text-fog/60'
                        : 'border-electric/50 text-electric',
                    )}
                  >
                    {s.status === 'locked' ? t('locked') : t('open')}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass p-6">
            <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-fog">
              {t('tut_roadmap')}
            </div>
            <ul className="space-y-4">
              {ROADMAP.map((s) => (
                <li key={s.n} className="flex gap-4">
                  <span className="font-mono text-lg font-bold text-electric">{s.n}</span>
                  <div>
                    <div className="font-display text-xs font-bold uppercase tracking-[0.15em] text-white">
                      {t(s.titleKey)}
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-fog">{t(s.textKey)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
