import { useState } from 'react';
import { StatusLight } from '../ui/StatusLight';
import type { LightEffect } from '../../store/designStore';
import { useT } from '../../lib/translations';
import { cn } from '../../lib/cn';
import { APP_VERSION } from '../../data/lab';

const COLORS = [
  { hex: '#ffffff', key: 'color_white' },
  { hex: '#3b82f6', key: 'color_blue' },
  { hex: '#ff3b30', key: 'color_red' },
  { hex: '#ffb84d', key: 'color_amber' },
] as const;

const EFFECTS: LightEffect[] = ['static', 'pulse', 'wave', 'glow', 'flash'];

function Slider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-fog">{label}</span>
        <span className="font-mono text-[10px] text-white">{Math.round(value)}%</span>
      </div>
      <input type="range" min={0} max={100} value={value} onChange={(e) => onChange(Number(e.target.value))} aria-label={label} />
    </label>
  );
}

/**
 * Phase 01 — the control interface structure.
 * Restrained engineering-tool styling, thin borders, small cyan
 * indicators. Local UI state only — the wiring to the lighting
 * engine arrives in phase 02.
 */
export function LabPanel({ className }: { className?: string }) {
  const t = useT();
  const [power, setPower] = useState(true);
  const [color, setColor] = useState('#ffffff');
  const [brightness, setBrightness] = useState(80);
  const [intensity, setIntensity] = useState(50);
  const [effect, setEffect] = useState<LightEffect>('static');
  const [speed, setSpeed] = useState(50);

  return (
    <aside aria-label="Light Lab control interface" className={cn('border border-line bg-panel/60 p-5', className)}>
      {/* header */}
      <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-electric">{t('plab_panel_title')}</span>
        <StatusLight label={t('reveal_live')} tone="electric" />
      </div>

      {/* POWER */}
      <div className="mb-6">
        <div className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.25em] text-fog">POWER</div>
        <div className="grid grid-cols-2 border border-line">
          {[true, false].map((on) => (
            <button
              key={String(on)}
              type="button"
              onClick={() => setPower(on)}
              aria-pressed={power === on}
              className={cn(
                'py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.3em] transition-colors duration-200',
                power === on ? 'bg-electric/10 text-electric' : 'text-fog hover:text-white',
              )}
            >
              {on ? t('power_on') : t('power_off')}
            </button>
          ))}
        </div>
      </div>

      {/* COLOR */}
      <div className="mb-6">
        <div className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.25em] text-fog">{t('ctrl_color')}</div>
        <div className="grid grid-cols-5 gap-1.5">
          {COLORS.map((c) => (
            <button
              key={c.hex}
              type="button"
              onClick={() => setColor(c.hex)}
              aria-label={t(c.key)}
              title={t(c.key)}
              className={cn(
                'h-8 rounded-[2px] border transition-colors duration-200',
                color === c.hex ? 'border-electric bg-electric/10' : 'border-white/15 hover:border-white/40',
              )}
              style={{ backgroundColor: c.hex }}
            />
          ))}
          <label
            className={cn(
              'relative flex h-8 cursor-pointer items-center justify-center rounded-[2px] border font-mono text-[7px] font-bold tracking-[0.1em] transition-colors',
              COLORS.every((c) => c.hex !== color)
                ? 'border-electric text-electric'
                : 'border-white/15 text-fog hover:border-white/40',
            )}
            title={t('color_custom')}
          >
            {t('color_custom').slice(0, 3)}
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              aria-label={t('color_custom')}
            />
          </label>
        </div>
      </div>

      {/* BRIGHTNESS */}
      <div className="mb-6">
        <Slider label={t('ctrl_brightness')} value={brightness} onChange={setBrightness} />
      </div>

      {/* INTENSITY */}
      <div className="mb-6">
        <Slider label={t('ctrl_intensity')} value={intensity} onChange={setIntensity} />
      </div>

      {/* EFFECT */}
      <div className="mb-6">
        <div className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.25em] text-fog">{t('ctrl_pattern')}</div>
        <div className="grid grid-cols-2 gap-1.5">
          {EFFECTS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setEffect(e)}
              aria-pressed={effect === e}
              className={cn(
                'border px-2 py-2 font-mono text-[8px] uppercase tracking-[0.12em] transition-colors duration-200',
                effect === e
                  ? 'border-electric/60 bg-electric/10 text-electric'
                  : 'border-white/10 text-fog hover:border-white/30 hover:text-white',
              )}
            >
              {t(`effect_${e}`)}
            </button>
          ))}
        </div>
      </div>

      {/* SPEED */}
      <div className="mb-6">
        <Slider label={t('ctrl_speed')} value={speed} onChange={setSpeed} />
      </div>

      {/* footer */}
      <div className="flex items-center justify-between border-t border-line pt-3">
        <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-fog/60">{t('plab_panel_footer')}</span>
        <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-fog/60">V{APP_VERSION}</span>
      </div>
    </aside>
  );
}
