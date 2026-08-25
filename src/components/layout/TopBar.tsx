import { Link } from 'react-router-dom';
import { APP_VERSION } from '../../data/lab';
import { LogoMark } from './LogoMark';
import { StatusLight } from '../ui/StatusLight';

export function TopBar() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line-soft bg-ink/70 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3 text-white">
          <LogoMark className="h-7 w-7 text-light" />
          <span className="font-display text-sm font-extrabold tracking-[0.28em]">
            MUNDA <span className="text-light">LIGHT LAB</span>
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <StatusLight label="System nominal" tone="amber" className="hidden sm:inline-flex" />
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-fog">
            Build {APP_VERSION}
          </span>
        </div>
      </div>
    </header>
  );
}
