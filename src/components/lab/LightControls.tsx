import { Power } from 'lucide-react';
import { SHAPES, shapeById } from '../../lib/doorPaths';
import { useDesignStore } from '../../store/designStore';
import type { LightPattern, ShapeId } from '../../store/designStore';
import { useT } from '../../lib/translations';
import { play } from '../../lib/sound';
import { cn } from '../../lib/cn';

const COLORS = ['#ffffff', '#ffd9a0', '#ffb84d', '#ff3b30', '#00e5ff', '#3b82f6', '#8b5cf6', '#39ff88'];

const PATTERNS: LightPattern[] = ['static', 'pulse', 'flow', 'wave'];

function Slider({
  label,
  value,
  min = 0,
  max = 100,
  unit = '%',
  onChange,
}: {
  label: string;
  value: number;
  min?: number;
  max?: number;
  unit?: string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-fog">{label}</span>
        <span className="font-mono text-[10px] text-white">
          {Math.round(value)}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
      />
    </label>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <span className="h-px w-3 bg-electric/60" />
      <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-electric">{children}</span>
    </div>
  );
}

export function LightControls() {
  const t = useT();
  const design = useDesignStore();
  const setDesign = useDesignStore((s) => s.setDesign);

  const shape = shapeById(design.shape);

  return (
    <aside className="border border-white/10 bg-white/[0.02]">
      {/* ——— LIGHT DESIGN ——— */}
      <section className="border-b border-white/10 p-5">
        <SectionLabel>{t('design_section')}</SectionLabel>

        <div className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.25em] text-fog">{t('ctrl_shape')}</div>
        <div className="mb-5 grid grid-cols-6 gap-1.5">
          {SHAPES.map((s) => {
            const active = design.shape === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  play('toggle');
                  setDesign({ shape: s.id });
                }}
                aria-label={`${t('ctrl_shape')} ${s.id}`}
                className={cn(
                  'flex aspect-square items-center justify-center border transition-colors duration-200',
                  active
                    ? 'border-electric/70 bg-electric/10 text-electric'
                    : 'border-white/10 text-fog/70 hover:border-white/30 hover:text-white',
                )}
              >
                <svg viewBox="0 0 400 640" className="h-6 w-6">
                  <path d={s.d} fill="none" stroke="currentColor" strokeWidth={20} strokeLinecap="round" />
                </svg>
              </button>
            );
          })}
        </div>

        {shape.axis && (
          <div className="mb-5">
            <Slider
              label={t('ctrl_position')}
              value={design.position}
              onChange={(v) => setDesign({ position: v })}
            />
          </div>
        )}

        <div className="mb-5">
          <Slider
            label={t('ctrl_length')}
            value={design.length}
            min={20}
            max={100}
            onChange={(v) => setDesign({ length: v })}
          />
        </div>

        <Slider
          label={t('ctrl_thickness')}
          value={design.thickness}
          min={1}
          max={7}
          unit=""
          onChange={(v) => setDesign({ thickness: v })}
        />
      </section>

      {/* ——— LIGHT ——— */}
      <section className="border-b border-white/10 p-5">
        <SectionLabel>{t('light_section')}</SectionLabel>

        <div className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.25em] text-fog">{t('ctrl_color')}</div>
        <div className="mb-4 grid grid-cols-5 gap-1.5">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                play('led');
                setDesign({ color: c });
              }}
              aria-label={`Color ${c}`}
              className={cn(
                'h-7 rounded-[3px] border transition-all duration-200',
                design.color === c
                  ? 'scale-110 border-electric-bright shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                  : 'border-white/15 hover:border-white/40',
              )}
              style={{ backgroundColor: c }}
            />
          ))}
          <label
            className="relative flex h-7 cursor-pointer items-center justify-center rounded-[3px] border border-white/15 text-[8px] font-bold text-fog transition-colors hover:border-white/40"
            title={t('ctrl_color')}
          >
            +
            <input
              type="color"
              value={design.color}
              onChange={(e) => setDesign({ color: e.target.value })}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              aria-label={t('ctrl_color')}
            />
          </label>
        </div>

        <div className="mb-4">
          <Slider
            label={t('ctrl_brightness')}
            value={design.brightness}
            onChange={(v) => setDesign({ brightness: v })}
          />
        </div>

        <div className="mb-5">
          <Slider label={t('ctrl_glow')} value={design.glow} onChange={(v) => setDesign({ glow: v })} />
        </div>

        <div className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.25em] text-fog">{t('ctrl_pattern')}</div>
        <div className="grid grid-cols-4 gap-1.5">
          {PATTERNS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => {
                play('toggle');
                setDesign({ pattern: p });
              }}
              className={cn(
                'border px-1 py-2 font-mono text-[8px] uppercase tracking-[0.1em] transition-all duration-200',
                design.pattern === p
                  ? 'border-electric/70 bg-electric/15 text-electric'
                  : 'border-white/10 text-fog hover:border-white/30 hover:text-white',
              )}
            >
              {t(`reveal_anim_${p}`)}
            </button>
          ))}
        </div>
      </section>

      {/* ——— PREVIEW ——— */}
      <section className="p-5">
        <SectionLabel>{t('preview_section')}</SectionLabel>
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
      </section>
    </aside>
  );
}
