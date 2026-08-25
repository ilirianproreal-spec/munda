import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { TopBar } from '../components/layout/TopBar';
import { GlowButton } from '../components/ui/GlowButton';
import { LEDArt, FiberArt, TextileArt, OptimizeArt } from '../components/fx/TutorialArt';
import { cn } from '../utils/cn';

const STEPS = [
  {
    code: 'HAPI 1',
    title: 'LED',
    text: 'LED-i është burimi i dritës. Ai gjeneron dritën që ndriçon panelin e derës së veturës.',
    Art: LEDArt,
    accent: 'text-electric',
  },
  {
    code: 'HAPI 2',
    title: 'FIBRA OPTIKE',
    text: 'Fibra optike e transporton dritën nga LED-i drejt zonave të ndryshme të panelit — edhe aty ku LED-i nuk mund të vendoset.',
    Art: FiberArt,
    accent: 'text-violet-bright',
  },
  {
    code: 'HAPI 3',
    title: 'TEKSTILI',
    text: 'Struktura tekstile e shpërndan dritën në të gjithë sipërfaqen, duke krijuar një ndriçim të butë dhe uniform.',
    Art: TextileArt,
    accent: 'text-electric-bright',
  },
  {
    code: 'HAPI 4',
    title: 'OPTIMIZO',
    text: 'Gjej kombinimin më të mirë mes ndriçimit, energjisë dhe kostos. Çdo komponent që shton ka efekt në të trija.',
    Art: OptimizeArt,
    accent: 'text-violet-bright',
  },
];

export function TutorialScreen() {
  const [step, setStep] = useState(0);
  const last = step === STEPS.length - 1;
  const current = STEPS[step];
  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="relative flex min-h-screen flex-col bg-ink">
      <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-electric/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-violet/10 blur-[120px]" />
      <div className="pointer-events-none fixed inset-0 bg-blueprint [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />

      <TopBar />

      <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 pb-16 pt-28">
        {/* header + progress */}
        <div className="mb-8">
          <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.35em] text-electric">
            Tutorial — Si funksionon?
          </div>
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => (
              <div key={s.code} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/10">
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
            {current.code} / {STEPS.length}
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
              <div
                className={cn('font-mono text-[11px] uppercase tracking-[0.4em]', current.accent)}
              >
                {current.code}
              </div>
              <h1 className="mt-2 font-display text-3xl font-extrabold tracking-[0.1em] text-white sm:text-4xl">
                {current.title}
              </h1>
              <p className="mx-auto mt-4 max-w-md font-mono text-sm leading-relaxed text-fog">
                {current.text}
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
              Kthehu
            </button>
          ) : (
            <span />
          )}

          {last ? (
            <GlowButton to="/lab">
              Filloni laboratorin
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </GlowButton>
          ) : (
            <GlowButton onClick={next}>
              Tjetër
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </GlowButton>
          )}
        </div>
      </main>
    </div>
  );
}
