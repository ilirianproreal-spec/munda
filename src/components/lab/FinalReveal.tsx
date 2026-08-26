import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Download,
  Maximize2,
  Minimize2,
  ArrowLeft,
  Sun,
  Moon,
  Eye,
} from 'lucide-react';
import { useLabStore } from '../../store/labStore';
import type { ProductSnapshot } from '../../store/labStore';
import { GlowButton } from '../ui/GlowButton';
import {
  InteriorScene,
  type RevealAmbientMode,
  type RevealAnimation,
  type RevealCamera,
  type DayNight,
} from './InteriorScene';
import { MATERIALS, FIBER_CONFIGS, FIBER_ANCHORS } from '../../data/lab';
import { gradeFor, ledRadius, strandPath, PANEL_PATH } from '../../lib/light';
import { useT, en, al } from '../../lib/translations';
import type { TKey, Lang } from '../../lib/translations';
import { useSettingsStore } from '../../store/settingsStore';
import { play } from '../../lib/sound';
import { cn } from '../../lib/cn';

const CAMS: Array<[RevealCamera, TKey]> = [
  ['front', 'cam_front'],
  ['door', 'cam_door'],
  ['dashboard', 'cam_dashboard'],
  ['full', 'cam_full'],
];

const AMBIENT_ORDER: RevealAmbientMode[] = ['soft', 'normal', 'sport', 'premium'];
const ANIM_ORDER: RevealAnimation[] = ['static', 'pulse', 'flow', 'wave'];

/* ————————————————— export helpers ————————————————— */

function doorSvg(p: ProductSnapshot, color: string, intensity: number): string {
  const mat = MATERIALS.find((m) => m.id === p.material) ?? MATERIALS[0];
  const fib = FIBER_CONFIGS.find((f) => f.id === p.fiberConfig) ?? FIBER_CONFIGS[0];
  const gradDefs = p.leds
    .map((l) => {
      const a = 0.3 + 0.55 * (l.intensity / 100) * (intensity / 100);
      return `<radialGradient id="s-lg-${l.id}" cx="0.5" cy="0.5" r="0.5"><stop offset="0%" stop-color="${l.color}" stop-opacity="${a}"/><stop offset="45%" stop-color="${l.color}" stop-opacity="${a * 0.4}"/><stop offset="100%" stop-color="${l.color}" stop-opacity="0"/></radialGradient>`;
    })
    .join('');
  const fibers =
    fib.anchors.length > 0
      ? p.leds
          .map((l) =>
            fib.anchors
              .map((aId) => {
                const a = FIBER_ANCHORS[aId];
                return `<path d="${strandPath(l, a)}" stroke="${color}" stroke-opacity="0.45" stroke-width="1.2" fill="none"/>`;
              })
              .join(''),
          )
          .join('')
      : '';
  const glows = p.leds
    .map((l) => {
      const r = ledRadius(l, mat.spread) * (0.5 + (0.5 * intensity) / 100);
      return `<circle cx="${l.x}" cy="${l.y}" r="${r.toFixed(1)}" fill="url(#s-lg-${l.id})"/>`;
    })
    .join('');
  const cores = p.leds
    .map((l) => `<circle cx="${l.x}" cy="${l.y}" r="4" fill="${l.color}"/><circle cx="${l.x}" cy="${l.y}" r="1.8" fill="#ffffff"/>`)
    .join('');
  return `<svg viewBox="0 0 400 640" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:330px;display:block;margin:0 auto"><defs>${gradDefs}</defs><rect x="0" y="0" width="400" height="640" fill="#0a0a12" rx="18"/><path d="${PANEL_PATH}" fill="#101018" stroke="rgba(255,255,255,0.16)"/><g style="mix-blend-mode:screen">${glows}${fibers}</g>${cores}<text x="200" y="616" text-anchor="middle" fill="rgba(255,255,255,0.45)" font-family="monospace" font-size="9" letter-spacing="3">MUNDA LIGHTING</text></svg>`;
}

function buildSummaryHtml(
  p: ProductSnapshot,
  color: string,
  intensity: number,
  lang: Lang,
  projectName: string,
): string {
  const dict = lang === 'al' ? al : en;
  const m = p.metrics;
  const mat = MATERIALS.find((x) => x.id === p.material) ?? MATERIALS[0];
  const fib = FIBER_CONFIGS.find((x) => x.id === p.fiberConfig) ?? FIBER_CONFIGS[0];
  const gradeKey = gradeFor(m.total);
  const grade = dict[gradeKey];
  const date = new Date().toISOString().slice(0, 10);
  const cfg = {
    project: projectName,
    generated: date,
    lightingType: dict.reveal_lighting_type_value,
    ledCount: p.leds.length,
    material: dict[mat.nameKey],
    fiberRouting: dict[fib.nameKey],
    lightColor: color,
    lightIntensity: intensity,
    leds: p.leds.map((l) => ({ x: Math.round(l.x), y: Math.round(l.y), intensity: l.intensity, color: l.color })),
  };
  const json = JSON.stringify({ config: cfg, metrics: { ...m }, grade: dict[gradeKey] }, null, 2);
  const bars: Array<[string, number]> = [
    [dict.reveal_uniformity, m.uniformity],
    [dict.reveal_energy, m.energy],
    [dict.reveal_production, m.cost],
    [dict.reveal_design_quality, m.design],
    [dict.metric_manufacturability, m.manufacturability],
  ];
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${esc(projectName)} — MUNDA Light Lab</title>
<style>
  :root { --ink:#050508; --panel:#0b0b12; --line:#1e1e2a; --electric:#00e5ff; --bright:#7df7ff; --violet:#8b5cf6; --fog:#8e8e9d; }
  * { box-sizing: border-box; margin: 0; }
  body { background: var(--ink); color: #fff; font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; padding: 40px 20px; }
  .wrap { max-width: 880px; margin: 0 auto; }
  .kicker { font-family: Consolas, monospace; font-size: 10px; letter-spacing: 0.35em; color: var(--electric); text-transform: uppercase; }
  h1 { font-size: 28px; letter-spacing: 0.08em; margin: 10px 0 4px; text-transform: uppercase; }
  .sub { font-family: Consolas, monospace; font-size: 11px; letter-spacing: 0.15em; color: var(--fog); margin-bottom: 30px; }
  .grid { display: grid; grid-template-columns: 340px 1fr; gap: 26px; }
  @media (max-width: 700px) { .grid { grid-template-columns: 1fr; } }
  .card { background: var(--panel); border: 1px solid rgba(255,255,255,0.09); border-radius: 10px; padding: 20px; }
  .card h2 { font-family: Consolas, monospace; font-size: 10px; letter-spacing: 0.3em; color: var(--electric); text-transform: uppercase; margin-bottom: 14px; }
  table { width: 100%; border-collapse: collapse; }
  td { padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 12px; }
  td:first-child { color: var(--fog); font-family: Consolas, monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; }
  td:last-child { text-align: right; font-weight: 600; }
  .bar { height: 6px; border-radius: 4px; background: rgba(255,255,255,0.08); overflow: hidden; margin-top: 4px; }
  .bar i { display: block; height: 100%; background: var(--electric); }
  .metric { margin-bottom: 12px; }
  .metric .lbl { display: flex; justify-content: space-between; font-family: Consolas, monospace; font-size: 10px; letter-spacing: 0.12em; color: var(--fog); text-transform: uppercase; }
  .metric .lbl b { color: #fff; }
  .score { display: flex; align-items: baseline; gap: 8px; margin-top: 16px; }
  .score .num { font-size: 44px; font-weight: 800; color: var(--electric); text-shadow: 0 0 24px rgba(0,229,255,0.45); }
  .score .den { color: var(--fog); font-size: 18px; }
  .grade { display: inline-block; margin-top: 14px; border: 1px solid rgba(0,229,255,0.5); color: var(--electric); padding: 6px 14px; font-size: 11px; letter-spacing: 0.25em; }
  .validated { display: inline-block; margin-top: 10px; color: var(--bright); font-size: 11px; letter-spacing: 0.2em; }
  .swatch { display: inline-block; width: 12px; height: 12px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.3); vertical-align: middle; margin-right: 6px; }
  pre { margin-top: 26px; background: #08080e; border: 1px solid var(--line); border-radius: 8px; padding: 16px; font-size: 10px; line-height: 1.5; color: #9fe8f0; overflow-x: auto; white-space: pre-wrap; word-break: break-all; }
  .foot { margin-top: 26px; font-family: Consolas, monospace; font-size: 9px; letter-spacing: 0.3em; color: #4a4a58; text-transform: uppercase; text-align: center; }
</style>
</head>
<body>
<div class="wrap">
  <div class="kicker">MUNDA Lighting · Light Lab</div>
  <h1>${esc(projectName)}</h1>
  <div class="sub">${dict.reveal_sub} — ${date}</div>
  <div class="grid">
    <div class="card">${doorSvg(p, color, intensity)}</div>
    <div>
      <div class="card" style="margin-bottom:16px">
        <h2>${dict.reveal_design_title}</h2>
        <table>
          <tr><td>${dict.reveal_lighting_type}</td><td>${esc(dict.reveal_lighting_type_value)}</td></tr>
          <tr><td>${dict.reveal_led_sources}</td><td>${p.leds.length} × LED</td></tr>
          <tr><td>${dict.reveal_light_color}</td><td><span class="swatch" style="background:${color}"></span>${color}</td></tr>
          <tr><td>${dict.reveal_light_intensity}</td><td>${intensity}%</td></tr>
          <tr><td>${dict.spec_material}</td><td>${esc(dict[mat.nameKey])}</td></tr>
          <tr><td>${dict.spec_fibers}</td><td>${esc(dict[fib.nameKey])}</td></tr>
        </table>
      </div>
      <div class="card">
        <h2>${dict.report_header}</h2>
        ${bars
          .map(
            ([k, v]) =>
              `<div class="metric"><div class="lbl"><span>${esc(k)}</span><b>${Math.round(v)}%</b></div><div class="bar"><i style="width:${Math.round(v)}%"></i></div></div>`,
          )
          .join('')}
        <div class="score"><span class="num">${Math.round(m.total)}</span><span class="den">/ 100</span></div>
        <div class="grade">${esc(grade)}</div>
        <div class="validated">✓ ${dict.reveal_validated}</div>
      </div>
    </div>
  </div>
  <pre>${esc(json)}</pre>
  <div class="foot">${esc(dict.footer_sim)}</div>
</div>
</body>
</html>`;
}

/* ————————————————— UI atoms ————————————————— */

function Seg<T extends string>({
  label,
  options,
  value,
  onChange,
  cols = 4,
}: {
  label: string;
  options: Array<[T, string]>;
  value: T;
  onChange: (v: T) => void;
  cols?: number;
}) {
  return (
    <div className="mb-3">
      <div className="mb-1.5 font-mono text-[8px] uppercase tracking-[0.2em] text-fog">{label}</div>
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {options.map(([v, l]) => (
          <button
            key={v}
            type="button"
            onClick={() => {
              play('toggle');
              onChange(v);
            }}
            className={cn(
              'border px-1 py-1.5 font-mono text-[8px] uppercase tracking-[0.06em] transition-all duration-200',
              value === v
                ? 'border-electric/70 bg-electric/15 text-electric shadow-[0_0_12px_rgba(0,229,255,0.25)]'
                : 'border-white/10 text-fog hover:border-white/30 hover:text-white',
            )}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}

function InfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-white/5 pb-1.5">
      <span className="shrink-0 text-fog">{label}</span>
      <span className="flex items-center justify-end gap-1.5 text-right text-white">{children}</span>
    </div>
  );
}

/* ————————————————— main reveal ————————————————— */

export function FinalReveal() {
  const t = useT();
  const phase = useLabStore((s) => s.testPhase);
  const product = useLabStore((s) => s.product);
  const showProductView = useLabStore((s) => s.showProductView);
  const toGlobal = useLabStore((s) => s.toGlobal);

  const dominantColor = useMemo(() => {
    const counts = new Map<string, number>();
    for (const l of product?.leds ?? []) counts.set(l.color, (counts.get(l.color) ?? 0) + 1);
    let best = '#00e5ff';
    let bestN = -1;
    for (const [c, n] of counts) if (n > bestN) {
      best = c;
      bestN = n;
    }
    return best;
  }, [product]);

  const avgIntensity = useMemo(
    () =>
      product
        ? Math.round(product.leds.reduce((a, l) => a + l.intensity, 0) / Math.max(1, product.leds.length))
        : 100,
    [product],
  );

  const [stage, setStage] = useState<'complete' | 'congrats'>('complete');
  const [camera, setCamera] = useState<RevealCamera>('door');
  const [color, setColor] = useState(dominantColor);
  const [intensity, setIntensity] = useState(avgIntensity);
  const [ambientMode, setAmbientMode] = useState<RevealAmbientMode>('normal');
  const [animation, setAnimation] = useState<RevealAnimation>('flow');
  const [dayNight, setDayNight] = useState<DayNight>('night');
  const [explore, setExplore] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  /* intro: PROJECT COMPLETE → congratulations → scene */
  useEffect(() => {
    if (phase !== 'complete') return;
    const t1 = window.setTimeout(() => setStage('congrats'), 2300);
    const t2 = window.setTimeout(() => {
      play('pass');
      showProductView();
    }, 4700);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [phase, showProductView]);

  /* fresh state on every entry (the component stays mounted between phases) */
  useEffect(() => {
    if (phase !== 'complete') return;
    setStage('complete');
    setCamera('door');
    setExplore(false);
    setAmbientMode('normal');
    setAnimation('flow');
    setDayNight('night');
    setColor(dominantColor);
    setIntensity(avgIntensity);
    setDownloaded(false);
  }, [phase, dominantColor, avgIntensity]);

  /* cinematic zoom-out: mount on the door, pull back to the full cabin */
  useEffect(() => {
    if (phase !== 'product') return;
    setCamera('door');
    const t = window.setTimeout(() => setCamera('full'), 900);
    return () => window.clearTimeout(t);
  }, [phase]);

  if (phase !== 'complete' && phase !== 'product') return null;
  if (!product) return null;

  const m = product.metrics;
  const gradeKey = gradeFor(m.total);
  const projectName = 'MUNDA DOOR LIGHT SYSTEM — SERIES 01';

  const handleDownload = () => {
    play('click');
    const lang = useSettingsStore.getState().lang;
    const html = buildSummaryHtml(product, color, intensity, lang, projectName);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'MUNDA-Project-Summary.html';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 5000);
    setDownloaded(true);
    window.setTimeout(() => setDownloaded(false), 2600);
  };

  const handleBack = () => {
    play('click');
    // chapter 05 QUALITY is complete — continue to chapter 06 GLOBAL
    toGlobal();
  };

  /* ————— intro (PROJECT COMPLETE) ————— */
  if (phase === 'complete') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-[60] flex flex-col items-center justify-center overflow-hidden bg-ink"
      >
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[62vh] w-[62vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric/10 blur-[150px]" />
        <AnimatePresence mode="wait">
          {stage === 'complete' ? (
            <motion.div key="complete" exit={{ opacity: 0, y: -26 }} className="relative text-center">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="mb-5 font-mono text-[11px] uppercase tracking-[0.45em] text-electric"
              >
                LEVEL 5 · {t('l5_name')}
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.55, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-4xl font-extrabold tracking-[0.14em] text-white [text-shadow:0_0_60px_rgba(0,229,255,0.45)] sm:text-6xl"
              >
                {t('reveal_project_complete')}
              </motion.h1>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-2.5">
                {[1, 2, 3, 4, 5].map((n, i) => (
                  <motion.div
                    key={n}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.95 + i * 0.18, type: 'spring', stiffness: 300, damping: 18 }}
                    className="flex items-center gap-2 border border-electric/40 bg-electric/10 px-3 py-1.5"
                  >
                    <CheckCircle2 className="size-3.5 text-electric" />
                    <span className="font-mono text-[10px] tracking-[0.2em] text-electric">{n}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="congrats"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="relative text-center"
            >
              <div className="font-display text-2xl font-bold tracking-[0.06em] text-white sm:text-4xl">
                {t('reveal_congrats')}
              </div>
              <div className="fr-title-line mx-auto mt-6 h-px w-72 bg-gradient-to-r from-transparent via-electric to-transparent" />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-6 font-mono text-[10px] uppercase tracking-[0.35em] text-fog"
              >
                {t('reveal_your_system')} — {t('reveal_sub')}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute bottom-8 left-1/2 h-[2px] w-56 -translate-x-1/2 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full bg-electric"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 4.7, ease: 'linear' }}
          />
        </div>
        <button
          type="button"
          onClick={() => {
            play('click');
            showProductView();
          }}
          className="absolute bottom-5 right-6 border border-white/15 px-4 py-1.5 font-mono text-[9px] uppercase tracking-[0.3em] text-fog transition-colors hover:border-electric/50 hover:text-electric"
        >
          {t('reveal_skip')}
        </button>
      </motion.div>
    );
  }

  /* ————— FINAL PRODUCT REVEAL scene ————— */
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[60] overflow-hidden bg-ink"
    >
      <InteriorScene
        product={product}
        color={color}
        intensity={intensity}
        ambientMode={ambientMode}
        animation={animation}
        dayNight={dayNight}
        camera={camera}
        className="absolute inset-0 h-full w-full"
      />

      {/* title */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="pointer-events-none absolute left-5 top-5 sm:left-7 sm:top-6"
      >
        <div className="font-mono text-[9px] uppercase tracking-[0.4em] text-electric/80">{t('reveal_series')}</div>
        <h2 className="mt-1.5 font-display text-xl font-extrabold tracking-[0.1em] text-white [text-shadow:0_0_30px_rgba(0,229,255,0.35)] sm:text-2xl">
          {t('reveal_your_system')}
        </h2>
        <div className="mt-1 font-mono text-[10px] tracking-[0.22em] text-fog">{t('reveal_sub')}</div>
      </motion.div>

      {/* validated chip */}
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="absolute right-5 top-5 flex items-center gap-2 border border-electric/50 bg-ink/70 px-3.5 py-2 backdrop-blur-md sm:right-7 sm:top-6"
      >
        <CheckCircle2 className="size-3.5 text-electric" />
        <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-electric">{t('reveal_validated')}</span>
      </motion.div>

      {/* ————— YOUR FINAL DESIGN info panel ————— */}
      {!explore && (
        <motion.div
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.1 }}
          className="absolute bottom-5 left-5 hidden w-[300px] sm:left-7 lg:block"
        >
          <div className="glass p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-electric">
                {t('reveal_design_title')}
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.2em] text-electric">
                <span className="size-1 animate-pulse-dot rounded-full bg-electric" />
                {t('reveal_live')}
              </span>
            </div>
            <div className="space-y-1.5 font-mono text-[9px] uppercase tracking-[0.12em]">
              <InfoRow label={t('reveal_lighting_type')}>
                <span className="text-[9px] normal-case tracking-[0.08em]">{t('reveal_lighting_type_value')}</span>
              </InfoRow>
              <InfoRow label={t('reveal_led_sources')}>
                <span>{product.leds.length} × LED</span>
              </InfoRow>
              <InfoRow label={t('reveal_light_color')}>
                <span className="size-2.5 rounded-full border border-white/30" style={{ backgroundColor: color }} />
                <span className="text-[9px] normal-case">{color.toUpperCase()}</span>
              </InfoRow>
              <InfoRow label={t('reveal_light_intensity')}>
                <span>{Math.round(intensity)}%</span>
              </InfoRow>
              <InfoRow label={t('reveal_uniformity')}>
                <span>{Math.round(m.uniformity)}%</span>
              </InfoRow>
              <InfoRow label={t('reveal_energy')}>
                <span>{Math.round(m.energy)}%</span>
              </InfoRow>
              <InfoRow label={t('reveal_production')}>
                <span>{Math.round(m.cost)}%</span>
              </InfoRow>
              <InfoRow label={t('reveal_design_quality')}>
                <span>{Math.round(m.design)}%</span>
              </InfoRow>
            </div>
            <div className="mt-3 flex items-end justify-between border-t border-white/10 pt-2.5">
              <div>
                <div className="font-mono text-[8px] uppercase tracking-[0.25em] text-fog">{t('reveal_overall')}</div>
                <div className="font-display text-2xl font-extrabold leading-none text-electric [text-shadow:0_0_24px_rgba(0,229,255,0.5)]">
                  {Math.round(m.total)}
                  <span className="text-sm text-fog">/100</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-[8px] uppercase tracking-[0.25em] text-fog">{t('reveal_grade')}</div>
                <div className="font-display text-sm font-extrabold tracking-[0.14em] text-electric-bright">
                  {t(gradeKey)}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ————— live controls (right) ————— */}
      {!explore && (
        <motion.div
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2 }}
          className="absolute right-5 top-1/2 hidden w-[270px] -translate-y-1/2 lg:block"
        >
          <div className="glass p-4">
            <div className="mb-3.5 flex items-center justify-between">
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-electric">{t('reveal_controls')}</span>
              <span className="size-1 animate-pulse-dot rounded-full bg-electric" />
            </div>

            {/* intensity */}
            <div className="mb-3.5">
              <div className="mb-1.5 flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.2em] text-fog">
                <span>{t('reveal_intensity_label')}</span>
                <span className="text-electric-bright">{Math.round(intensity)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                aria-label={t('reveal_intensity_label')}
              />
            </div>

            {/* color */}
            <div className="mb-3.5">
              <div className="mb-1.5 flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.2em] text-fog">
                <span>{t('reveal_color_label')}</span>
                <span className="font-mono text-[9px] normal-case tracking-[0.1em] text-white">{color}</span>
              </div>
              <input
                type="color"
                className="fr-color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                aria-label={t('reveal_color_label')}
              />
            </div>

            <Seg
              label={t('reveal_ambient_label')}
              options={[
                ['soft', t('reveal_mode_soft')],
                ['normal', t('reveal_mode_normal')],
                ['sport', t('reveal_mode_sport')],
                ['premium', t('reveal_mode_premium')],
              ]}
              value={ambientMode}
              onChange={setAmbientMode}
            />
            <Seg
              label={t('reveal_anim_label')}
              options={[
                ['static', t('reveal_anim_static')],
                ['pulse', t('reveal_anim_pulse')],
                ['flow', t('reveal_anim_flow')],
                ['wave', t('reveal_anim_wave')],
              ]}
              value={animation}
              onChange={setAnimation}
            />

            {/* day / night */}
            <div>
              <div className="mb-1.5 font-mono text-[8px] uppercase tracking-[0.2em] text-fog">{t('reveal_daynight_label')}</div>
              <div className="grid grid-cols-2 gap-1">
                {(['day', 'night'] as const).map((dn) => (
                  <button
                    key={dn}
                    type="button"
                    onClick={() => {
                      play('toggle');
                      setDayNight(dn);
                    }}
                    className={cn(
                      'flex items-center justify-center gap-2 border px-2 py-2 font-mono text-[9px] uppercase tracking-[0.15em] transition-all duration-200',
                      dayNight === dn
                        ? 'border-electric/70 bg-electric/15 text-electric shadow-[0_0_12px_rgba(0,229,255,0.25)]'
                        : 'border-white/10 text-fog hover:border-white/30 hover:text-white',
                    )}
                  >
                    {dn === 'day' ? <Sun className="size-3" /> : <Moon className="size-3" />}
                    {t(dn === 'day' ? 'reveal_day' : 'reveal_night')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ————— camera bar ————— */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
        className="absolute bottom-5 left-1/2 -translate-x-1/2"
      >
        <div className="glass flex items-center gap-1 p-1">
          <span className="hidden items-center gap-1.5 pr-1.5 pl-2 font-mono text-[8px] uppercase tracking-[0.25em] text-fog sm:flex">
            <Eye className="size-3" />
            {t('reveal_viewer_hint')}
          </span>
          {CAMS.map(([c, key]) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                play('toggle');
                setCamera(c);
              }}
              className={cn(
                'border px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.12em] transition-all duration-200',
                camera === c
                  ? 'border-electric/70 bg-electric/15 text-electric shadow-[0_0_12px_rgba(0,229,255,0.25)]'
                  : 'border-transparent text-fog hover:text-white',
              )}
            >
              {t(key)}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ————— actions ————— */}
      {!explore && (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-5 right-5 flex flex-col items-end gap-2 sm:right-7"
        >
          <GlowButton onClick={() => setExplore(true)} className="px-6! py-2.5! text-[10px]!">
            <Maximize2 className="size-3.5" />
            {t('reveal_explore')}
          </GlowButton>
          <div className="flex gap-2">
            <GlowButton variant="glass" onClick={handleDownload} className="px-4! py-2! text-[9px]!">
              <Download className="size-3.5" />
              {downloaded ? t('reveal_downloaded') : t('reveal_download')}
            </GlowButton>
            <GlowButton variant="glass" onClick={handleBack} className="px-4! py-2! text-[9px]!">
              <ArrowLeft className="size-3.5" />
              {t('reveal_back_lab')}
            </GlowButton>
          </div>
        </motion.div>
      )}

      {/* ————— explore mode: exit ————— */}
      {explore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute right-5 top-5 sm:right-7 sm:top-6"
        >
          <GlowButton variant="glass" onClick={() => setExplore(false)} className="px-5! py-2! text-[10px]!">
            <Minimize2 className="size-3.5" />
            {t('reveal_exit_viewer')}
          </GlowButton>
        </motion.div>
      )}

      {/* ————— compact controls (small screens) ————— */}
      {!explore && (
        <div className="absolute inset-x-3 bottom-16 lg:hidden">
          <div className="glass flex items-center gap-3 overflow-x-auto p-2.5">
            <div className="flex min-w-[130px] flex-1 flex-col">
              <span className="mb-1 font-mono text-[7px] uppercase tracking-[0.2em] text-fog">
                {t('reveal_intensity_label')}
              </span>
              <input
                type="range"
                min={0}
                max={100}
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                aria-label={t('reveal_intensity_label')}
              />
            </div>
            <input
              type="color"
              className="fr-color h-8! w-12!"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              aria-label={t('reveal_color_label')}
            />
            <button
              type="button"
              onClick={() => {
                play('toggle');
                setDayNight(dayNight === 'day' ? 'night' : 'day');
              }}
              className={cn(
                'flex size-9 shrink-0 items-center justify-center border transition-colors',
                dayNight === 'night'
                  ? 'border-electric/60 bg-electric/15 text-electric'
                  : 'border-white/15 text-fog',
              )}
              aria-label={t(dayNight === 'day' ? 'reveal_night' : 'reveal_day')}
            >
              {dayNight === 'day' ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
            <button
              type="button"
              onClick={() => {
                play('toggle');
                setAmbientMode(AMBIENT_ORDER[(AMBIENT_ORDER.indexOf(ambientMode) + 1) % AMBIENT_ORDER.length]);
              }}
              className="shrink-0 border border-white/15 px-2.5 py-2 font-mono text-[8px] uppercase tracking-[0.1em] text-fog"
            >
              {t('reveal_ambient_label')}: {t(`reveal_mode_${ambientMode}`)}
            </button>
            <button
              type="button"
              onClick={() => {
                play('toggle');
                setAnimation(ANIM_ORDER[(ANIM_ORDER.indexOf(animation) + 1) % ANIM_ORDER.length]);
              }}
              className="shrink-0 border border-white/15 px-2.5 py-2 font-mono text-[8px] uppercase tracking-[0.1em] text-fog"
            >
              {t('reveal_anim_label')}: {t(`reveal_anim_${animation}`)}
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
