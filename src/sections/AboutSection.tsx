import { FadeIn } from '../components/FadeIn';
import { useT } from '../lib/translations';

export function AboutSection() {
  const t = useT();

  const PILLARS = [
    { n: '01', titleKey: 'pillar_1_title' as const, textKey: 'pillar_1_text' as const },
    { n: '02', titleKey: 'pillar_2_title' as const, textKey: 'pillar_2_text' as const },
    { n: '03', titleKey: 'pillar_3_title' as const, textKey: 'pillar_3_text' as const },
  ];

  return (
    <section id="about" className="relative py-28">
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="grid items-start gap-14 lg:grid-cols-2">
          <FadeIn>
            <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.4em] text-electric">
              {t('sec_about')}
            </div>
            <h2 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
              {t('about_title')}
            </h2>
            <p className="mt-6 max-w-lg font-mono text-sm leading-relaxed text-fog md:text-base">
              {t('about_text')}
            </p>
          </FadeIn>

          <div className="space-y-4">
            {PILLARS.map((p, i) => (
              <FadeIn key={p.n} delay={i * 0.08}>
                <div className="group glass flex gap-5 p-6 transition-all duration-300 hover:border-electric/40">
                  <span className="font-mono text-[10px] tracking-[0.3em] text-electric">
                    {p.n}
                  </span>
                  <div>
                    <h3 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-white">
                      {t(p.titleKey)}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-fog">{t(p.textKey)}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
