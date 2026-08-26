import { motion } from 'framer-motion';
import { AudiDoor } from './AudiDoor';
import { DEFAULT_DESIGN, useDesignStore } from '../../store/designStore';
import type { DoorVariant } from '../../store/designStore';
import { VARIANT_META } from '../../lib/doorPaths';
import { useT } from '../../lib/translations';
import { play } from '../../lib/sound';
import { cn } from '../../lib/cn';

const DOORS: DoorVariant[] = ['01', '02', '03'];

/** Step 1 — CHOOSE YOUR AUDI DOOR. Three clean trim variants, one door. */
export function DoorChoose() {
  const t = useT();
  const setDesign = useDesignStore((s) => s.setDesign);
  const setStep = useDesignStore((s) => s.setStep);

  const choose = (door: DoorVariant) => {
    play('click');
    setDesign({ door });
    setStep('design');
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center px-6 pb-16 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-center"
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.5em] text-white/40">
          HERMES — {t('brand_light_lab')}
        </div>
        <h1 className="mt-4 font-display text-3xl font-extrabold uppercase tracking-[0.1em] text-white sm:text-5xl">
          {t('lab_door_step')}
        </h1>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.25em] text-fog">
          {t('lab_door_sub')}
        </p>
      </motion.div>

      <div className="mt-12 grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
        {DOORS.map((door, i) => (
          <motion.button
            key={door}
            type="button"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => choose(door)}
            className={cn(
              'group border border-white/10 bg-white/[0.02] p-4 text-left transition-colors duration-300',
              'hover:border-electric/50',
            )}
          >
            <AudiDoor design={{ ...DEFAULT_DESIGN, door }} className="mx-auto aspect-[400/640] h-[42vh] max-h-[440px]" />
            <div className="mt-4 flex items-baseline justify-between border-t border-white/10 pt-3">
              <span className="font-mono text-[9px] tracking-[0.3em] text-fog">{door}</span>
              <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors group-hover:text-electric">
                {t(`door_${door}`)}
              </span>
            </div>
            <div className="mt-1 font-mono text-[8px] uppercase tracking-[0.2em] text-fog/50">
              {VARIANT_META[door].texture.toUpperCase()} TRIM
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
