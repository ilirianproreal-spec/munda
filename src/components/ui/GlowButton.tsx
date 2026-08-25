import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface GlowButtonProps {
  children: ReactNode;
  to?: string;
  onClick?: () => void;
  variant?: 'primary' | 'ghost';
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
    'group relative inline-flex items-center justify-center gap-3 overflow-hidden px-8 py-3.5 font-mono text-xs font-semibold uppercase tracking-[0.3em] transition-colors duration-300';
  const styles = {
    primary: 'bg-light text-ink hover:bg-light-bright',
    ghost: 'border border-line text-fog hover:border-light/50 hover:text-white',
  };

  const inner = (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
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
