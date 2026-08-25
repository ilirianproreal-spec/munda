import { FadeIn } from '../components/FadeIn';
import { Navbar } from '../sections/Navbar';
import { Footer } from '../sections/Footer';

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

export default function AboutPage() {
  return (
    <div className="bg-ink text-white">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-6 pb-24 pt-36">
        <FadeIn>
          <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.4em] text-electric">
            About
          </div>
          <h1 className="font-display text-5xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl">
            ENGINEERING THE FUTURE OF LIGHT
          </h1>
          <p className="mt-6 max-w-2xl font-mono text-sm leading-relaxed text-fog md:text-base">
            MUNDA combines automotive expertise, textile technology and lighting technology to
            develop integrated lighting solutions — light that becomes part of the interior itself,
            not an add-on.
          </p>
          <p className="mt-4 max-w-2xl font-mono text-sm leading-relaxed text-fog md:text-base">
            The MUNDA Light Lab is an interactive simulator where the same three technologies —
            LED, optical fibers and textile layers — are combined to design a door-panel lighting
            system.
          </p>
        </FadeIn>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <FadeIn key={p.n} delay={i * 0.08}>
              <div className="group glass h-full p-6 transition-all duration-300 hover:border-electric/40">
                <span className="font-mono text-[10px] tracking-[0.3em] text-electric">{p.n}</span>
                <h3 className="mt-4 font-display text-sm font-bold uppercase tracking-[0.18em] text-white">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-fog">{p.text}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
