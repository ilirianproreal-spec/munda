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
    <div className="relative min-h-screen bg-ink">
      <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-electric/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-violet/10 blur-[120px]" />
      <div className="pointer-events-none fixed inset-0 bg-blueprint [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />

      <TopBar />

      <main className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-16 pt-28">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.35em] text-electric">
            Design Lab
          </div>
          <h1 className="font-display text-4xl font-extrabold tracking-[0.06em] text-white sm:text-5xl">
            DESIGN LAB
          </h1>
          <p className="mt-3 max-w-xl font-mono text-sm leading-relaxed text-fog">
            Pasqyrë e stacioneve të punës. Light Configurator hapet i pari — modulet e tjera
            zhbllokohen ndërsa përparon.
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
                    ? 'cursor-not-allowed border-white/5 bg-white/[0.02] opacity-50'
                    : 'border-white/10 bg-white/[0.03] hover:border-electric/60',
                  isActive && 'border-electric/70',
                )}
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-[10px] tracking-[0.3em] text-fog">{s.code}</span>
                  {locked ? (
                    <Lock className="size-4 text-fog/60" />
                  ) : (
                    <CircleDot
                      className={cn('size-4 text-electric', isActive && 'animate-pulse-dot')}
                    />
                  )}
                </div>
                <h2 className="mt-4 font-display text-lg font-bold uppercase tracking-[0.12em] text-white">
                  {s.name}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-fog">{s.description}</p>
                <span
                  className={cn(
                    'mt-5 inline-block border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.3em]',
                    locked ? 'border-white/10 text-fog/60' : 'border-electric/50 text-electric',
                  )}
                >
                  {locked ? 'I kyçur' : isActive ? 'I zgjedhur' : 'I hapur'}
                </span>
              </motion.button>
            );
          })}
        </div>

        <Panel className="mt-8 flex flex-wrap items-center justify-between gap-3 p-5">
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-fog">
            Moduli aktiv:{' '}
            <span className="text-electric">
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
