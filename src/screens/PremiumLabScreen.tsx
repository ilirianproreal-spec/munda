import { TopBar } from '../components/layout/TopBar';
import { LabStage } from '../components/lab/LabStage';
import { LabPanel } from '../components/lab/LabPanel';
import { useT } from '../lib/translations';
import { cn } from '../lib/cn';

const METADATA = ['plab_meta_1', 'plab_meta_2', 'plab_meta_3'] as const;

/**
 * MUNDA LIGHT LAB — premium interactive experience.
 * Phase 01: composition, layout, visual hierarchy, containers and
 * interface structure. Phase 02 wires the interactive lighting engine.
 */
export function PremiumLabScreen() {
  const t = useT();

  return (
    <div className="relative min-h-screen overflow-x-clip bg-ink">
      <TopBar />

      <main className="mx-auto w-full max-w-[1500px] px-6 pb-14 pt-24">
        {/* ——— header ——— */}
        <header className="max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-electric/60" />
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-electric">{t('plab_kicker')}</span>
          </div>

          <h1 className="mt-6 font-display text-5xl font-extrabold leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
            {t('plab_h1_a')}
            <br />
            {t('plab_h1_b')} <span className="text-electric">{t('plab_h1_accent')}</span>
          </h1>

          <p className="mt-6 max-w-xl font-mono text-sm leading-relaxed text-fog">{t('plab_desc')}</p>

          {/* technical metadata */}
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2.5">
            {METADATA.map((m, i) => (
              <span key={m} className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.25em] text-fog">
                <span className={cn('size-1 rounded-full', i === METADATA.length - 1 ? 'bg-electric' : 'bg-fog/50')} />
                {t(m)}
              </span>
            ))}
          </div>
        </header>

        {/* ——— stage + panel ——— */}
        <div className="mt-12 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <LabStage className="order-1" />
          <LabPanel className="order-2 lg:order-none lg:sticky lg:top-20" />
        </div>
      </main>
    </div>
  );
}
