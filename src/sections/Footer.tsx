import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogoMark } from '../components/layout/LogoMark';
import { APP_VERSION } from '../data/lab';

export function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const goAnchor = (id: string) => {
    if (location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  };

  return (
    <footer className="relative border-t border-white/5">
      <div className="mx-auto w-full max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3 text-white">
              <LogoMark className="h-8 w-8 text-electric" />
              <span className="font-display text-lg font-extrabold tracking-[0.3em]">MUNDA</span>
            </div>
            <p className="mt-4 max-w-xs font-mono text-xs leading-relaxed text-fog">
              Intelligent textile lighting for the next generation of mobility.
            </p>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-fog/50">
              © 2026 MUNDA Lighting Technology
            </p>
          </div>

          <div>
            <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-fog/60">
              Company
            </div>
            <ul className="space-y-2.5">
              <li>
                <button
                  type="button"
                  onClick={() => goAnchor('technology')}
                  className="font-mono text-xs uppercase tracking-[0.2em] text-fog transition-colors hover:text-white"
                >
                  Technology
                </button>
              </li>
              <li>
                <Link
                  to="/light-lab"
                  className="font-mono text-xs uppercase tracking-[0.2em] text-fog transition-colors hover:text-white"
                >
                  Light Lab
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-fog/60">
              Company
            </div>
            <ul className="space-y-2.5">
              <li>
                <Link
                  to="/about"
                  className="font-mono text-xs uppercase tracking-[0.2em] text-fog transition-colors hover:text-white"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="font-mono text-xs uppercase tracking-[0.2em] text-fog transition-colors hover:text-white"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-fog/60">
              Contact
            </div>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="mailto:contact@munda.technology"
                  className="font-mono text-xs uppercase tracking-[0.2em] text-fog transition-colors hover:text-white"
                >
                  Contact
                </a>
              </li>
              <li className="pt-2 font-mono text-[9px] uppercase tracking-[0.2em] text-fog/40">
                Sim build {APP_VERSION}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
