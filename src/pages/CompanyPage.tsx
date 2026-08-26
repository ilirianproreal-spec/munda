import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Navbar } from '../sections/Navbar';
import { Footer } from '../sections/Footer';
import { useT } from '../lib/translations';

/** COMPANY — short, serious. Who Munda is, what it produces, its focus. */
export default function CompanyPage() {
  const t = useT();

  const rows = [
    { k: t('company_who_k'), v: t('company_who_v') },
    { k: t('company_what_k'), v: t('company_what_v') },
    { k: t('company_focus_k'), v: t('company_focus_v') },
  ];

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-ink">
      <Navbar />

      <main className="relative z-10 mx-auto w-full max-w-4xl flex-1 px-6 pb-24 pt-36">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="font-mono text-[11px] uppercase tracking-[0.5em] text-electric">{t('company_kicker')}</div>
          <h1 className="mt-5 font-display text-4xl font-extrabold uppercase leading-tight tracking-[0.08em] text-white sm:text-5xl">
            {t('company_title')}
          </h1>
          <p className="mt-6 max-w-2xl font-mono text-sm leading-relaxed tracking-[0.06em] text-fog">
            {t('company_lead')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14"
        >
          {rows.map((r) => (
            <div
              key={r.k}
              className="grid gap-2 border-t border-white/10 py-6 sm:grid-cols-[220px_1fr] sm:gap-8"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-fog/70">{r.k}</div>
              <p className="max-w-xl font-display text-sm font-medium leading-relaxed tracking-[0.04em] text-white/90">
                {r.v}
              </p>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="mt-12"
        >
          <Link
            to="/light-lab"
            className="group inline-flex items-center gap-3 bg-electric px-8 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-ink shadow-[0_0_18px_rgba(0,229,255,0.35)] transition-all duration-300 hover:bg-electric-bright"
          >
            {t('company_cta')}
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
