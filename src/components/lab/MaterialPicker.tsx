import { Layers } from 'lucide-react';
import { MATERIALS } from '../../data/lab';
import { useLabStore } from '../../store/labStore';
import { play } from '../../utils/sound';
import { cn } from '../../utils/cn';

export function MaterialPicker() {
  const material = useLabStore((s) => s.material);
  const setMaterial = useLabStore((s) => s.setMaterial);

  return (
    <div className="glass p-5">
      <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-fog">
        <Layers className="size-3.5 text-electric" />
        Materialet
      </div>
      <div className="grid grid-cols-2 gap-2">
        {MATERIALS.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => {
              setMaterial(m.id);
              play('click');
            }}
            className={cn(
              'border px-3 py-2.5 text-left transition-colors duration-200',
              material === m.id
                ? 'border-electric/70 bg-electric/10'
                : 'border-white/10 hover:border-white/30',
            )}
          >
            <div
              className={cn(
                'font-display text-[11px] font-bold uppercase tracking-[0.15em]',
                material === m.id ? 'text-electric-bright' : 'text-white',
              )}
            >
              {m.name}
            </div>
            <div className="mt-1 font-mono text-[9px] leading-snug text-fog">{m.desc}</div>
            <div className="mt-1.5 font-mono text-[9px] tracking-[0.15em] text-fog/70">
              {m.cost} €
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
