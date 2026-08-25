import { ArrowRight } from 'lucide-react';
import { FadeIn } from '../components/FadeIn';
import { GlowButton } from '../components/ui/GlowButton';

export function CareersSection() {
  return (
    <section id="careers" className="relative overflow-hidden py-28">
      <div className="pointer-events-none absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-violet/10 blur-[130px]" />
      <div className="mx-auto w-full max-w-7xl px-6">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.4em] text-electric">
            Careers
          </div>
          <h2 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            BUILD WHAT COMES NEXT.
          </h2>
          <p className="mx-auto mt-5 max-w-lg font-mono text-sm leading-relaxed text-fog">
            Join the people developing new ways to integrate light into the mobility experience.
          </p>
          <div className="mt-10">
            <GlowButton to="/careers">
              Explore Careers
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </GlowButton>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
