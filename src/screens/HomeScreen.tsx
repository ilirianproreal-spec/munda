import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Play, HelpCircle } from 'lucide-react';
import { TopBar } from '../components/layout/TopBar';
import { LightField } from '../components/fx/LightField';
import { GlowButton } from '../components/ui/GlowButton';
import { SpecTag } from '../components/ui/SpecTag';
import { APP_VERSION } from '../data/lab';

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export function HomeScreen() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-ink">
      <LightField className="absolute inset-0 h-full w-full" />

      {/* neon ambience */}
      <div className="pointer-events-none absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-electric/15 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-1/4 h-96 w-96 rounded-full bg-violet/15 blur-[120px]" />
      <div className="pointer-events-none absolute inset-0 bg-blueprint [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(5,5,8,0.92)_100%)]" />

      <TopBar />

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-6 pb-12 pt-28 text-center">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center"
        >
          <motion.div
            variants={item}
            className="glass mb-8 flex items-center gap-3 px-5 py-2 font-mono text-[10px] uppercase tracking-[0.4em] text-electric-bright"
          >
            <span className="inline-block size-1.5 animate-pulse-dot rounded-full bg-electric" />
            MUNDA Automotive · Lighting Division
          </motion.div>

          <motion.h1 variants={item} className="font-display leading-none">
            <span className="block text-2xl font-bold tracking-[0.55em] text-white/85 md:text-3xl">
              MUNDA
            </span>
            <span className="mt-4 block bg-gradient-to-r from-electric via-electric-bright to-violet bg-clip-text text-6xl font-extrabold tracking-[0.08em] text-transparent [filter:drop-shadow(0_0_30px_rgba(0,229,255,0.4))] sm:text-7xl md:text-8xl">
              LIGHT LAB
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-7 max-w-xl font-mono text-base tracking-[0.12em] text-white/70 [text-shadow:0_0_28px_rgba(0,229,255,0.2)] md:text-lg"
          >
            Projekto të ardhmen e ndriçimit automotive
          </motion.p>

          <motion.div variants={item} className="mt-12 flex flex-col items-center gap-4 sm:flex-row">
            <GlowButton to="/lab">
              <Play className="size-4 fill-current" />
              Fillimi
            </GlowButton>
            <GlowButton to="/how" variant="glass">
              <HelpCircle className="size-4" />
              Si funksionon?
            </GlowButton>
          </motion.div>
        </motion.div>

        <div className="mt-16 w-full max-w-3xl animate-fade-up [animation-delay:700ms]">
          <div className="glass grid grid-cols-1 gap-6 px-8 py-6 text-left sm:grid-cols-3">
            <SpecTag k="Teknologjia" v="LED / FIBER / TEXTILE" />
            <SpecTag k="Objektivi" v="NDRIÇIM PANELI DERE" />
            <SpecTag k="Standardi" v="AUTOMOTIVE GRADE" />
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/5">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3 font-mono text-[10px] uppercase tracking-[0.25em] text-fog/70">
          <span>MUNDA Lighting Systems — Internal Simulation</span>
          <span className="hidden sm:inline">SIM {APP_VERSION} // LAT 45.4642 N · LON 9.1900 E</span>
        </div>
      </footer>
    </div>
  );
}
