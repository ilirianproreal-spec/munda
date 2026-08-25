import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useScroll, useTransform } from 'framer-motion';
import { Play, ArrowDown } from 'lucide-react';
import { LightField } from '../components/fx/LightField';
import { GlowButton } from '../components/ui/GlowButton';
import { useT } from '../lib/translations';

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
};

export function Hero() {
  const t = useT();
  const { scrollY } = useScroll();
  const contentY = useTransform(scrollY, [0, 700], [0, 110]);
  const contentOpacity = useTransform(scrollY, [0, 550], [1, 0.15]);
  const bgY = useTransform(scrollY, [0, 700], [0, -60]);

  return (
    <section id="hero" className="relative flex min-h-screen flex-col overflow-hidden">
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        <LightField className="h-full w-full" />
        <div className="pointer-events-none absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-electric/15 blur-[130px]" />
        <div className="pointer-events-none absolute -right-40 bottom-1/4 h-96 w-96 rounded-full bg-violet/15 blur-[130px]" />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-blueprint [mask-image:radial-gradient(ellipse_75%_65%_at_50%_40%,black,transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(5,5,8,0.95)_100%)]" />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 pb-24 pt-36"
      >
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl">
          <motion.div
            variants={item}
            className="mb-7 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.4em] text-electric"
          >
            <span className="inline-block size-1.5 animate-pulse-dot rounded-full bg-electric" />
            {t('hero_kicker')}
          </motion.div>

          <motion.h1
            variants={item}
            className="font-display text-6xl font-extrabold leading-[0.95] tracking-tight text-white sm:text-7xl md:text-8xl"
          >
            {t('hero_title_1')}
            <br />
            <span className="bg-gradient-to-r from-electric via-electric-bright to-violet bg-clip-text text-transparent [filter:drop-shadow(0_0_40px_rgba(0,229,255,0.35))]">
              {t('hero_title_2')}
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-7 max-w-xl font-mono text-sm leading-relaxed tracking-[0.05em] text-fog md:text-base"
          >
            {t('hero_sub')}
          </motion.p>

          <motion.div variants={item} className="mt-12 flex flex-col items-start gap-4 sm:flex-row">
            <GlowButton
              onClick={() =>
                document.getElementById('technology')?.scrollIntoView({ behavior: 'smooth' })
              }
              variant="glass"
            >
              {t('explore_technology')}
            </GlowButton>
            <GlowButton to="/light-lab">
              <Play className="size-4 fill-current" />
              {t('enter_light_lab')}
            </GlowButton>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="relative z-10 flex items-center justify-center gap-3 pb-8 font-mono text-[9px] uppercase tracking-[0.35em] text-fog/60"
      >
        {t('scroll')}
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="inline-flex"
        >
          <ArrowDown className="size-3.5" />
        </motion.span>
      </motion.div>
    </section>
  );
}
