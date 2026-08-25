import { Link } from 'react-router-dom';
import { APP_VERSION } from '../../data/lab';
import { LogoMark } from './LogoMark';
import { StatusLight } from '../ui/StatusLight';

export function TopBar() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/5 bg-ink/60 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3 text-white">
          <LogoMark className="h-7 w-7 text-electric" />
          <span className="font-display text-sm font-extrabold tracking-[0.28em]">
            MUNDA <span className="text-electric">LIGHT LAB</span>
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <StatusLight label="System nominal" tone="electric" className="hidden sm:inline-flex" />
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-fog">
            Build {APP_VERSION}
          </span>
        </div>
      </div>
    </header>
  );
}
