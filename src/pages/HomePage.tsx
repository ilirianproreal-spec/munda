import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Navbar } from '../sections/Navbar';
import { Footer } from '../sections/Footer';
import { useT } from '../lib/translations';
import { cn } from '../lib/cn';

/** HOME — the full MUNDA landing: hero, technology, advantages, the Audi A3 premiere. */
export default function HomePage() {
  const t = useT();

  const steps = [
    { k: t('tech_step1_k'), v: t('tech_step1_v') },
    { k: t('tech_step2_k'), v: t('tech_step2_v') },
    { k: t('tech_step3_k'), v: t('tech_step3_v') },
    { k: t('tech_step4_k'), v: t('tech_step4_v') },
  ];

  const advantages = [
    { k: t('adv_space_k'), v: t('adv_space_v') },
    { k: t('adv_cost_k'), v: t('adv_cost_v') },
    { k: t('adv_proto_k'), v: t('adv_proto_v') },
    { k: t('adv_dynamic_k'), v: t('adv_dynamic_v') },
    { k: t('adv_crash_k'), v: t('adv_crash_v') },
  ];

  const specs = [
    { k: t('hero_spec_vehicle_k'), v: t('hero_spec_vehicle_v') },
    { k: t('hero_spec_jv_k'), v: t('hero_spec_jv_v') },
    { k: t('hero_spec_est_k'), v: t('hero_spec_est_v') },
  ];

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-ink">
      <Navbar />

      {/* ————— hero ————— */}
      <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pb-28 pt-28">
        {/* background: soft spotlight pool over the textile-light image */}
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: "url('/images/hero-textile-light.jpg')" }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_62%_58%_at_50%_42%,transparent_0%,rgba(5,5,8,0.5)_55%,rgba(5,5,8,0.93)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-blueprint opacity-[0.35] [mask-image:radial-gradient(ellipse_55%_50%_at_50%_45%,black_0%,transparent_75%)]" />

        {/* corner ticks — automotive viewfinder */}
        <div aria-hidden className="pointer-events-none absolute left-5 top-5 hidden h-8 w-8 border-l border-t border-white/15 sm:block" />
        <div aria-hidden className="pointer-events-none absolute right-5 top-5 hidden h-8 w-8 border-r border-t border-white/15 sm:block" />
        <div aria-hidden className="pointer-events-none absolute bottom-5 left-5 hidden h-8 w-8 border-b border-l border-white/15 sm:block" />
        <div aria-hidden className="pointer-events-none absolute bottom-5 right-5 hidden h-8 w-8 border-b border-r border-white/15 sm:block" />

        {/* vertical edge labels */}
        <div className="pointer-events-none absolute bottom-36 left-7 hidden origin-bottom-left rotate-180 font-mono text-[9px] uppercase tracking-[0.45em] text-white/25 [writing-mode:vertical-rl] lg:block">
          MUNDA — {t('home_sub')}
        </div>
        <div className="pointer-events-none absolute bottom-36 right-7 hidden origin-bottom-left rotate-180 font-mono text-[9px] uppercase tracking-[0.45em] text-white/25 [writing-mode:vertical-rl] lg:block">
          {t('hero_spec_est_v')}
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center text-center">
          {/* kicker */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center gap-4"
          >
            <span className="h-px w-10 bg-white/20" />
            <span className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.5em] text-white/50">
              <span className="size-1 animate-pulse-dot rounded-full bg-electric" />
              {t('home_sub')}
            </span>
            <span className="h-px w-10 bg-white/20" />
          </motion.div>

          {/* wordmark */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 font-display text-[clamp(4rem,13vw,8.5rem)] font-bold leading-none tracking-[0.16em] text-white [text-shadow:0_0_80px_rgba(0,229,255,0.18)]"
          >
            MUNDA
          </motion.h1>

          {/* signature LED line — draws itself in */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto mt-9 h-[2px] w-[min(400px,68vw)] origin-center"
          >
            <div className="absolute inset-0 animate-pulse-soft rounded-full bg-electric/20 blur-md" />
            <div className="absolute inset-x-10 inset-y-0 rounded-full bg-electric/60" />
            <div className="absolute left-1/2 top-1/2 h-[3px] w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric/90 blur-[1px]" />
          </motion.div>

          {/* lead */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-9 max-w-xl font-mono text-sm leading-relaxed tracking-[0.06em] text-fog"
          >
            {t('home_lead')}
          </motion.p>

          {/* spec strip — verified facts */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.52, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 flex flex-col sm:flex-row"
          >
            {specs.map((s, i) => (
              <div
                key={s.k}
                className={cn(
                  'flex flex-col items-center gap-2 px-0 py-4 sm:px-10 sm:py-0',
                  i > 0 && 'border-t border-white/10 sm:border-l sm:border-t-0',
                )}
              >
                <div className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/40">{s.k}</div>
                <div
                  className={cn(
                    'font-mono text-[11px] uppercase tracking-[0.18em]',
                    i === 0 ? 'text-electric' : 'text-white/85',
                  )}
                >
                  {s.v}
                </div>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.64, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-5"
          >
            <Link
              to="/light-lab"
              className="group inline-flex items-center gap-3 bg-electric px-9 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-ink shadow-[0_0_18px_rgba(0,229,255,0.3)] transition-all duration-300 hover:bg-electric-bright hover:shadow-[0_0_28px_rgba(0,229,255,0.5)]"
            >
              {t('home_try')}
              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <a
              href="#technology"
              className="inline-flex items-center gap-3 border border-white/20 px-9 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-white/75 transition-colors duration-300 hover:border-white/50 hover:text-white"
            >
              {t('tech_kicker')}
            </a>
          </motion.div>
        </div>

        {/* scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
        >
          <span className="font-mono text-[8px] uppercase tracking-[0.45em] text-white/35">{t('hero_scroll')}</span>
          <span className="relative block h-12 w-px overflow-hidden bg-white/10">
            <span className="absolute inset-x-0 top-0 h-3 animate-pulse-soft bg-electric/80" />
          </span>
        </motion.div>
      </section>

      {/* ————— technology — how the light is woven ————— */}
      <section id="technology" className="relative mx-auto w-full max-w-6xl px-6 py-24">
        <div className="mb-12">
          <div className="font-mono text-[10px] uppercase tracking-[0.45em] text-electric">{t('tech_kicker')}</div>
          <h2 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-[0.08em] text-white sm:text-4xl">
            {t('land_tech_title')}
          </h2>
          <p className="mt-4 max-w-2xl font-mono text-xs leading-relaxed tracking-[0.05em] text-fog">{t('tech_lead')}</p>
        </div>

        <div className="grid gap-x-12 gap-y-10 lg:grid-cols-2">
          <div>
            {steps.map((s, i) => (
              <div key={s.k} className="grid gap-3 border-t border-white/10 py-6 sm:grid-cols-[64px_1fr]">
                <div className="font-display text-2xl font-extrabold text-electric/60">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/90">{s.k}</div>
                  <p className="mt-2 max-w-md font-mono text-xs leading-relaxed text-fog">{s.v}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col justify-center gap-4">
            <div className="aspect-video w-full overflow-hidden border border-white/10 bg-black">
              <iframe
                src="https://www.youtube-nocookie.com/embed/IGpKJ99Q6Wk"
                title={t('tech_video_caption')}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
            <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-fog/60">{t('tech_video_caption')}</div>
          </div>
        </div>
      </section>

      {/* ————— advantages ————— */}
      <section className="relative mx-auto w-full max-w-6xl px-6 py-24">
        <div className="mb-12">
          <div className="font-mono text-[10px] uppercase tracking-[0.45em] text-electric">{t('adv_kicker')}</div>
          <h2 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-[0.08em] text-white sm:text-4xl">
            {t('adv_title')}
          </h2>
        </div>

        <div className="grid gap-x-12 gap-y-10 md:grid-cols-2">
          {advantages.map((a) => (
            <div key={a.k} className="border-t border-white/10 pt-6">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-electric">{a.k}</div>
              <p className="mt-2 max-w-md font-mono text-xs leading-relaxed text-fog">{a.v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ————— reference — Audi A3 premiere ————— */}
      <section className="relative mx-auto w-full max-w-6xl px-6 pb-28">
        <div className="grid items-center gap-10 border-y border-white/10 py-14 md:grid-cols-2">
          <img
            src="/images/audi-a3-door.jpg"
            alt={t('ref_title')}
            className="w-full border border-white/10 bg-white/[0.02]"
            loading="lazy"
          />
          <div>
            <div className="font-mono text-[9px] uppercase tracking-[0.35em] text-electric/90">{t('ref_kicker')}</div>
            <h2 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-[0.08em] text-white">
              {t('ref_title')}
            </h2>
            <p className="mt-4 max-w-lg font-mono text-xs leading-relaxed tracking-[0.04em] text-fog">{t('ref_text')}</p>
            <Link
              to="/light-lab"
              className="group mt-8 inline-flex items-center gap-3 border border-electric/60 px-8 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-electric transition-colors duration-300 hover:bg-electric/10"
            >
              {t('ref_cta')}
              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
