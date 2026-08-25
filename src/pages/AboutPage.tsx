import { FadeIn } from '../components/FadeIn';
import { Navbar } from '../sections/Navbar';
import { Footer } from '../sections/Footer';
import { useT } from '../lib/translations';

export default function AboutPage() {
  const t = useT();

  const PILLARS = [
    { n: '01', titleKey: 'pillar_1_title' as const, textKey: 'pillar_1_text' as const },
    { n: '02', titleKey: 'pillar_2_title' as const, textKey: 'pillar_2_text' as const },
    { n: '03', titleKey: 'pillar_3_title' as const, textKey: 'pillar_3_text' as const },
  ];

  return (
    <div className="bg-ink text-white">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-6 pb-24 pt-36">
        <FadeIn>
          <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.4em] text-electric">
            {t('sec_about')}
          </div>
          <h1 className="font-display text-5xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl">
            {t('about_title')}
          </h1>
          <p className="mt-6 max-w-2xl font-mono text-sm leading-relaxed text-fog md:text-base">
            {t('about_text')}
          </p>
          <p className="mt-4 max-w-2xl font-mono text-sm leading-relaxed text-fog md:text-base">
            {t('about_text2')}
          </p>
        </FadeIn>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <FadeIn key={p.n} delay={i * 0.08}>
              <div className="group glass h-full p-6 transition-all duration-300 hover:border-electric/40">
                <span className="font-mono text-[10px] tracking-[0.3em] text-electric">{p.n}</span>
                <h3 className="mt-4 font-display text-sm font-bold uppercase tracking-[0.18em] text-white">
                  {t(p.titleKey)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-fog">{t(p.textKey)}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
