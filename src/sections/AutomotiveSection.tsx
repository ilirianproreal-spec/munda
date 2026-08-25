import { FadeIn } from '../components/FadeIn';
import { InteriorShowcase } from '../components/fx/InteriorShowcase';

export function AutomotiveSection() {
  return (
    <section id="automotive" className="relative overflow-hidden py-28">
      <div className="pointer-events-none absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-violet/10 blur-[130px]" />
      <div className="mx-auto grid w-full max-w-7xl items-center gap-14 px-6 lg:grid-cols-2">
        <FadeIn>
          <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.4em] text-electric">
            Automotive
          </div>
          <h2 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
            LIGHTING AS PART OF THE INTERIOR
          </h2>
          <p className="mt-6 max-w-lg font-mono text-sm leading-relaxed text-fog md:text-base">
            From functional illumination to emotional experiences, integrated lighting transforms
            the way we experience vehicle interiors.
          </p>

          <ul className="mt-10 space-y-4">
            {[
              ['Door panel', 'Light integrated into the door card surface'],
              ['Ambient lighting', 'Dynamic light bars across dashboard and panels'],
              ['Dashboard', 'Optical light guides in the instrument area'],
              ['Textile surfaces', 'Light-emitting textile substrates'],
            ].map(([k, v]) => (
              <li
                key={k}
                className="flex items-baseline gap-4 border-b border-white/5 pb-3"
              >
                <span className="w-40 shrink-0 font-display text-xs font-bold uppercase tracking-[0.18em] text-white">
                  {k}
                </span>
                <span className="font-mono text-xs text-fog">{v}</span>
              </li>
            ))}
          </ul>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="glass p-6 shadow-[0_0_90px_-30px_rgba(0,229,255,0.4)]">
            <InteriorShowcase className="h-auto w-full" />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
