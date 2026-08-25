import { useSettingsStore } from '../../store/settingsStore';
import { play } from '../../lib/sound';
import { cn } from '../../lib/cn';
import type { Lang } from '../../lib/translations';

const OPTS: Array<{ id: Lang; label: string }> = [
  { id: 'en', label: 'EN' },
  { id: 'al', label: 'AL' },
];

export function LangToggle({ className }: { className?: string }) {
  const lang = useSettingsStore((s) => s.lang);
  const setLang = useSettingsStore((s) => s.setLang);

  return (
    <div className={cn('flex border border-white/10', className)} role="group" aria-label="Language">
      {OPTS.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => {
            play('click');
            setLang(o.id);
          }}
          aria-pressed={lang === o.id}
          className={cn(
            'px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.2em] transition-colors duration-200',
            lang === o.id
              ? 'bg-electric text-ink'
              : 'text-fog hover:text-white',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
