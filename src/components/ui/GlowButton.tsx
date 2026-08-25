import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface GlowButtonProps {
  children: ReactNode;
  to?: string;
  onClick?: () => void;
  variant?: 'primary' | 'glass';
  className?: string;
}

export function GlowButton({
  children,
  to,
  onClick,
  variant = 'primary',
  className,
}: GlowButtonProps) {
  const base =
    'group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-[2px] px-9 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.3em] transition-all duration-300';
  const styles = {
    primary:
      'bg-electric text-ink shadow-[0_0_18px_rgba(0,229,255,0.35)] hover:bg-electric-bright hover:shadow-[0_0_36px_rgba(0,229,255,0.6)]',
    glass:
      'glass text-white/85 hover:border-electric/50 hover:bg-white/[0.07] hover:text-electric-bright',
  };

  const inner = (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
      />
      {children}
    </>
  );

  if (to) {
    return (
      <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} className={cn('inline-block', className)}>
        <Link to={to} className={cn(base, styles[variant])}>
          {inner}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      type="button"
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(base, styles[variant], className)}
    >
      {inner}
    </motion.button>
  );
}
