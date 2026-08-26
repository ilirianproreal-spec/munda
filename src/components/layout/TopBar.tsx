import { Link } from 'react-router-dom';
import { Volume2, VolumeX } from 'lucide-react';
import { APP_VERSION } from '../../data/lab';
import { LogoMark } from './LogoMark';
import { LangToggle } from '../ui/LangToggle';
import { useSettingsStore } from '../../store/settingsStore';
import { useT } from '../../lib/translations';
import { play } from '../../lib/sound';
import { cn } from '../../lib/cn';

/** Light Lab chrome — MUNDA mark, sound and language. Nothing else. */
export function TopBar() {
  const t = useT();
  const soundOn = useSettingsStore((s) => s.soundOn);
  const toggleSound = useSettingsStore((s) => s.toggleSound);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/5 bg-ink/60 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-[1500px] items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3 text-white">
          <LogoMark className="h-6 w-6 text-electric" />
          <span className="font-display text-sm font-extrabold tracking-[0.28em]">
            MUNDA <span className="text-electric">{t('brand_light_lab')}</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <LangToggle />
          <button
            type="button"
            onClick={() => {
              play('toggle');
              toggleSound();
            }}
            aria-label={soundOn ? t('sound_off') : t('sound_on')}
            title={soundOn ? t('sound_on') : t('sound_off')}
            className={cn(
              'flex items-center gap-1.5 border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em] transition-colors duration-300',
              soundOn
                ? 'border-electric/40 text-electric hover:border-electric/70'
                : 'border-white/10 text-fog hover:border-white/30',
            )}
          >
            {soundOn ? <Volume2 className="size-3.5" /> : <VolumeX className="size-3.5" />}
            <span className="hidden sm:inline">{soundOn ? t('sound_on') : t('sound_off')}</span>
          </button>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.25em] text-fog md:inline">
            {t('build')} {APP_VERSION}
          </span>
        </div>
      </div>
    </header>
  );
}
