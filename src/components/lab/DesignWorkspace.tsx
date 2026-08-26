import { motion } from 'framer-motion';
import { ArrowRight, Moon, Sun } from 'lucide-react';
import { TiltableDoor } from './AudiDoor';
import { LightControls } from './LightControls';
import { useDesignStore } from '../../store/designStore';
import type { DayNight } from '../../store/designStore';
import { useT } from '../../lib/translations';
import { play } from '../../lib/sound';
import { cn } from '../../lib/cn';

/** The lab: the door immediately, four visible controls, live preview. */
export function DesignWorkspace() {
  const t = useT();
  const design = useDesignStore();
  const setDesign = useDesignStore((s) => s.setDesign);
  const setStep = useDesignStore((s) => s.setStep);

  const setDayNight = (dn: DayNight) => {
    play('toggle');
    setDesign({ dayNight: dn });
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-6 pb-10 pt-20">
      {/* heading */}
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-extrabold uppercase tracking-[0.1em] text-white sm:text-4xl">
          {t('lab_kicker')}
        </h1>
        <p className="mt-2.5 font-mono text-[11px] uppercase tracking-[0.25em] text-fog">
          {t('lab_subtitle')}
        </p>
      </div>

      {/* DAY / NIGHT */}
      <div className="mb-6 flex items-center justify-center">
        <div className="flex items-center border border-white/10 p-1">
          {(['day', 'night'] as const).map((dn) => (
            <button
              key={dn}
              type="button"
              onClick={() => setDayNight(dn)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-1.5 font-mono text-[9px] uppercase tracking-[0.2em] transition-colors duration-200',
                design.dayNight === dn ? 'text-electric' : 'text-fog hover:text-white',
              )}
            >
              {dn === 'day' ? <Sun className="size-3" /> : <Moon className="size-3" />}
              {t(dn === 'day' ? 'reveal_day' : 'reveal_night')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid flex-1 items-start gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
        <LightControls />

        {/* the door — big, centered, draggable */}
        <div className="flex flex-col items-center">
          <motion.div
            key={design.dayNight}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="aspect-[400/640] h-[min(64vh,620px)] w-auto"
          >
            <TiltableDoor design={design} className="h-full" />
          </motion.div>

          <div className="mt-3 font-mono text-[8px] uppercase tracking-[0.3em] text-fog/50">
            {t('drag_hint')}
          </div>

          <button
            type="button"
            onClick={() => {
              play('click');
              setStep('final');
            }}
            className="group mt-6 inline-flex items-center gap-3 border border-electric/60 px-9 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-electric transition-colors duration-300 hover:bg-electric/10"
          >
            {t('view_design')}
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
