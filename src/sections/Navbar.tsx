import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { LogoMark } from '../components/layout/LogoMark';
import { LangToggle } from '../components/ui/LangToggle';
import { useT } from '../lib/translations';
import { cn } from '../lib/cn';

export function Navbar() {
  const t = useT();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goAnchor = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setOpen(false);
    if (location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  };

  const ANCHOR_LINKS = [
    { label: t('nav_technology'), id: 'technology' },
    { label: t('nav_automotive'), id: 'automotive' },
  ];

  const PAGE_LINKS = [
    { label: t('nav_light_lab'), to: '/light-lab' },
    { label: t('nav_about'), to: '/about' },
    { label: t('nav_careers'), to: '/careers' },
  ];

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled || open
          ? 'border-b border-white/5 bg-ink/75 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3 text-white" onClick={() => setOpen(false)}>
          <LogoMark className="h-7 w-7 text-electric" />
          <span className="font-display text-base font-extrabold tracking-[0.3em]">MUNDA</span>
        </Link>

        {/* desktop */}
        <nav className="hidden items-center gap-8 lg:flex">
          {ANCHOR_LINKS.map((l) => (
            <a
              key={l.id}
              href={`/#${l.id}`}
              onClick={(e) => goAnchor(e, l.id)}
              className="font-mono text-[11px] uppercase tracking-[0.25em] text-fog transition-colors hover:text-white"
            >
              {l.label}
            </a>
          ))}
          {PAGE_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                'font-mono text-[11px] uppercase tracking-[0.25em] transition-colors',
                location.pathname === l.to ? 'text-electric' : 'text-fog hover:text-white',
              )}
            >
              {l.label}
            </Link>
          ))}
          <LangToggle />
        </nav>

        {/* mobile toggle */}
        <div className="flex items-center gap-3 lg:hidden">
          <LangToggle />
          <button
            type="button"
            aria-label={t('nav_menu')}
            onClick={() => setOpen((o) => !o)}
            className="flex size-9 items-center justify-center border border-white/10 text-white"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {/* mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-white/5 bg-ink/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {ANCHOR_LINKS.map((l) => (
                <a
                  key={l.id}
                  href={`/#${l.id}`}
                  onClick={(e) => goAnchor(e, l.id)}
                  className="py-2.5 font-mono text-xs uppercase tracking-[0.25em] text-fog transition-colors hover:text-white"
                >
                  {l.label}
                </a>
              ))}
              {PAGE_LINKS.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'py-2.5 font-mono text-xs uppercase tracking-[0.25em] transition-colors',
                    location.pathname === l.to ? 'text-electric' : 'text-fog hover:text-white',
                  )}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
