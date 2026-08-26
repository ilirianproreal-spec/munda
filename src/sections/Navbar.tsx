import { Link, useLocation } from 'react-router-dom';
import { LogoMark } from '../components/layout/LogoMark';
import { LangToggle } from '../components/ui/LangToggle';
import { useT } from '../lib/translations';
import { cn } from '../lib/cn';

const LINKS = [
  { label: 'nav_home', to: '/' },
  { label: 'nav_company', to: '/company' },
  { label: 'nav_light_lab', to: '/light-lab' },
] as const;

/** Website navigation — MUNDA · HOME · COMPANY · LIGHT LAB. */
export function Navbar() {
  const t = useT();
  const location = useLocation();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-ink/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3 text-white">
          <LogoMark className="h-7 w-7 text-electric" />
          <span className="font-display text-base font-extrabold tracking-[0.3em]">MUNDA</span>
        </Link>

        <nav className="flex items-center gap-7">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                'font-mono text-[11px] uppercase tracking-[0.25em] transition-colors',
                location.pathname === l.to || (l.to === '/light-lab' && location.pathname.startsWith('/light-lab'))
                  ? 'text-electric'
                  : 'text-fog hover:text-white',
              )}
            >
              {t(l.label)}
            </Link>
          ))}
          <LangToggle />
        </nav>
      </div>
    </header>
  );
}
