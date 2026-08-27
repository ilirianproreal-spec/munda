import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { TiltableDoor } from './AudiDoor';
import { LightControls } from './LightControls';
import { useDesignStore } from '../../store/designStore';
import { useT } from '../../lib/translations';

/**
 * The Light Lab — one Audi door, front and centre; the LED light is
 * integrated in the trim and every control changes it live.
 */
export function DesignWorkspace() {
  const t = useT();
  const design = useDesignStore();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1500px] flex-col px-6 pb-10 pt-16">
      {/* jump to the premium 3D experience */}
      <div className="mb-4 flex items-center justify-end">
        <Link
          to="/light-lab/premium"
          className="group inline-flex items-center gap-2 border border-white/10 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.25em] text-fog transition-colors duration-200 hover:border-electric/50 hover:text-electric"
        >
          {t('plab_classic_to_premium')}
          <ArrowRight className="size-3 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="grid flex-1 items-center gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        {/* the door — the main element */}
        <div className="order-1 flex flex-col items-center justify-center">
          <div className="mb-5 font-mono text-[9px] uppercase tracking-[0.35em] text-fog/60">
            [ AUDI DOOR — <span className="text-electric/90">{t('led_light')}</span> ]
          </div>

          <div className="aspect-[400/640] h-[min(76vh,700px)] w-auto">
            <TiltableDoor design={design} className="h-full" />
          </div>

          <div className="mt-3 font-mono text-[8px] uppercase tracking-[0.3em] text-fog/50">
            {t('drag_hint')}
          </div>
        </div>

        {/* the controls — small panel on the side */}
        <div className="order-2 lg:order-none">
          <LightControls />
        </div>
      </div>
    </div>
  );
}
