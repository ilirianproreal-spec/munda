import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLabStore } from '../../store/labStore';
import { useT } from '../../lib/translations';
import { play } from '../../lib/sound';

/**
 * Chapter 06 — GLOBAL. The closing cinematic of the journey:
 * the same LED light guide, now in every door — Audi production sites,
 *  the MUNDA engineering statement, and the MUNDA dedication.
 */
const PLANTS = ['INGOLSTADT', 'NECKARSULM', 'GYŐR', 'BRATISLAVA', 'MÉXICO', 'CHANGCHUN'];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

export function GlobalOverlay() {
  const t = useT();
  const phase = useLabStore((s) => s.testPhase);
  const exitGlobal = useLabStore((s) => s.exitGlobal);
  const navigate = useNavigate();

  if (phase !== 'global') return null;

  const backToLab = () => {
    play('click');
    exitGlobal();
  };

  const exitExperience = () => {
    play('click');
    navigate('/light-lab');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[65] flex items-center justify-center overflow-hidden bg-ink"
    >
      <motion.div variants={container} initial="hidden" animate="show" className="mx-auto w-full max-w-3xl px-6 text-center">
        {/* the same light guide, closing the loop */}
        <motion.div
          variants={item}
          className="mx-auto h-[2px] w-16 rounded-full bg-electric/80 shadow-[0_0_18px_rgba(0,229,255,0.55)]"
        />

        <motion.div variants={item} className="mt-8 font-mono text-[10px] uppercase tracking-[0.5em] text-white/40">
          {t('global_kicker')}
        </motion.div>

        <motion.h1 variants={item} className="mt-5 font-display font-extrabold uppercase leading-tight">
          <span className="block text-3xl tracking-[0.14em] text-white sm:text-5xl">{t('global_title_1')}</span>
          <span className="mt-2 block text-4xl tracking-[0.14em] text-electric [text-shadow:0_0_40px_rgba(0,229,255,0.4)] sm:text-6xl">
            {t('global_title_2')}
          </span>
        </motion.h1>

        <motion.div variants={item} className="mt-10 font-mono text-[9px] uppercase tracking-[0.35em] text-fog/70">
          {t('global_network')}
        </motion.div>

        {/* Audi production network */}
        <motion.div variants={item} className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2.5 sm:grid-cols-3">
          {PLANTS.map((p) => (
            <div key={p} className="flex items-center justify-center gap-2 font-mono text-[11px] tracking-[0.25em] text-white/70">
              <span className="inline-block size-1 rounded-full bg-electric/60" />
              {p}
            </div>
          ))}
        </motion.div>

        <motion.div variants={item} className="mt-12 font-mono text-[9px] uppercase tracking-[0.3em] text-white/30">
          {t('global_line')}
        </motion.div>

        <motion.div variants={item} className="mt-4 font-mono text-[10px] uppercase tracking-[0.45em] text-electric/90">
          {t('global_for')}
        </motion.div>

        <motion.div variants={item} className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={backToLab}
            className="group inline-flex items-center gap-3 border border-electric/60 px-7 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-electric transition-colors duration-300 hover:bg-electric/10"
          >
            <ArrowLeft className="size-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            {t('global_return')}
          </button>
          <button
            type="button"
            onClick={exitExperience}
            className="group inline-flex items-center gap-3 border border-white/20 px-7 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-white/70 transition-colors duration-300 hover:border-white/40 hover:text-white"
          >
            {t('global_exit')}
            <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
