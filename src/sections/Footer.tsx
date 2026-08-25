import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogoMark } from '../components/layout/LogoMark';
import { APP_VERSION } from '../data/lab';
import { useT } from '../lib/translations';

export function Footer() {
  const t = useT();
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
              {t('footer_tagline')}
            </p>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-fog/50">
              {t('footer_copyright')}
            </p>
          </div>

          <div>
            <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-fog/60">
              {t('footer_company')}
            </div>
            <ul className="space-y-2.5">
              <li>
                <button
                  type="button"
                  onClick={() => goAnchor('technology')}
                  className="font-mono text-xs uppercase tracking-[0.2em] text-fog transition-colors hover:text-white"
                >
                  {t('nav_technology')}
                </button>
              </li>
              <li>
                <Link
                  to="/light-lab"
                  className="font-mono text-xs uppercase tracking-[0.2em] text-fog transition-colors hover:text-white"
                >
                  {t('nav_light_lab')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-fog/60">
              {t('footer_company')}
            </div>
            <ul className="space-y-2.5">
              <li>
                <Link
                  to="/about"
                  className="font-mono text-xs uppercase tracking-[0.2em] text-fog transition-colors hover:text-white"
                >
                  {t('nav_about')}
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="font-mono text-xs uppercase tracking-[0.2em] text-fog transition-colors hover:text-white"
                >
                  {t('nav_careers')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-fog/60">
              {t('footer_contact')}
            </div>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="mailto:contact@munda.technology"
                  className="font-mono text-xs uppercase tracking-[0.2em] text-fog transition-colors hover:text-white"
                >
                  {t('footer_contact')}
                </a>
              </li>
              <li className="pt-2 font-mono text-[9px] uppercase tracking-[0.2em] text-fog/40">
                {t('sim_build')} {APP_VERSION}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
