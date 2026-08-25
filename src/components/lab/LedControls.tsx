import { Trash2, CircleDot } from 'lucide-react';
import { useLabStore } from '../../store/labStore';
import { play } from '../../lib/sound';
import { cn } from '../../lib/cn';

const SWATCHES = [
  '#ffffff',
  '#ffe9b8',
  '#ffb84d',
  '#ff6b35',
  '#00e5ff',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#ff2b4d',
  '#39ff88',
];

export function LedControls() {
  const leds = useLabStore((s) => s.leds);
  const selectedId = useLabStore((s) => s.selectedLedId);
  const updateLed = useLabStore((s) => s.updateLed);
  const removeLed = useLabStore((s) => s.removeLed);
  const selected = leds.find((l) => l.id === selectedId) ?? null;

  return (
    <div className="glass p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-fog">
          Kontrolli i LED-it
        </span>
        <CircleDot className={cn('size-4', selected ? 'text-electric' : 'text-fog/40')} />
      </div>

      {!selected ? (
        <div className="border border-dashed border-white/10 px-4 py-6 text-center font-mono text-[11px] leading-relaxed text-fog/70">
          Zgjidh një LED në panel
          <br />
          ose kliko në panel për të shtuar një të ri.
        </div>
      ) : (
        <div>
          <div className="mb-4 flex items-center justify-between font-mono text-[10px] tracking-[0.2em] text-fog">
            <span>{selected.id.toUpperCase()}</span>
            <span>
              X {Math.round(selected.x)} · Y {Math.round(selected.y)}
            </span>
          </div>

          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-fog">
            Ngjyra
          </div>
          <div className="mb-4 grid grid-cols-5 gap-2">
            {SWATCHES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  updateLed(selected.id, { color: c });
                  play('led');
                }}
                aria-label={`Ngjyra ${c}`}
                className={cn(
                  'h-7 rounded-[3px] border transition-all duration-200',
                  selected.color === c
                    ? 'scale-110 border-electric-bright shadow-[0_0_10px_rgba(0,229,255,0.45)]'
                    : 'border-white/15 hover:border-white/40',
                )}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          <label className="mb-5 flex items-center justify-between gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-fog">
              Ngjyrë e personalizuar
            </span>
            <input
              type="color"
              value={selected.color}
              onChange={(e) => updateLed(selected.id, { color: e.target.value })}
              className="h-8 w-14 cursor-pointer border border-white/15 bg-transparent"
            />
          </label>

          <div className="mb-1 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-fog">
              Intensiteti
            </span>
            <span className="font-mono text-xs text-electric">
              {Math.round(selected.intensity)}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={selected.intensity}
            onChange={(e) => updateLed(selected.id, { intensity: Number(e.target.value) })}
            className="mb-5 w-full accent-electric"
          />

          <button
            type="button"
            onClick={() => {
              removeLed(selected.id);
              play('click');
            }}
            className="group flex w-full items-center justify-center gap-2 border border-white/15 py-2.5 font-mono text-[10px] uppercase tracking-[0.3em] text-fog transition-colors hover:border-red-400/60 hover:text-red-300"
          >
            <Trash2 className="size-3.5 transition-transform group-hover:scale-110" />
            Fshij LED-in
          </button>
        </div>
      )}
    </div>
  );
}
