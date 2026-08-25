import { Layers, Network, Zap } from 'lucide-react';
import { FadeIn } from '../components/FadeIn';
import { useT } from '../lib/translations';

export function TechnologySection() {
  const t = useT();

  const CARDS = [
    {
      n: '01',
      icon: Layers,
      titleKey: 'tech_01_title' as const,
      textKey: 'tech_01_text' as const,
      accent: 'text-electric',
      border: 'hover:border-electric/40',
    },
    {
      n: '02',
      icon: Network,
      titleKey: 'tech_02_title' as const,
      textKey: 'tech_02_text' as const,
      accent: 'text-violet-bright',
      border: 'hover:border-violet/40',
    },
    {
      n: '03',
      icon: Zap,
      titleKey: 'tech_03_title' as const,
      textKey: 'tech_03_text' as const,
      accent: 'text-electric-bright',
      border: 'hover:border-electric-bright/40',
    },
  ];

  return (
    <section id="technology" className="relative py-28">
      <div className="mx-auto w-full max-w-7xl px-6">
        <FadeIn>
          <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.4em] text-electric">
            {t('sec_technology')}
          </div>
          <h2 className="max-w-2xl font-display text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
            {t('tech_title')}
          </h2>
          <p className="mt-6 max-w-2xl font-mono text-sm leading-relaxed text-fog md:text-base">
            {t('tech_text')}
          </p>
        </FadeIn>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {CARDS.map((c, i) => (
            <FadeIn key={c.n} delay={i * 0.1}>
              <div
                className={`group glass relative p-8 transition-all duration-300 hover:-translate-y-1 ${c.border}`}
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-[10px] tracking-[0.3em] text-fog/70">{c.n}</span>
                  <c.icon className={`size-5 transition-colors duration-300 ${c.accent}`} />
                </div>
                <h3 className="mt-10 font-display text-xl font-extrabold uppercase tracking-[0.15em] text-white">
                  {t(c.titleKey)}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-fog">{t(c.textKey)}</p>
                <span
                  className={`mt-6 block h-px w-10 bg-white/15 transition-all duration-300 group-hover:w-20 ${c.accent.replace('text-', 'bg-')}/60`}
                />
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
