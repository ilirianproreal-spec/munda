import { motion } from 'framer-motion';
import { Lock, CircleDot } from 'lucide-react';
import { TopBar } from '../components/layout/TopBar';
import { Panel } from '../components/ui/Panel';
import { LAB_STATIONS, APP_VERSION } from '../data/lab';
import { useGameStore } from '../store/gameStore';
import { cn } from '../utils/cn';

export function LabScreen() {
  const { activeStation, selectStation } = useGameStore();

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 bg-blueprint [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />

      <TopBar />

      <main className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-16 pt-28">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.35em] text-light">
            Lab Core
          </div>
          <h1 className="font-display text-4xl font-extrabold tracking-[0.06em] text-white sm:text-5xl">
            MODULES
          </h1>
          <p className="mt-3 max-w-xl font-mono text-sm leading-relaxed text-fog">
            Workstation overview. The Light Configurator unlocks first — subsequent modules open as
            you progress.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {LAB_STATIONS.map((s, i) => {
            const isActive = activeStation === s.id;
            const locked = s.status === 'locked';
            return (
              <motion.button
                key={s.id}
                type="button"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => !locked && selectStation(isActive ? null : s.id)}
                className={cn(
                  'group relative border p-6 text-left transition-colors duration-300',
                  locked
                    ? 'cursor-not-allowed border-line bg-panel/40 opacity-55'
                    : 'border-line bg-panel hover:border-light/60',
                  isActive && 'border-light/70',
                )}
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-[10px] tracking-[0.3em] text-fog">{s.code}</span>
                  {locked ? (
                    <Lock className="size-4 text-fog/60" />
                  ) : (
                    <CircleDot className={cn('size-4 text-light', isActive && 'animate-pulse-dot')} />
                  )}
                </div>
                <h2 className="mt-4 font-display text-lg font-bold uppercase tracking-[0.12em] text-white">
                  {s.name}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-fog">{s.description}</p>
                <span
                  className={cn(
                    'mt-5 inline-block border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.3em]',
                    locked ? 'border-line text-fog/60' : 'border-light/50 text-light',
                  )}
                >
                  {locked ? 'Locked' : isActive ? 'Selected' : 'Available'}
                </span>
              </motion.button>
            );
          })}
        </div>

        <Panel className="mt-8 flex flex-wrap items-center justify-between gap-3 p-5">
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-fog">
            Active module:{' '}
            <span className="text-light">
              {activeStation ? LAB_STATIONS.find((s) => s.id === activeStation)?.code ?? '—' : '—'}
            </span>
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-fog/60">
            Gameplay systems — build {APP_VERSION}
          </span>
        </Panel>
      </main>
    </div>
  );
}
