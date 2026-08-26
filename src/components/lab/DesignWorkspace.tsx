import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Moon, Sun } from 'lucide-react';
import { AudiDoor } from './AudiDoor';
import { LightControls } from './LightControls';
import { useDesignStore } from '../../store/designStore';
import type { DayNight, DoorView } from '../../store/designStore';
import { useT } from '../../lib/translations';
import { play } from '../../lib/sound';
import { cn } from '../../lib/cn';

const VIEWS: Array<[DoorView, string]> = [
  ['front', 'cam_front'],
  ['side', 'cam_side'],
  ['closeup', 'cam_closeup'],
];

/** Step 2 — the workbench: big door, simple controls, live preview. */
export function DesignWorkspace() {
  const t = useT();
  const design = useDesignStore();
  const setDesign = useDesignStore((s) => s.setDesign);
  const setStep = useDesignStore((s) => s.setStep);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-6 pb-10 pt-20">
      {/* header row */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => {
              play('click');
              setStep('door');
            }}
            className="group mb-3 inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.3em] text-fog transition-colors hover:text-white"
          >
            <ArrowLeft className="size-3 transition-transform duration-300 group-hover:-translate-x-1" />
            {t('change_door')}
          </button>
          <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-electric">{t('lab_design_step')}</div>
          <h1 className="mt-1 font-display text-2xl font-extrabold tracking-[0.06em] text-white">
            {t('brand_hermes')} · {t('brand_light_lab')}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* DAY / NIGHT */}
          <div className="flex items-center border border-white/10 p-1">
            {(['day', 'night'] as const).map((dn) => (
              <button
                key={dn}
                type="button"
                onClick={() => {
                  play('toggle');
                  setDesign({ dayNight: dn });
                }}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.2em] transition-colors duration-200',
                  design.dayNight === dn ? 'text-electric' : 'text-fog hover:text-white',
                )}
              >
                {dn === 'day' ? <Sun className="size-3" /> : <Moon className="size-3" />}
                {t(dn === 'day' ? 'reveal_day' : 'reveal_night')}
              </button>
            ))}
          </div>

          {/* FRONT / SIDE / CLOSE-UP */}
          <div className="flex items-center border border-white/10 p-1">
            {VIEWS.map(([v, key]) => (
              <button
                key={v}
                type="button"
                onClick={() => {
                  play('toggle');
                  setDesign({ view: v });
                }}
                className={cn(
                  'border px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.15em] transition-colors duration-200',
                  design.view === v
                    ? 'border-electric/70 bg-electric/15 text-electric'
                    : 'border-transparent text-fog hover:text-white',
                )}
              >
                {t(key)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* workbench */}
      <div className="grid flex-1 items-start gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        <LightControls />

        <div className="relative flex flex-col items-center">
          <motion.div
            key={design.view}
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="aspect-[400/640] h-[min(68vh,640px)] w-auto"
          >
            <AudiDoor design={design} view={design.view} className="h-full" />
          </motion.div>

          <button
            type="button"
            onClick={() => {
              play('click');
              setStep('final');
            }}
            className="group mt-6 inline-flex items-center gap-3 border border-electric/60 px-8 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-electric transition-colors duration-300 hover:bg-electric/10"
          >
            {t('view_your_light')}
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
