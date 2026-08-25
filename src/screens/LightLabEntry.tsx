import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Play, HelpCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TopBar } from '../components/layout/TopBar';
import { LightField } from '../components/fx/LightField';
import { GlowButton } from '../components/ui/GlowButton';
import { SpecTag } from '../components/ui/SpecTag';
import { APP_VERSION } from '../data/lab';
import { useT } from '../lib/translations';

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export default function LightLabEntry() {
  const t = useT();

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-ink">
      <LightField className="absolute inset-0 h-full w-full" />

      <div className="pointer-events-none absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-electric/15 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-1/4 h-96 w-96 rounded-full bg-violet/15 blur-[120px]" />
      <div className="pointer-events-none absolute inset-0 bg-blueprint [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(5,5,8,0.92)_100%)]" />

      <TopBar />

      <Link
        to="/"
        className="absolute left-6 top-20 z-30 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-fog transition-colors hover:text-electric"
      >
        <ArrowLeft className="size-3.5" />
        {t('back_to_munda')}
      </Link>

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
            {t('entry_kicker')}
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
            {t('entry_tagline')}
          </motion.p>

          <motion.div variants={item} className="mt-12 flex flex-col items-center gap-4 sm:flex-row">
            <GlowButton to="/light-lab/lab">
              <Play className="size-4 fill-current" />
              {t('start')}
            </GlowButton>
            <GlowButton to="/light-lab/how" variant="glass">
              <HelpCircle className="size-4" />
              {t('how_it_works')}
            </GlowButton>
          </motion.div>
        </motion.div>

        <div className="mt-16 w-full max-w-3xl animate-fade-up [animation-delay:700ms]">
          <div className="glass grid grid-cols-1 gap-6 px-8 py-6 text-left sm:grid-cols-3">
            <SpecTag k={t('spec_technology')} v={t('spec_tech_value')} />
            <SpecTag k={t('spec_target')} v={t('spec_target_value')} />
            <SpecTag k={t('spec_standard')} v={t('spec_standard_value')} />
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/5">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3 font-mono text-[10px] uppercase tracking-[0.25em] text-fog/70">
          <span>{t('footer_sim')}</span>
          <span className="hidden sm:inline">SIM {APP_VERSION} // LAT 45.4642 N · LON 9.1900 E</span>
        </div>
      </footer>
    </div>
  );
}
