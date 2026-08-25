import { PANEL_PATH, strandPath, ledRadius } from '../../lib/light';
import { MATERIALS, FIBER_CONFIGS, FIBER_ANCHORS } from '../../data/lab';
import { useT } from '../../lib/translations';
import type { ProductSnapshot } from '../../store/labStore';

/**
 * Static "product shot" of the finished door-panel light system:
 * studio backdrop, material surface, LED light field, fiber routing,
 * and a product plate — rendered from the winning design snapshot.
 */
export function ProductPanel({ snapshot }: { snapshot: ProductSnapshot }) {
  const t = useT();
  const { leds, material, fiberConfig } = snapshot;
  const mat = MATERIALS.find((m) => m.id === material) ?? MATERIALS[0];
  const fib = FIBER_CONFIGS.find((f) => f.id === fiberConfig) ?? FIBER_CONFIGS[0];

  return (
    <svg viewBox="0 0 560 720" className="h-auto w-full" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="pp-studio" cx="0.5" cy="0.38" r="0.55">
          <stop offset="0%" stopColor="rgba(0,229,255,0.16)" />
          <stop offset="55%" stopColor="rgba(0,229,255,0.04)" />
          <stop offset="100%" stopColor="rgba(0,229,255,0)" />
        </radialGradient>
        <linearGradient id="pp-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(0,229,255,0.2)" />
          <stop offset="100%" stopColor="rgba(0,229,255,0)" />
        </linearGradient>

        <pattern id="pp-pat-textile" width="12" height="12" patternUnits="userSpaceOnUse">
          <path d="M0 6 H12" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <path d="M6 0 V12" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        </pattern>
        <pattern
          id="pp-pat-carbon"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <path d="M0 5 H10" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        </pattern>
        <linearGradient id="pp-pat-soft" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#16161f" />
          <stop offset="100%" stopColor="#0b0b11" />
        </linearGradient>
        <linearGradient id="pp-pat-alu" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#191922" />
          <stop offset="50%" stopColor="#111119" />
          <stop offset="100%" stopColor="#191922" />
        </linearGradient>

        <clipPath id="pp-clip">
          <path d={PANEL_PATH} />
        </clipPath>

        {leds.map((led) => {
          const a = 0.32 + 0.58 * (led.intensity / 100);
          return (
            <radialGradient key={`pp-lg-${led.id}`} id={`pp-lg-${led.id}`} cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor={led.color} stopOpacity={a} />
              <stop offset="45%" stopColor={led.color} stopOpacity={a * 0.4} />
              <stop offset="100%" stopColor={led.color} stopOpacity={0} />
            </radialGradient>
          );
        })}
      </defs>

      {/* studio backdrop */}
      <rect x={8} y={8} width={544} height={704} rx={26} fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.09)" />
      <rect x={8} y={8} width={544} height={704} rx={26} fill="url(#pp-studio)" />

      <g transform="translate(100,52) scale(0.9)">
        {/* surface */}
        <path d={PANEL_PATH} fill={`url(#pp-pat-${mat.id})`} stroke="rgba(255,255,255,0.15)" strokeWidth={1.4} />

        {/* details */}
        <g>
          <path
            d="M 90 26 L 310 26 Q 334 26 334 50 L 334 598 Q 334 622 310 622 L 90 622 Q 66 622 66 598 L 66 50 Q 66 26 90 26 Z"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={1}
            strokeDasharray="2 7"
          />
          <rect x={252} y={150} width={58} height={20} rx={6} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.2)" />
          <rect x={262} y={156} width={38} height={8} rx={4} fill="rgba(0,229,255,0.12)" stroke="rgba(0,229,255,0.3)" />
          <rect x={96} y={404} width={208} height={34} rx={14} fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.09)" />
          <circle cx={110} cy={520} r={26} stroke="rgba(255,255,255,0.14)" strokeWidth={1} strokeDasharray="1 3" />
          <circle cx={110} cy={520} r={16} stroke="rgba(255,255,255,0.12)" strokeWidth={1} />
          <circle cx={110} cy={520} r={2.5} fill="rgba(255,255,255,0.18)" />
        </g>

        {/* light field */}
        <g clipPath="url(#pp-clip)">
          {leds.map((led) => (
            <circle
              key={led.id}
              cx={led.x}
              cy={led.y}
              r={ledRadius(led, mat.spread)}
              fill={`url(#pp-lg-${led.id})`}
              style={{ mixBlendMode: 'screen' }}
            />
          ))}

          {fib.anchors.length > 0 &&
            leds.map((led) =>
              fib.anchors.map((aId) => {
                const a = FIBER_ANCHORS[aId];
                const d = strandPath(led, a);
                return (
                  <g key={`${led.id}-${aId}`}>
                    <path d={d} stroke={led.color} strokeOpacity={0.1} strokeWidth={5} strokeLinecap="round" fill="none" style={{ mixBlendMode: 'screen' }} />
                    <path id={`pp-fp-${led.id}-${aId}`} d={d} stroke={led.color} strokeOpacity={0.45} strokeWidth={1.2} strokeLinecap="round" fill="none" style={{ mixBlendMode: 'screen' }} />
                    <circle r={2.4} fill={led.color} style={{ mixBlendMode: 'screen' }}>
                      <animateMotion dur={`${2.6 + (leds.indexOf(led) % 3) * 0.5}s`} repeatCount="indefinite" calcMode="linear">
                        <mpath href={`#pp-fp-${led.id}-${aId}`} />
                      </animateMotion>
                    </circle>
                  </g>
                );
              }),
            )}
        </g>

        {/* LED cores */}
        {leds.map((led) => (
          <g key={led.id}>
            <circle cx={led.x} cy={led.y} r={4.2} fill={led.color} style={{ filter: `drop-shadow(0 0 8px ${led.color})` }} />
            <circle cx={led.x} cy={led.y} r={1.9} fill="#ffffff" />
          </g>
        ))}
      </g>

      {/* ground reflection */}
      <rect x={150} y={668} width={260} height={24} rx={12} fill="url(#pp-ground)" />

      {/* product plate */}
      <line x1={140} y1={646} x2={420} y2={646} stroke="rgba(255,255,255,0.2)" />
      <text x={280} y={674} textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize={14} fontFamily="'Archivo', sans-serif" fontWeight={700} letterSpacing={4}>
        {t('product_model')}
      </text>
      <text x={280} y={694} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize={9} fontFamily="'JetBrains Mono', monospace" letterSpacing={3}>
        SERIES 01 — {t(mat.nameKey).toUpperCase()} · {leds.length} LED · {t(fib.nameKey).toUpperCase()}
      </text>
    </svg>
  );
}
