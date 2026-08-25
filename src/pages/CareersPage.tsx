import { ArrowRight } from 'lucide-react';
import { FadeIn } from '../components/FadeIn';
import { GlowButton } from '../components/ui/GlowButton';
import { Navbar } from '../sections/Navbar';
import { Footer } from '../sections/Footer';
import { useT } from '../lib/translations';

export default function CareersPage() {
  const t = useT();

  const VALUES = [
    { n: '01', titleKey: 'careers_val_1_title' as const, textKey: 'careers_val_1_text' as const },
    { n: '02', titleKey: 'careers_val_2_title' as const, textKey: 'careers_val_2_text' as const },
    { n: '03', titleKey: 'careers_val_3_title' as const, textKey: 'careers_val_3_text' as const },
  ];

  return (
    <div className="bg-ink text-white">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-6 pb-24 pt-36">
        <FadeIn>
          <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.4em] text-electric">
            {t('sec_careers')}
          </div>
          <h1 className="font-display text-5xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl">
            {t('careers_title')}
          </h1>
          <p className="mt-6 max-w-xl font-mono text-sm leading-relaxed text-fog md:text-base">
            {t('careers_text')}
          </p>
          <div className="mt-10">
            <GlowButton
              onClick={() => {
                window.location.href = 'mailto:careers@munda.technology';
              }}
            >
              {t('explore_careers')}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </GlowButton>
          </div>
        </FadeIn>

        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {VALUES.map((v, i) => (
            <FadeIn key={v.n} delay={i * 0.08}>
              <div className="glass h-full p-6">
                <span className="font-mono text-[10px] tracking-[0.3em] text-electric">{v.n}</span>
                <h3 className="mt-4 font-display text-sm font-bold uppercase tracking-[0.18em] text-white">
                  {t(v.titleKey)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-fog">{t(v.textKey)}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
