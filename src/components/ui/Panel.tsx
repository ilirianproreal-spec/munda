import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('border border-line bg-panel/70 backdrop-blur-sm', className)}>{children}</div>;
}
