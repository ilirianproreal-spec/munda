import { cn } from '../../utils/cn';

const TONES = {
  electric: 'bg-electric animate-pulse-dot',
  violet: 'bg-violet animate-pulse-dot-violet',
  muted: 'bg-fog/40',
} as const;

export function StatusLight({
  label,
  tone = 'electric',
  className,
}: {
  label: string;
  tone?: keyof typeof TONES;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-fog',
        className,
      )}
    >
      <span className={cn('size-1.5 rounded-full', TONES[tone])} />
      {label}
    </span>
  );
}
