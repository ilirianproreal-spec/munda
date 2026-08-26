import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Download, PencilLine } from 'lucide-react';
import { AudiDoor } from './AudiDoor';
import { buildDoorSvg, shapeById } from '../../lib/doorPaths';
import { useDesignStore } from '../../store/designStore';
import { useT } from '../../lib/translations';
import { play } from '../../lib/sound';
import { cn } from '../../lib/cn';

/** Step 3 — YOUR LIGHT: the clean final result, two actions. */
export function FinalView() {
  const t = useT();
  const design = useDesignStore();
  const setStep = useDesignStore((s) => s.setStep);
  const [saved, setSaved] = useState(false);
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const shape = shapeById(design.shape);

  const handleSave = () => {
    play('click');
    setSaved(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setSaved(false), 2600);
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

  const spec = `${t(`shape_${shape.id}`)} · ${t('ctrl_length')} ${Math.round(design.length)}% · ${t(
    'ctrl_brightness',
  )} ${Math.round(design.brightness)}% · ${design.color.toUpperCase()}`;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center px-6 pb-16 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-center"
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.5em] text-electric">{t('your_light')}</div>
        <div className="fr-title-line mx-auto mt-4 h-px w-40 bg-electric/50" />
        <div className="mt-4 font-mono text-[9px] uppercase tracking-[0.2em] text-fog">{spec}</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="aspect-[400/640] h-[min(64vh,600px)]"
      >
        <AudiDoor design={design} view="front" className="h-full" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8 flex flex-wrap items-center justify-center gap-3"
      >
        <button
          type="button"
          onClick={() => {
            play('click');
            setStep('design');
          }}
          className="inline-flex items-center gap-3 border border-white/20 px-8 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-white/80 transition-colors duration-300 hover:border-white/45 hover:text-white"
        >
          <PencilLine className="size-3.5" />
          {t('edit_light')}
        </button>
        <button
          type="button"
          onClick={handleSave}
          className={cn(
            'inline-flex items-center gap-3 px-8 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-300',
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
        transition={{ delay: 0.6, duration: 0.6 }}
        type="button"
        onClick={handleDownload}
        className="mt-5 inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.3em] text-fog/70 transition-colors hover:text-white"
      >
        <Download className="size-3" />
        {t('download_preview')}
      </motion.button>
    </div>
  );
}
