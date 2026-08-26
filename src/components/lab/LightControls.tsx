import { Power } from 'lucide-react';
import { useDesignStore } from '../../store/designStore';
import type { LightEffect } from '../../store/designStore';
import { useT } from '../../lib/translations';
import { play } from '../../lib/sound';
import { cn } from '../../lib/cn';

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

/** The five controls: ON/OFF · COLOR · BRIGHTNESS · EFFECT · SPEED. */
export function LightControls() {
  const t = useT();
  const design = useDesignStore();
  const setDesign = useDesignStore((s) => s.setDesign);

  return (
    <aside className="border border-white/10 bg-white/[0.02] p-5">
      <div className="mb-5 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-electric">{t('controls_header')}</span>
        <span className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.2em] text-fog">
          <span className="size-1.5 animate-pulse-dot rounded-full bg-electric" />
          LIVE
        </span>
      </div>

      {/* ON / OFF */}
      <div className="mb-5">
        <div className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.25em] text-fog">{t('light_section')}</div>
        <button
          type="button"
          onClick={() => {
            play('toggle');
            setDesign({ power: !design.power });
          }}
          className={cn(
            'flex w-full items-center justify-center gap-2.5 border py-3 font-mono text-[10px] font-bold uppercase tracking-[0.3em] transition-colors duration-300',
            design.power
              ? 'border-electric/70 bg-electric/10 text-electric'
              : 'border-white/15 text-fog hover:border-white/35 hover:text-white',
          )}
        >
          <Power className={cn('size-3.5', design.power && 'animate-pulse-soft')} />
          {design.power ? t('power_on') : t('power_off')}
        </button>
      </div>

      {/* COLOR */}
      <div className="mb-5">
        <div className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.25em] text-fog">{t('ctrl_color')}</div>
        <div className="grid grid-cols-5 gap-1.5">
          {COLORS.map((c) => (
            <button
              key={c.hex}
              type="button"
              onClick={() => {
                play('led');
                setDesign({ color: c.hex });
              }}
              aria-label={t(c.key)}
              title={t(c.key)}
              className={cn(
                'h-8 rounded-[3px] border transition-all duration-200',
                design.color === c.hex
                  ? 'scale-110 border-electric-bright shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                  : 'border-white/15 hover:border-white/40',
              )}
              style={{ backgroundColor: c.hex }}
            />
          ))}
          <label
            className="relative flex h-8 cursor-pointer items-center justify-center rounded-[3px] border border-white/15 font-mono text-[7px] font-bold tracking-[0.1em] text-fog transition-colors hover:border-white/40"
            title={t('color_custom')}
          >
            {t('color_custom').slice(0, 3)}
            <input
              type="color"
              value={design.color}
              onChange={(e) => setDesign({ color: e.target.value })}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              aria-label={t('color_custom')}
            />
          </label>
        </div>
      </div>

      {/* BRIGHTNESS */}
      <div className="mb-5">
        <Slider label={t('ctrl_brightness')} value={design.brightness} onChange={(v) => setDesign({ brightness: v })} />
      </div>

      {/* INTENSITY */}
      <div className="mb-5">
        <Slider label={t('ctrl_intensity')} value={design.intensity} onChange={(v) => setDesign({ intensity: v })} />
      </div>

      {/* EFFECT */}
      <div className="mb-5">
        <div className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.25em] text-fog">{t('ctrl_pattern')}</div>
        <div className="grid grid-cols-2 gap-1.5">
          {EFFECTS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => {
                play('toggle');
                setDesign({ effect: e });
              }}
              className={cn(
                'border px-2 py-2 font-mono text-[8px] uppercase tracking-[0.12em] transition-all duration-200',
                design.effect === e
                  ? 'border-electric/70 bg-electric/15 text-electric'
                  : 'border-white/10 text-fog hover:border-white/30 hover:text-white',
              )}
            >
              {t(`effect_${e}`)}
            </button>
          ))}
        </div>
      </div>

      {/* SPEED */}
      <Slider label={t('ctrl_speed')} value={design.speed} onChange={(v) => setDesign({ speed: v })} />
    </aside>
  );
}
