import { ArrowRight } from 'lucide-react';
import { FadeIn } from '../components/FadeIn';
import { GlowButton } from '../components/ui/GlowButton';
import { useT } from '../lib/translations';

export function CareersSection() {
  const t = useT();

  return (
    <section id="careers" className="relative overflow-hidden py-28">
      <div className="pointer-events-none absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-violet/10 blur-[130px]" />
      <div className="mx-auto w-full max-w-7xl px-6">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.4em] text-electric">
            {t('sec_careers')}
          </div>
          <h2 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            {t('careers_title')}
          </h2>
          <p className="mx-auto mt-5 max-w-lg font-mono text-sm leading-relaxed text-fog">
            {t('careers_text')}
          </p>
          <div className="mt-10">
            <GlowButton to="/careers">
              {t('explore_careers')}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </GlowButton>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
