import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { ArrowRight, ChevronDown, Zap, Network, Layers } from 'lucide-react';
import { TopBar } from '../components/layout/TopBar';
import { LightField } from '../components/fx/LightField';
import { GlowButton } from '../components/ui/GlowButton';
import { Panel } from '../components/ui/Panel';
import { SpecTag } from '../components/ui/SpecTag';
import { APP_VERSION } from '../data/lab';
import { cn } from '../utils/cn';

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

const TECH = [
  {
    icon: Zap,
    code: 'TECH-01',
    name: 'LED Drivers',
    text: 'High-efficiency LED arrays tuned for automotive interior luminance.',
  },
  {
    icon: Network,
    code: 'TECH-02',
    name: 'Optical Fiber',
    text: 'Side-emitting fiber strands route light along the panel geometry.',
  },
  {
    icon: Layers,
    code: 'TECH-03',
    name: 'Smart Textile',
    text: 'Light-emitting textile substrates blend illumination into the surface.',
  },
];

export function HomeScreen() {
  const [briefOpen, setBriefOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <LightField className="absolute inset-0 h-full w-full" />
      <div className="pointer-events-none absolute inset-0 bg-blueprint [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(5,5,8,0.92)_100%)]" />

      <TopBar />

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 pb-10 pt-28">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div
            variants={item}
            className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.35em] text-light"
          >
            <span className="inline-block size-1.5 animate-pulse-dot rounded-full bg-light" />
            MUNDA Automotive · Lighting Division
          </motion.div>

          <motion.h1
            variants={item}
            className="font-display text-6xl font-extrabold leading-none tracking-[0.06em] text-white [text-shadow:0_0_60px_rgba(255,184,77,0.35)] sm:text-7xl md:text-8xl"
          >
            LIGHT <span className="text-light">LAB</span>
          </motion.h1>

          <motion.p variants={item} className="mt-6 max-w-xl font-mono text-sm leading-relaxed text-fog">
            Integrated door-panel lighting systems.
            <br />
            LED drivers · optical fiber · smart textile — engineered in one simulation bench.
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-4">
            <GlowButton to="/lab">
              Enter Lab
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </GlowButton>
            <GlowButton variant="ghost" onClick={() => setBriefOpen((v) => !v)}>
              System brief
              <ChevronDown
                className={cn('size-4 transition-transform duration-300', briefOpen && 'rotate-180')}
              />
            </GlowButton>
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {briefOpen && (
            <motion.section
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-3">
                {TECH.map((t) => (
                  <div key={t.code} className="bg-panel p-6">
                    <t.icon className="mb-4 size-5 text-light" />
                    <div className="mb-2 font-mono text-[10px] tracking-[0.3em] text-fog">{t.code}</div>
                    <div className="mb-1 font-display text-sm font-bold uppercase tracking-[0.15em] text-white">
                      {t.name}
                    </div>
                    <p className="text-sm leading-relaxed text-fog">{t.text}</p>
                  </div>
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        <div className="mt-14 animate-fade-up [animation-delay:600ms]">
          <Panel className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-3">
            <SpecTag k="Technology" v="LED / FIBER / TEXTILE" />
            <SpecTag k="Target" v="DOOR-PANEL LIGHTING" />
            <SpecTag k="Standard" v="AUTOMOTIVE GRADE" />
          </Panel>
        </div>
      </main>

      <footer className="relative z-10 border-t border-line-soft/60">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3 font-mono text-[10px] uppercase tracking-[0.25em] text-fog/70">
          <span>MUNDA Lighting Systems — Internal Simulation</span>
          <span className="hidden sm:inline">SIM {APP_VERSION} // LAT 45.4642 N · LON 9.1900 E</span>
        </div>
      </footer>
    </div>
  );
}
