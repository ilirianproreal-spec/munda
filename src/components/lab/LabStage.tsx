import { lazy, Suspense, useState } from 'react';
import { StatusLight } from '../ui/StatusLight';
import { TiltableDoor } from './AudiDoor';
import { DEFAULT_DESIGN } from '../../store/designStore';
import { useT } from '../../lib/translations';
import { cn } from '../../lib/cn';

/**
 * Phase 01 — the automotive visualization container (UI kept as designed).
 * The centre now hosts the lazy-loaded 3D scene; the static door SVG acts
 * as the loading fallback so the stage never feels empty.
 */

const LabScene3D = lazy(() => import('./scene/LabScene3D'));

/** Static design for the SVG fallback. */
const STATIC_DESIGN = { ...DEFAULT_DESIGN, brightness: 70, intensity: 35 };

function Corner({ className }: { className?: string }) {
  return <span aria-hidden className={cn('pointer-events-none absolute z-10 h-4 w-4 border-electric/40', className)} />;
}

export function LabStage({ className }: { className?: string }) {
  const t = useT();
  const [doorOpen, setDoorOpen] = useState(false);

  const doorBtn = (active: boolean) =>
    cn(
      'border px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.25em] transition-colors duration-200',
      active ? 'border-electric/60 bg-electric/10 text-electric' : 'border-white/10 text-fog hover:border-white/30 hover:text-white',
    );

  return (
    <section
      aria-label="Automotive visualization"
      className={cn('relative border border-line bg-panel/60', className)}
    >
      {/* engineering grid backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-blueprint opacity-40" />

      {/* corner brackets */}
      <Corner className="-left-px -top-px border-l border-t" />
      <Corner className="-right-px -top-px border-r border-t" />
      <Corner className="-bottom-px -left-px border-b border-l" />
      <Corner className="-bottom-px -right-px border-b border-r" />

      {/* top strip */}
      <div className="relative flex items-center justify-between border-b border-line px-4 py-2.5">
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-fog">[ {t('plab_stage_label')} ]</span>
        <StatusLight label={t('system_nominal')} tone="electric" />
      </div>

      {/* the 3D scene — lazy-loaded, static SVG as fallback */}
      <div className="relative aspect-[16/10] w-full overflow-hidden sm:aspect-[16/9]">
        <Suspense
          fallback={
            <div className="flex h-full items-center justify-center bg-panel/40">
              <TiltableDoor design={STATIC_DESIGN} className="h-[72%]" />
            </div>
          }
        >
          <LabScene3D open={doorOpen} />
        </Suspense>
      </div>

      {/* door control bar */}
      <div className="relative flex items-center gap-2 border-t border-line px-4 py-2.5">
        <button type="button" onClick={() => setDoorOpen(false)} aria-pressed={!doorOpen} className={doorBtn(!doorOpen)}>
          {t('plab_door_close')}
        </button>
        <button type="button" onClick={() => setDoorOpen(true)} aria-pressed={doorOpen} className={doorBtn(doorOpen)}>
          {t('plab_door_open')}
        </button>
        <span className="ml-auto hidden font-mono text-[8px] uppercase tracking-[0.25em] text-fog/50 md:inline">
          {t('plab_scene_hint')}
        </span>
      </div>

      {/* bottom strip */}
      <div className="relative flex items-center justify-between border-t border-line px-4 py-2.5">
        <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-fog/70">MUNDA TEXTILE LIGHT · POF-12</span>
        <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-fog/70">FIELD 04 / 2026</span>
      </div>
    </section>
  );
}
