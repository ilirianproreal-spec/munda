import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Navbar } from '../sections/Navbar';
import { Footer } from '../sections/Footer';
import { useT } from '../lib/translations';

/** HOME — one minimal hero, one way forward: TRY LIGHT LAB. */
export default function HomePage() {
  const t = useT();

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-ink">
      <Navbar />

      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 pb-24 pt-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="font-mono text-[11px] uppercase tracking-[0.5em] text-white/40">
            {t('home_sub')}
          </div>

          <h1 className="mt-6 font-display text-7xl font-extrabold tracking-[0.18em] text-white [text-shadow:0_0_60px_rgba(0,229,255,0.25)] sm:text-8xl">
            MUNDA
          </h1>

          {/* the light guide line */}
          <div className="relative mx-auto mt-8 h-[2px] w-56">
            <div className="absolute inset-0 rounded-full bg-electric/25 blur-md" />
            <div className="absolute inset-x-6 inset-y-0 rounded-full bg-electric/70" />
          </div>

          <p className="mx-auto mt-8 max-w-xl font-mono text-sm leading-relaxed tracking-[0.08em] text-fog">
            {t('home_lead')}
          </p>

          <div className="mt-12">
            <Link
              to="/light-lab"
              className="group inline-flex items-center gap-3 bg-electric px-9 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-ink shadow-[0_0_18px_rgba(0,229,255,0.35)] transition-all duration-300 hover:bg-electric-bright"
            >
              {t('home_try')}
              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
