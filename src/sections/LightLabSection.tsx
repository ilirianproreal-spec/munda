import { ArrowRight } from 'lucide-react';
import { FadeIn } from '../components/FadeIn';
import { LightField } from '../components/fx/LightField';
import { GlowButton } from '../components/ui/GlowButton';
import { LogoMark } from '../components/layout/LogoMark';
import { useT } from '../lib/translations';

export function LightLabSection() {
  const t = useT();
  const FLOW = [
    t('flow_design'),
    t('flow_test'),
    t('flow_analyze'),
    t('flow_optimize'),
  ];

  return (
    <section id="light-lab" className="relative overflow-hidden py-28">
      <div className="pointer-events-none absolute -right-40 top-0 h-96 w-96 rounded-full bg-electric/10 blur-[130px]" />
      <div className="mx-auto w-full max-w-7xl px-6">
        <FadeIn className="text-center">
          <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.4em] text-electric">
            {t('sec_light_lab')}
          </div>
          <h2 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            {t('labsec_title')}
          </h2>
          <p className="mx-auto mt-5 max-w-xl font-mono text-sm leading-relaxed text-fog">
            {t('labsec_sub')}
          </p>
        </FadeIn>

        <FadeIn delay={0.15} className="mx-auto mt-14 max-w-3xl">
          <div className="group relative overflow-hidden p-[1px]">
            <div className="absolute inset-0 animate-glow-pulse rounded-none bg-gradient-to-r from-violet/60 via-electric/60 to-violet/60" />
            <div className="relative overflow-hidden bg-ink/90">
              <LightField className="pointer-events-none absolute inset-0 h-full w-full opacity-60" />
              <div className="relative z-10 flex flex-col items-center px-8 py-14 text-center sm:px-14">
                <LogoMark className="h-12 w-12 text-electric" />
                <div className="mt-5 font-display text-2xl font-extrabold tracking-[0.24em] text-white sm:text-3xl">
                  MUNDA <span className="text-electric">LIGHT LAB</span>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                  {FLOW.map((f, i) => (
                    <span key={f} className="flex items-center gap-2">
                      <span className="border border-electric/30 bg-electric/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-electric">
                        {f}
                      </span>
                      {i < FLOW.length - 1 && <ArrowRight className="size-3.5 text-fog/50" />}
                    </span>
                  ))}
                </div>

                <p className="mt-7 max-w-md font-mono text-xs leading-relaxed text-fog">
                  {t('labsec_desc')}
                </p>

                <div className="mt-9">
                  <GlowButton to="/light-lab">
                    {t('launch_light_lab')}
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </GlowButton>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
