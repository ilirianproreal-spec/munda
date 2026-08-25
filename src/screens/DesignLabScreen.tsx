import { TopBar } from '../components/layout/TopBar';
import { DoorPanel } from '../components/lab/DoorPanel';
import { LedControls } from '../components/lab/LedControls';
import { MaterialPicker } from '../components/lab/MaterialPicker';
import { FiberPicker } from '../components/lab/FiberPicker';
import { ProjectStats } from '../components/lab/ProjectStats';
import { TestReport } from '../components/lab/TestReport';
import { MAX_LEDS } from '../data/lab';
import { useLabStore } from '../store/labStore';
import { cn } from '../utils/cn';

export function DesignLabScreen() {
  const ledCount = useLabStore((s) => s.leds.length);
  const testPhase = useLabStore((s) => s.testPhase);

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
            STN-01 · Konfigurim aktiv
            <span className="text-white">
              {ledCount}/{MAX_LEDS} LED
            </span>
          </div>
        </header>

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
