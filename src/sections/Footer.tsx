import { Link } from 'react-router-dom';
import { LogoMark } from '../components/layout/LogoMark';
import { APP_VERSION } from '../data/lab';
import { useT } from '../lib/translations';

/** One minimal footer line — the company mark and two destinations. */
export function Footer() {
  const t = useT();

  return (
    <footer className="relative border-t border-white/5">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-8">
        <Link to="/" className="flex items-center gap-3 text-white">
          <LogoMark className="h-6 w-6 text-electric" />
          <span className="font-display text-sm font-extrabold tracking-[0.3em]">MUNDA</span>
        </Link>
        <span className="hidden font-mono text-[9px] uppercase tracking-[0.2em] text-fog/50 lg:inline">
          {t('brand_full')}
        </span>

        <a
          href="mailto:welcome@munda.tech"
          className="hidden font-mono text-[9px] uppercase tracking-[0.2em] text-fog/50 transition-colors hover:text-white md:inline"
        >
          welcome@munda.tech
        </a>

        <nav className="flex items-center gap-6">
          <Link to="/" className="font-mono text-[10px] uppercase tracking-[0.25em] text-fog transition-colors hover:text-white">
            {t('nav_home')}
          </Link>
          <Link to="/company" className="font-mono text-[10px] uppercase tracking-[0.25em] text-fog transition-colors hover:text-white">
            {t('nav_company')}
          </Link>
          <Link to="/light-lab" className="font-mono text-[10px] uppercase tracking-[0.25em] text-fog transition-colors hover:text-white">
            {t('nav_light_lab')}
          </Link>
        </nav>

        <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-fog/40">
          {t('sim_build')} {APP_VERSION}
        </span>
      </div>
    </footer>
  );
}
