import { FadeIn } from '../components/FadeIn';

const PILLARS = [
  {
    n: '01',
    title: 'Automotive expertise',
    text: 'Interior lighting engineered for the vehicle environment — from door panels to dashboards.',
  },
  {
    n: '02',
    title: 'Textile technology',
    text: 'Light-emitting textile structures that integrate with the surfaces of the cabin.',
  },
  {
    n: '03',
    title: 'Lighting technology',
    text: 'LED systems and optical structures combined into flexible, controllable illumination.',
  },
];

export function AboutSection() {
  return (
    <section id="about" className="relative py-28">
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="grid items-start gap-14 lg:grid-cols-2">
          <FadeIn>
            <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.4em] text-electric">
              About
            </div>
            <h2 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
              ENGINEERING THE FUTURE OF LIGHT
            </h2>
            <p className="mt-6 max-w-lg font-mono text-sm leading-relaxed text-fog md:text-base">
              MUNDA combines automotive expertise, textile technology and lighting technology to
              develop integrated lighting solutions — light that becomes part of the interior
              itself, not an add-on.
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
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-fog">{p.text}</p>
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
