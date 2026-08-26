import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Navbar } from '../sections/Navbar';
import { Footer } from '../sections/Footer';
import { useT } from '../lib/translations';

/**
 * COMPANY — short and serious. Verified content from munda.tech:
 * the joint venture, the technology, the Audi A3 door trim premiere.
 */
export default function CompanyPage() {
  const t = useT();

  const rows = [
    { k: t('company_who_k'), v: t('company_who_v') },
    { k: t('company_what_k'), v: t('company_what_v') },
    { k: t('company_tech_k'), v: t('company_tech_v') },
    { k: t('company_network_k'), v: t('company_network_v') },
  ];

  const awards = [
    { src: '/images/award-gia23.png', alt: 'German Innovation Award 2023' },
    { src: '/images/award-gda24.png', alt: 'German Design Award 2024' },
    { src: '/images/award-lb-design-plus.png', alt: 'Light+Building Design Plus Winner' },
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
          <p className="mt-6 max-w-2xl font-mono text-sm leading-relaxed tracking-[0.05em] text-fog">
            {t('company_lead')}
          </p>
        </motion.div>

        {/* the Audi A3 premiere — image + fact */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 grid items-center gap-8 border-y border-white/10 py-10 md:grid-cols-[1.1fr_1fr]"
        >
          <img
            src="/images/audi-a3-door.jpg"
            alt="Audi A3 door trim with MUNDA textile light"
            className="w-full border border-white/10 bg-white/[0.02]"
            loading="lazy"
          />
          <div>
            <div className="font-mono text-[9px] uppercase tracking-[0.35em] text-electric/90">
              {t('company_focus_k')} — {t('company_kicker')}
            </div>
            <h2 className="mt-3 font-display text-2xl font-extrabold uppercase tracking-[0.08em] text-white">
              Audi A3 — Facelift 2024
            </h2>
            <p className="mt-4 font-mono text-xs leading-relaxed tracking-[0.04em] text-fog">
              {t('company_focus_v')}
            </p>
          </div>
        </motion.div>

        {/* company rows */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10"
        >
          {rows.map((r) => (
            <div key={r.k} className="grid gap-2 border-t border-white/10 py-6 sm:grid-cols-[220px_1fr] sm:gap-8">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-fog/70">{r.k}</div>
              <p className="max-w-xl font-display text-sm font-medium leading-relaxed tracking-[0.04em] text-white/90">
                {r.v}
              </p>
            </div>
          ))}
          <div className="grid gap-2 border-t border-white/10 py-6 sm:grid-cols-[220px_1fr] sm:gap-8">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-fog/70">{t('company_network_k')}</div>
            <div className="font-mono text-[11px] leading-relaxed tracking-[0.12em] text-electric/90">
              {t('company_network_line')}
            </div>
          </div>
        </motion.div>

        {/* recognition */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.7 }}
          className="mt-12 border-t border-white/10 pt-8"
        >
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-fog/70">{t('company_awards')}</div>
          <div className="mt-5 flex flex-wrap items-center gap-5">
            {awards.map((a) => (
              <div key={a.src} className="flex h-16 items-center border border-white/10 bg-white/[0.03] px-5">
                <img src={a.src} alt={a.alt} className="h-9 w-auto opacity-80" loading="lazy" />
              </div>
            ))}
          </div>
          <div className="mt-4 font-mono text-[9px] uppercase tracking-[0.25em] text-fog/50">
            {t('company_award_names')}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.7 }}
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
