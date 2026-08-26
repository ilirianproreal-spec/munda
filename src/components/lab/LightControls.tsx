import { SHAPES, shapeById } from '../../lib/doorPaths';
import { useDesignStore } from '../../store/designStore';
import { useT } from '../../lib/translations';
import { play } from '../../lib/sound';
import { cn } from '../../lib/cn';

const COLORS = ['#ffffff', '#ffd9a0', '#ffb84d', '#ff3b30', '#00e5ff', '#3b82f6', '#8b5cf6', '#39ff88'];

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

/** The four controls that matter: shape, position, color, brightness. */
export function LightControls() {
  const t = useT();
  const design = useDesignStore();
  const setDesign = useDesignStore((s) => s.setDesign);

  const shape = shapeById(design.shape);

  return (
    <aside className="border border-white/10 bg-white/[0.02] p-5">
      {/* shape */}
      <div className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.25em] text-fog">{t('ctrl_shape')}</div>
      <div className="mb-6 grid grid-cols-6 gap-1.5">
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
              aria-label={`${t('ctrl_shape')} ${t(`shape_${s.id}`)}`}
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

      {/* position */}
      {shape.axis && (
        <div className="mb-6">
          <Slider label={t('ctrl_position')} value={design.position} onChange={(v) => setDesign({ position: v })} />
        </div>
      )}

      {/* color */}
      <div className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.25em] text-fog">{t('ctrl_color')}</div>
      <div className="mb-6 grid grid-cols-5 gap-1.5">
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

      {/* brightness */}
      <Slider label={t('ctrl_brightness')} value={design.brightness} onChange={(v) => setDesign({ brightness: v })} />
    </aside>
  );
}
