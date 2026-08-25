import { Network } from 'lucide-react';
import { FIBER_CONFIGS } from '../../data/lab';
import { useLabStore } from '../../store/labStore';
import { play } from '../../utils/sound';
import { cn } from '../../utils/cn';

export function FiberPicker() {
  const fiberConfig = useLabStore((s) => s.fiberConfig);
  const setFiberConfig = useLabStore((s) => s.setFiberConfig);

  return (
    <div className="glass p-5">
      <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-fog">
        <Network className="size-3.5 text-violet" />
        Konfigurimi i fibrave
      </div>
      <div className="space-y-2">
        {FIBER_CONFIGS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => {
              setFiberConfig(f.id);
              play('click');
            }}
            className={cn(
              'flex w-full items-center justify-between gap-3 border px-3 py-2.5 text-left transition-colors duration-200',
              fiberConfig === f.id
                ? 'border-violet/70 bg-violet/10'
                : 'border-white/10 hover:border-white/30',
            )}
          >
            <span>
              <span
                className={cn(
                  'block font-display text-[11px] font-bold uppercase tracking-[0.15em]',
                  fiberConfig === f.id ? 'text-violet-bright' : 'text-white',
                )}
              >
                {f.name}
              </span>
              <span className="mt-0.5 block font-mono text-[9px] text-fog">{f.desc}</span>
            </span>
            <span className="shrink-0 text-right font-mono text-[9px] leading-tight text-fog/70">
              {f.power} W
              <br />
              {f.cost} €
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
