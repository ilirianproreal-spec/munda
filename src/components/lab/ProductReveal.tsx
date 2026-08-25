import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, RotateCcw, ArrowLeft } from 'lucide-react';
import { useLabStore } from '../../store/labStore';
import { GlowButton } from '../ui/GlowButton';
import { ProductPanel } from './ProductPanel';
import { MATERIALS, FIBER_CONFIGS } from '../../data/lab';
import { useT } from '../../lib/translations';
import { play } from '../../lib/sound';
import { cn } from '../../lib/cn';

const ROWS = [
  { key: 'uniformity', labelKey: 'metric_uniformity' as const, bar: 'bg-electric' },
  { key: 'energy', labelKey: 'metric_energy' as const, bar: 'bg-electric-bright' },
  { key: 'cost', labelKey: 'metric_cost' as const, bar: 'bg-violet' },
  { key: 'design', labelKey: 'metric_design' as const, bar: 'bg-violet-bright' },
  { key: 'manufacturability', labelKey: 'metric_manufacturability' as const, bar: 'bg-white/70' },
] as const;

export function ProductReveal() {
  const t = useT();
  const phase = useLabStore((s) => s.testPhase);
  const product = useLabStore((s) => s.product);
  const exitProduct = useLabStore((s) => s.exitProduct);
  const setLevel = useLabStore((s) => s.setLevel);

  useEffect(() => {
    if (phase === 'product') play('pass');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  if (phase !== 'product' || !product) return null;

  const { metrics } = product;
  const mat = MATERIALS.find((m) => m.id === product.material) ?? MATERIALS[0];
  const fib = FIBER_CONFIGS.find((f) => f.id === product.fiberConfig) ?? FIBER_CONFIGS[0];
  const colors = [...new Set(product.leds.map((l) => l.color))];
  const avgIntensity = Math.round(
    product.leds.reduce((a, l) => a + l.intensity, 0) / Math.max(1, product.leds.length),
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/85 p-4 backdrop-blur-md sm:p-6"
    >
      <motion.div
        initial={{ scale: 0.95, y: 18, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="glass max-h-[94vh] w-full max-w-5xl overflow-y-auto p-6 sm:p-9"
      >
        <div className="text-center">
          <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.4em] text-electric">
            {t('final_product')}
          </div>
          <h2 className="font-display text-2xl font-extrabold tracking-[0.08em] text-white sm:text-3xl">
            {t('product_model')}
          </h2>
          <p className="mt-2 font-mono text-xs tracking-[0.1em] text-fog">{t('product_sub')}</p>
        </div>

        <div className="mt-8 grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* product shot */}
          <div className="relative">
            <ProductPanel snapshot={product} />

            {/* approval stamp */}
            <motion.div
              initial={{ scale: 0, rotate: -20, opacity: 0 }}
              animate={{ scale: 1, rotate: -12, opacity: 1 }}
              transition={{ delay: 0.6, type: 'spring', stiffness: 260, damping: 16 }}
              className="absolute -top-2 right-2 flex items-center gap-2 border-2 border-electric/80 bg-ink/85 px-4 py-2 shadow-[0_0_30px_rgba(0,229,255,0.35)] sm:right-6"
            >
              <CheckCircle2 className="size-4 text-electric" />
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-electric">
                {t('approved')}
              </span>
            </motion.div>
          </div>

          {/* spec sheet */}
          <div className="glass p-5">
            <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-fog">
              {t('spec_sheet')}
            </div>

            <ul className="space-y-2.5">
              {[
                [t('spec_leds'), `${product.leds.length}`],
                [t('spec_material'), t(mat.nameKey)],
                [t('spec_fibers'), t(fib.nameKey)],
                [t('spec_avg_intensity'), `${avgIntensity}%`],
              ].map(([k, v]) => (
                <li key={k} className="flex items-baseline justify-between border-b border-white/5 pb-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-fog">{k}</span>
                  <span className="font-mono text-xs text-white">{v}</span>
                </li>
              ))}
              <li className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-fog">
                  {t('spec_colors')}
                </span>
                <span className="flex items-center gap-1">
                  {colors.map((c) => (
                    <span
                      key={c}
                      className="size-3 rounded-full border border-white/20"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </span>
              </li>
            </ul>

            <div className="mt-5 space-y-3">
              {ROWS.map((r) => (
                <div key={r.key}>
                  <div className="mb-1 flex items-baseline justify-between">
                    <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-fog">
                      {t(r.labelKey)}
                    </span>
                    <span className="font-mono text-[10px] text-white">
                      {Math.round(metrics[r.key])}%
                    </span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-white/10">
                    <div
                      className={cn('h-full rounded-full transition-all duration-700', r.bar)}
                      style={{ width: `${metrics[r.key]}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 border-t border-white/10 pt-4 text-center">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-fog">
                {t('total_score')}
              </div>
              <div className="mt-1 font-display text-5xl font-extrabold leading-none text-electric [text-shadow:0_0_30px_rgba(0,229,255,0.45)]">
                {Math.round(metrics.total)}
                <span className="text-xl text-fog">/100</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <GlowButton
            variant="glass"
            onClick={() => {
              play('click');
              setLevel(5);
            }}
          >
            <RotateCcw className="size-4" />
            {t('replay_level')}
          </GlowButton>
          <GlowButton
            onClick={() => {
              play('click');
              exitProduct();
            }}
          >
            <ArrowLeft className="size-4" />
            {t('back_to_lab')}
          </GlowButton>
        </div>
      </motion.div>
    </motion.div>
  );
}
