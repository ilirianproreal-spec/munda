import { Check, CircleDot, Lock } from 'lucide-react';
import { TopBar } from '../components/layout/TopBar';
import { DoorPanel } from '../components/lab/DoorPanel';
import { LedControls } from '../components/lab/LedControls';
import { MaterialPicker } from '../components/lab/MaterialPicker';
import { FiberPicker } from '../components/lab/FiberPicker';
import { ProjectStats } from '../components/lab/ProjectStats';
import { TestReport } from '../components/lab/TestReport';
import { MAX_LEDS } from '../data/lab';
import { LEVELS } from '../data/levels';
import { useLabStore } from '../store/labStore';
import { cn } from '../utils/cn';

export function DesignLabScreen() {
  const ledCount = useLabStore((s) => s.leds.length);
  const testPhase = useLabStore((s) => s.testPhase);
  const currentLevel = useLabStore((s) => s.currentLevel);
  const completedLevels = useLabStore((s) => s.completedLevels);
  const setLevel = useLabStore((s) => s.setLevel);

  const levelDef = LEVELS[currentLevel - 1] ?? LEVELS[0];

  return (
    <div className="relative min-h-screen bg-ink">
      <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-electric/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-violet/10 blur-[120px]" />
      <div className="pointer-events-none fixed inset-0 bg-blueprint [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />

      <TopBar />

      <main className="relative z-10 mx-auto w-full max-w-[1440px] px-6 pb-14 pt-24">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.35em] text-electric">
              Design Lab
            </div>
            <h1 className="font-display text-3xl font-extrabold tracking-[0.06em] text-white sm:text-4xl">
              LIGHT CONFIGURATOR
            </h1>
            <p className="mt-2 max-w-xl font-mono text-xs leading-relaxed text-fog">
              Ndërto sinjaturën e dritës së panelit: vendos LED, rrugëto fibra dhe zgjidh tekstilin.
            </p>
          </div>
          <div className="glass flex items-center gap-3 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-fog">
            <span className="inline-block size-1.5 animate-pulse-dot rounded-full bg-electric" />
            Niveli {currentLevel}/5 · Konfigurim aktiv
            <span className="text-white">
              {ledCount}/{MAX_LEDS} LED
            </span>
          </div>
        </header>

        {/* level selector */}
        <div className="mb-3 grid gap-2 sm:grid-cols-5">
          {LEVELS.map((lv) => {
            const completed = completedLevels.includes(lv.id);
            const unlocked = lv.id === 1 || completedLevels.includes(lv.id - 1);
            const current = currentLevel === lv.id;
            return (
              <button
                key={lv.id}
                type="button"
                disabled={!unlocked}
                onClick={() => setLevel(lv.id)}
                className={cn(
                  'relative border px-3 py-2.5 text-left transition-colors duration-300',
                  current
                    ? 'border-electric/70 bg-electric/10'
                    : unlocked
                      ? 'border-white/10 hover:border-white/30'
                      : 'cursor-not-allowed border-white/5 opacity-40',
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      'font-mono text-[9px] tracking-[0.25em]',
                      current ? 'text-electric' : completed ? 'text-electric-bright' : 'text-fog',
                    )}
                  >
                    NIVELI {lv.id}
                  </span>
                  {completed ? (
                    <Check className="size-3.5 text-electric-bright" />
                  ) : unlocked ? (
                    <CircleDot
                      className={cn('size-3 text-fog/50', current && 'animate-pulse-dot text-electric')}
                    />
                  ) : (
                    <Lock className="size-3 text-fog/60" />
                  )}
                </div>
                <div
                  className={cn(
                    'mt-1 font-display text-[11px] font-bold uppercase tracking-[0.12em]',
                    current || unlocked ? 'text-white' : 'text-fog/70',
                  )}
                >
                  {lv.name}
                </div>
              </button>
            );
          })}
        </div>

        {/* current mission */}
        <div className="glass mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-3">
          <div className="flex items-center gap-3">
            <span className="inline-block size-1.5 animate-pulse-dot rounded-full bg-electric" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-electric">
              Misioni aktual
            </span>
          </div>
          <span className="font-display text-xs font-bold uppercase tracking-[0.15em] text-white">
            {levelDef.code} — {levelDef.name}
          </span>
          <span className="hidden font-mono text-[11px] text-fog lg:inline">
            {levelDef.objective}
          </span>
          <div className="flex flex-wrap gap-2">
            {levelDef.constraints.map((c) => (
              <span
                key={c}
                className="border border-white/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em] text-fog/80"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        <div
          className={cn(
            'grid items-start gap-5 transition-opacity duration-300 lg:grid-cols-[300px_minmax(0,1fr)_280px]',
            testPhase === 'running' && 'pointer-events-none opacity-50',
          )}
        >
          <div className="space-y-5">
            <LedControls />
            <MaterialPicker />
            <FiberPicker />
          </div>
          <DoorPanel />
          <ProjectStats />
        </div>

        <TestReport />
      </main>
    </div>
  );
}
