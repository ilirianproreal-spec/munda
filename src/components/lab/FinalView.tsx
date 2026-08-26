import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, PencilLine, RotateCcw } from 'lucide-react';
import { TiltableDoor } from './AudiDoor';
import { buildDoorSvg, shapeById } from '../../lib/doorPaths';
import { DEFAULT_DESIGN, useDesignStore } from '../../store/designStore';
import { useT } from '../../lib/translations';
import { play } from '../../lib/sound';
import { cn } from '../../lib/cn';

/** YOUR DESIGN — the final result, then how the light works. */
export function FinalView() {
  const t = useT();
  const design = useDesignStore();
  const setStep = useDesignStore((s) => s.setStep);
  const resetDesign = useDesignStore((s) => s.resetDesign);
  const [saved, setSaved] = useState(false);
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const shape = shapeById(design.shape);
  const spec = `${t(`shape_${shape.id}`)} · ${t('ctrl_position')} ${Math.round(design.position)}% · ${t(
    'ctrl_brightness',
  )} ${Math.round(design.brightness)}% · ${design.color.toUpperCase()}`;

  const handleSave = () => {
    play('click');
    setSaved(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setSaved(false), 2600);
  };

  const handleReset = () => {
    play('click');
    resetDesign();
  };

  const handleDownload = () => {
    play('click');
    const svg = buildDoorSvg(design);
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hermes-door-light.svg';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 3000);
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center px-6 pb-14 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="text-center"
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.5em] text-electric">{t('your_design')}</div>
        <div className="fr-title-line mx-auto mt-4 h-px w-40 bg-electric/50" />
        <div className="mt-4 font-mono text-[9px] uppercase tracking-[0.2em] text-fog">{spec}</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="aspect-[400/640] h-[min(56vh,540px)]"
      >
        <TiltableDoor design={design} className="h-full" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mt-7 flex flex-wrap items-center justify-center gap-3"
      >
        <button
          type="button"
          onClick={() => {
            play('click');
            setStep('design');
          }}
          className="inline-flex items-center gap-2.5 border border-white/20 px-7 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-white/80 transition-colors duration-300 hover:border-white/45 hover:text-white"
        >
          <PencilLine className="size-3.5" />
          {t('edit')}
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-2.5 border border-white/20 px-7 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-white/80 transition-colors duration-300 hover:border-white/45 hover:text-white"
        >
          <RotateCcw className="size-3.5" />
          {t('reset')}
        </button>
        <button
          type="button"
          onClick={handleSave}
          className={cn(
            'inline-flex items-center gap-2.5 px-8 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-300',
            saved
              ? 'bg-electric text-ink shadow-[0_0_24px_rgba(0,229,255,0.4)]'
              : 'bg-electric text-ink shadow-[0_0_18px_rgba(0,229,255,0.35)] hover:bg-electric-bright',
          )}
        >
          {saved ? <Check className="size-3.5" /> : null}
          {saved ? t('saved_design') : t('save_design')}
        </button>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45, duration: 0.5 }}
        type="button"
        onClick={handleDownload}
        className="mt-4 inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.3em] text-fog/60 transition-colors hover:text-white"
      >
        {t('download_preview')}
      </motion.button>

      {/* how the light works */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.7 }}
        className="mt-14 w-full max-w-2xl border-t border-white/10 pt-8 text-center"
      >
        <div className="font-mono text-[9px] uppercase tracking-[0.4em] text-fog/70">{t('how_works')}</div>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {[
            { label: 'LED', sub: 'light source' },
            { label: 'LIGHT GUIDE', sub: 'carries the light' },
            { label: 'AUDI DOOR', sub: 'shows it' },
          ].map((s, i) => (
            <div key={s.label} className="flex items-center gap-8">
              {i > 0 && <span className="hidden font-mono text-fog/40 sm:block">↓</span>}
              <div>
                <div className="font-display text-xs font-bold tracking-[0.25em] text-white">{s.label}</div>
                <div className="mt-1 font-mono text-[8px] uppercase tracking-[0.2em] text-fog/50">{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-5 max-w-md font-mono text-[10px] leading-relaxed text-fog">{t('how_text')}</p>
      </motion.div>
    </div>
  );
}
