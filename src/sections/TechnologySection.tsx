import { Layers, Network, Zap } from 'lucide-react';
import { FadeIn } from '../components/FadeIn';

const CARDS = [
  {
    n: '01',
    icon: Layers,
    title: 'Textile',
    text: 'Flexible textile structures designed for integrated lighting.',
    accent: 'text-electric',
    hover: 'hover:border-electric/40 group-hover:text-electric',
  },
  {
    n: '02',
    icon: Network,
    title: 'Optics',
    text: 'Advanced optical structures distribute light across complex surfaces.',
    accent: 'text-violet-bright',
    hover: 'hover:border-violet/40 group-hover:text-violet-bright',
  },
  {
    n: '03',
    icon: Zap,
    title: 'LED',
    text: 'Efficient LED technology enables dynamic and customizable illumination.',
    accent: 'text-electric-bright',
    hover: 'hover:border-electric-bright/40 group-hover:text-electric-bright',
  },
];

export function TechnologySection() {
  return (
    <section id="technology" className="relative py-28">
      <div className="mx-auto w-full max-w-7xl px-6">
        <FadeIn>
          <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.4em] text-electric">
            Technology
          </div>
          <h2 className="max-w-2xl font-display text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
            LIGHTING BEYOND THE VISIBLE
          </h2>
          <p className="mt-6 max-w-2xl font-mono text-sm leading-relaxed text-fog md:text-base">
            MUNDA combines textile structures, optical technologies and intelligent LED systems to
            create flexible and integrated lighting solutions.
          </p>
        </FadeIn>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {CARDS.map((c, i) => (
            <FadeIn key={c.n} delay={i * 0.1}>
              <div
                className={`group glass relative p-8 transition-all duration-300 hover:-translate-y-1 ${c.hover.split(' ')[0]}`}
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-[10px] tracking-[0.3em] text-fog/70">{c.n}</span>
                  <c.icon className={`size-5 transition-colors duration-300 ${c.accent}`} />
                </div>
                <h3 className="mt-10 font-display text-xl font-extrabold uppercase tracking-[0.15em] text-white">
                  {c.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-fog">{c.text}</p>
                <span
                  className={`mt-6 block h-px w-10 bg-white/15 transition-all duration-300 group-hover:w-20 ${c.accent.split(' ')[0].replace('text-', 'bg-')}`}
                />
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
