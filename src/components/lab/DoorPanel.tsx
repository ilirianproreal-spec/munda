import { useRef } from 'react';
import type { PointerEvent as RPointerEvent, MouseEvent as RMouseEvent } from 'react';
import { PANEL, MATERIALS, FIBER_CONFIGS, FIBER_ANCHORS, MAX_LEDS } from '../../data/lab';
import { useLabStore } from '../../store/labStore';
import { clamp, ledRadius } from '../../utils/light';
import type { Led } from '../../types';

const M = PANEL;
const MARGIN = 26;

const PANEL_PATH =
  'M 84 20 L 316 20 Q 340 20 340 44 L 340 604 Q 340 628 316 628 L 84 628 Q 60 628 60 604 L 60 44 Q 60 20 84 20 Z';

const STITCH_PATH =
  'M 90 26 L 310 26 Q 334 26 334 50 L 334 598 Q 334 622 310 622 L 90 622 Q 66 622 66 598 L 66 50 Q 66 26 90 26 Z';

function strandPath(led: Led, a: { x: number; y: number }) {
  const dx = a.x - led.x;
  const dy = a.y - led.y;
  const len = Math.max(1, Math.hypot(dx, dy));
  const nx = -dy / len;
  const ny = dx / len;
  const bend = 14 + len * 0.12;
  const c1x = led.x + dx * 0.35 + nx * bend;
  const c1y = led.y + dy * 0.35 + ny * bend;
  const c2x = a.x - dx * 0.35 + nx * bend;
  const c2y = a.y - dy * 0.35 + ny * bend;
  return `M ${led.x} ${led.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${a.x} ${a.y}`;
}

export function DoorPanel() {
  const leds = useLabStore((s) => s.leds);
  const selectedId = useLabStore((s) => s.selectedLedId);
  const material = useLabStore((s) => s.material);
  const fiberConfig = useLabStore((s) => s.fiberConfig);
  const addLed = useLabStore((s) => s.addLed);
  const moveLed = useLabStore((s) => s.moveLed);
  const selectLed = useLabStore((s) => s.selectLed);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const dragRef = useRef<{ id: string; dx: number; dy: number } | null>(null);
  const movedRef = useRef(false);

  const mat = MATERIALS.find((m) => m.id === material) ?? MATERIALS[0];
  const fib = FIBER_CONFIGS.find((f) => f.id === fiberConfig) ?? FIBER_CONFIGS[0];

  const toPanel = (e: RPointerEvent | RMouseEvent) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * M.viewW,
      y: ((e.clientY - rect.top) / rect.height) * M.viewH,
    };
  };

  const handlePanelClick = (e: RMouseEvent<SVGRectElement>) => {
    if (movedRef.current) {
      movedRef.current = false;
      return;
    }
    const p = toPanel(e);
    if (leds.length >= MAX_LEDS) {
      selectLed(null);
      return;
    }
    addLed(clamp(p.x, MARGIN, M.viewW - MARGIN), clamp(p.y, MARGIN, M.viewH - MARGIN));
  };

  const onLedPointerDown = (e: RPointerEvent<SVGGElement>, led: Led) => {
    e.stopPropagation();
    selectLed(led.id);
    const p = toPanel(e);
    dragRef.current = { id: led.id, dx: led.x - p.x, dy: led.y - p.y };
    movedRef.current = false;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onLedPointerMove = (e: RPointerEvent<SVGGElement>) => {
    const d = dragRef.current;
    if (!d) return;
    const p = toPanel(e);
    const nx = clamp(p.x + d.dx, MARGIN, M.viewW - MARGIN);
    const ny = clamp(p.y + d.dy, MARGIN, M.viewH - MARGIN);
    const cur = leds.find((l) => l.id === d.id);
    if (cur && (Math.abs(cur.x - nx) > 0.5 || Math.abs(cur.y - ny) > 0.5)) {
      movedRef.current = true;
    }
    moveLed(d.id, nx, ny);
  };

  const onLedPointerUp = (e: RPointerEvent<SVGGElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    dragRef.current = null;
  };

  return (
    <div className="glass p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-fog">
        <span>Paneli i derës</span>
        <span className="text-electric/80">Kliko: shto LED · Zvarrit: lëviz</span>
      </div>

      <div className="mx-auto aspect-[400/640] h-[min(68vh,600px)] max-w-full">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${M.viewW} ${M.viewH}`}
          className="h-full w-full select-none"
          role="img"
          aria-label="Interactive car door panel with LED lighting"
        >
          <defs>
            <clipPath id="panel-clip">
              <path d={PANEL_PATH} />
            </clipPath>

            {/* materials */}
            <pattern id="pat-textile" width="12" height="12" patternUnits="userSpaceOnUse">
              <path d="M0 6 H12" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              <path d="M6 0 V12" stroke="rgba(255,255,255,0.035)" strokeWidth="1" />
            </pattern>
            <pattern
              id="pat-carbon"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <path d="M0 5 H10" stroke="rgba(255,255,255,0.045)" strokeWidth="1" />
            </pattern>
            <linearGradient id="pat-soft" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#14141d" />
              <stop offset="100%" stopColor="#0a0a10" />
            </linearGradient>
            <linearGradient id="pat-alu" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#17171f" />
              <stop offset="50%" stopColor="#101018" />
              <stop offset="100%" stopColor="#17171f" />
            </linearGradient>

            {/* ambient behind panel */}
            <radialGradient id="panel-ambient" cx="0.5" cy="0.45" r="0.6">
              <stop offset="0%" stopColor="rgba(0,229,255,0.12)" />
              <stop offset="100%" stopColor="rgba(0,229,255,0)" />
            </radialGradient>

            {/* per-LED light gradients */}
            {leds.map((led) => {
              const a = 0.3 + 0.55 * (led.intensity / 100);
              return (
                <radialGradient key={`lg-${led.id}`} id={`lg-${led.id}`} cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0%" stopColor={led.color} stopOpacity={a} />
                  <stop offset="45%" stopColor={led.color} stopOpacity={a * 0.4} />
                  <stop offset="100%" stopColor={led.color} stopOpacity={0} />
                </radialGradient>
              );
            })}
          </defs>

          {/* ambient + base surface */}
          <rect
            x={54}
            y={14}
            width={292}
            height={620}
            rx={30}
            fill="url(#panel-ambient)"
            pointerEvents="none"
          />
          <path d={PANEL_PATH} fill={`url(#pat-${mat.id})`} stroke="rgba(255,255,255,0.1)" strokeWidth={1.2} />

          {/* panel details */}
          <g pointerEvents="none">
            <path d={STITCH_PATH} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={1} strokeDasharray="2 7" />
            {/* handle with ambient light strip */}
            <rect x={252} y={150} width={58} height={20} rx={6} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.18)" />
            <rect x={262} y={156} width={38} height={8} rx={4} fill="rgba(0,229,255,0.08)" stroke="rgba(0,229,255,0.2)" />
            {/* armrest */}
            <rect x={96} y={404} width={208} height={34} rx={14} fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" />
            {/* speaker grille */}
            <circle cx={110} cy={520} r={26} stroke="rgba(255,255,255,0.12)" strokeWidth={1} strokeDasharray="1 3" />
            <circle cx={110} cy={520} r={16} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
            <circle cx={110} cy={520} r={2.5} fill="rgba(255,255,255,0.15)" />
            {/* zone labels */}
            <text x={78} y={96} fill="rgba(255,255,255,0.14)" fontSize={8} fontFamily="'JetBrains Mono', monospace" letterSpacing={2}>
              ZONA A
            </text>
            <text x={78} y={300} fill="rgba(255,255,255,0.14)" fontSize={8} fontFamily="'JetBrains Mono', monospace" letterSpacing={2}>
              ZONA B
            </text>
            <text x={78} y={560} fill="rgba(255,255,255,0.14)" fontSize={8} fontFamily="'JetBrains Mono', monospace" letterSpacing={2}>
              ZONA C
            </text>
            <text x={300} y={612} fill="rgba(255,255,255,0.1)" fontSize={7} fontFamily="'JetBrains Mono', monospace" letterSpacing={2} textAnchor="end">
              MUNDA LIGHTING
            </text>
          </g>

          {/* click layer (empty panel → add LED) */}
          <rect
            x={54}
            y={14}
            width={292}
            height={620}
            rx={30}
            fill="transparent"
            onClick={handlePanelClick}
            className="cursor-crosshair"
          />

          {/* light simulation (clipped to panel) */}
          <g clipPath="url(#panel-clip)" pointerEvents="none">
            {leds.map((led) => (
              <circle
                key={`glow-${led.id}`}
                cx={led.x}
                cy={led.y}
                r={ledRadius(led, mat.spread)}
                fill={`url(#lg-${led.id})`}
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
                      <path
                        d={d}
                        stroke={led.color}
                        strokeOpacity={0.1}
                        strokeWidth={5}
                        strokeLinecap="round"
                        fill="none"
                        style={{ mixBlendMode: 'screen' }}
                      />
                      <path
                        id={`fp-${led.id}-${aId}`}
                        d={d}
                        stroke={led.color}
                        strokeOpacity={0.4}
                        strokeWidth={1.1}
                        strokeLinecap="round"
                        fill="none"
                        style={{ mixBlendMode: 'screen' }}
                      />
                      <circle r={2.2} fill={led.color} style={{ mixBlendMode: 'screen' }}>
                        <animateMotion
                          dur={`${2.6 + (leds.indexOf(led) % 3) * 0.5}s`}
                          repeatCount="indefinite"
                          calcMode="linear"
                        >
                          <mpath href={`#fp-${led.id}-${aId}`} />
                        </animateMotion>
                      </circle>
                    </g>
                  );
                }),
              )}
          </g>

          {/* LEDs */}
          {leds.map((led) => {
            const selected = led.id === selectedId;
            return (
              <g
                key={led.id}
                onPointerDown={(e) => onLedPointerDown(e, led)}
                onPointerMove={onLedPointerMove}
                onPointerUp={onLedPointerUp}
                onClick={(e) => e.stopPropagation()}
                className="cursor-grab active:cursor-grabbing"
                style={{ touchAction: 'none' }}
              >
                {/* hit area */}
                <circle cx={led.x} cy={led.y} r={18} fill="transparent" />
                {/* selection ring */}
                {selected && (
                  <circle
                    cx={led.x}
                    cy={led.y}
                    r={10}
                    fill="none"
                    stroke="#7df7ff"
                    strokeWidth={1.2}
                    strokeDasharray="3 3"
                    className="animate-pulse-soft"
                  />
                )}
                {/* glow core */}
                <circle
                  cx={led.x}
                  cy={led.y}
                  r={3.4}
                  fill={led.color}
                  style={{ filter: `drop-shadow(0 0 6px ${led.color})` }}
                />
                <circle cx={led.x} cy={led.y} r={1.5} fill="#ffffff" />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
