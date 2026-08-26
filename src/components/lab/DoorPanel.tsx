import { useEffect, useMemo, useRef, useState } from 'react';
import type { PointerEvent as RPointerEvent, MouseEvent as RMouseEvent } from 'react';
import { PANEL, MATERIALS, FIBER_CONFIGS, FIBER_ANCHORS } from '../../data/lab';
import { LEVELS } from '../../data/levels';
import { useLabStore } from '../../store/labStore';
import { clamp, ledRadius, PANEL_PATH, strandPath, computeMetrics } from '../../lib/light';
import { renderHeatmap, renderTestAnimation } from '../../lib/heatmap';
import { play } from '../../lib/sound';
import { useT } from '../../lib/translations';
import { cn } from '../../lib/cn';
import type { Led } from '../../types';

const M = PANEL;
const MARGIN = 26;

const STITCH_PATH =
  'M 90 26 L 310 26 Q 334 26 334 50 L 334 598 Q 334 622 310 622 L 90 622 Q 66 622 66 598 L 66 50 Q 66 26 90 26 Z';

export function DoorPanel() {
  const t = useT();
  const leds = useLabStore((s) => s.leds);
  const selectedId = useLabStore((s) => s.selectedLedId);
  const material = useLabStore((s) => s.material);
  const fiberConfig = useLabStore((s) => s.fiberConfig);
  const addLed = useLabStore((s) => s.addLed);
  const moveLed = useLabStore((s) => s.moveLed);
  const selectLed = useLabStore((s) => s.selectLed);
  const testPhase = useLabStore((s) => s.testPhase);
  const finishTest = useLabStore((s) => s.finishTest);
  const currentLevel = useLabStore((s) => s.currentLevel);
  const levelDef = LEVELS[currentLevel - 1] ?? LEVELS[0];

  const metrics = useMemo(
    () => computeMetrics(leds, material, fiberConfig),
    [leds, material, fiberConfig],
  );

  const svgRef = useRef<SVGSVGElement | null>(null);
  const dragRef = useRef<{ id: string; dx: number; dy: number } | null>(null);
  const movedRef = useRef(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const testBarRef = useRef<HTMLDivElement | null>(null);
  const testPctRef = useRef<HTMLSpanElement | null>(null);
  const [heatmapOn, setHeatmapOn] = useState(false);

  const mat = MATERIALS.find((m) => m.id === material) ?? MATERIALS[0];
  const fib = FIBER_CONFIGS.find((f) => f.id === fiberConfig) ?? FIBER_CONFIGS[0];

  // recompute the light field whenever LEDs / material / visibility change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = 200;
    const H = 320;
    canvas.width = W;
    canvas.height = H;
    ctx.clearRect(0, 0, W, H);
    if (heatmapOn) {
      renderHeatmap(ctx, W, H, leds, mat.spread, M.viewW, M.viewH);
    }
  }, [leds, material, heatmapOn, testPhase]);

  // validation test: run the light animation, then finish with a computed report
  useEffect(() => {
    if (testPhase !== 'running') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = 200;
    const H = 320;
    canvas.width = W;
    canvas.height = H;

    const snapshotLeds = useLabStore.getState().leds;
    const snapshotMaterial = useLabStore.getState().material;
    const snapshotFiber = useLabStore.getState().fiberConfig;
    const mat0 = MATERIALS.find((m) => m.id === snapshotMaterial) ?? MATERIALS[0];
    const fib0 = FIBER_CONFIGS.find((f) => f.id === snapshotFiber) ?? FIBER_CONFIGS[0];
    const anchors = fib0.anchors.map((a) => FIBER_ANCHORS[a]);

    const DUR = 4800;
    let raf = 0;
    let timer = 0;
    const start = performance.now();

    const loop = (now: number) => {
      const tProg = Math.min(1, (now - start) / DUR);
      renderTestAnimation(ctx, W, H, snapshotLeds, mat0.spread, M.viewW, M.viewH, tProg, anchors);
      if (testBarRef.current) {
        testBarRef.current.style.width = `${Math.round(tProg * 100)}%`;
      }
      if (testPctRef.current) {
        testPctRef.current.textContent = `${Math.round(tProg * 100)}%`;
      }
      if (tProg < 1) {
        raf = requestAnimationFrame(loop);
      } else {
        timer = window.setTimeout(() => {
          finishTest(computeMetrics(snapshotLeds, snapshotMaterial, snapshotFiber));
        }, 1200);
      }
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      if (timer) window.clearTimeout(timer);
    };
  }, [testPhase, finishTest]);

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
    if (testPhase !== 'idle') return;
    if (movedRef.current) {
      movedRef.current = false;
      return;
    }
    const p = toPanel(e);
    if (leds.length >= levelDef.maxLeds) {
      selectLed(null);
      return;
    }
    addLed(clamp(p.x, MARGIN, M.viewW - MARGIN), clamp(p.y, MARGIN, M.viewH - MARGIN));
    play('led');
  };

  const onLedPointerDown = (e: RPointerEvent<SVGGElement>, led: Led) => {
    if (testPhase !== 'idle') return;
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
    <div className="glass p-4 shadow-[0_0_80px_-30px_rgba(0,229,255,0.35)] sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-fog">
          {t('door_panel')}
        </span>
        <div className="flex items-center gap-3">
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.25em] text-electric/80 lg:inline">
            {t('panel_hint')}
          </span>
          <button
            type="button"
            onClick={() => setHeatmapOn((o) => !o)}
            className={cn(
              'border px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.25em] transition-colors duration-300',
              heatmapOn
                ? 'border-electric/60 bg-electric/10 text-electric'
                : 'border-white/15 text-fog hover:border-electric/40 hover:text-electric',
            )}
          >
            {heatmapOn ? t('hide_heatmap') : t('show_heatmap')}
          </button>
        </div>
      </div>

      <div className="relative mx-auto aspect-[400/640] h-[min(68vh,600px)] max-w-full">
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

            <radialGradient id="panel-ambient" cx="0.5" cy="0.45" r="0.6">
              <stop offset="0%" stopColor="rgba(0,229,255,0.12)" />
              <stop offset="100%" stopColor="rgba(0,229,255,0)" />
            </radialGradient>

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

          <g pointerEvents="none">
            <path d={STITCH_PATH} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={1} strokeDasharray="2 7" />
            <rect x={252} y={150} width={58} height={20} rx={6} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.18)" />
            <rect x={262} y={156} width={38} height={8} rx={4} fill="rgba(0,229,255,0.08)" stroke="rgba(0,229,255,0.2)" />
            <rect x={96} y={404} width={208} height={34} rx={14} fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" />
            <circle cx={110} cy={520} r={26} stroke="rgba(255,255,255,0.12)" strokeWidth={1} strokeDasharray="1 3" />
            <circle cx={110} cy={520} r={16} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
            <circle cx={110} cy={520} r={2.5} fill="rgba(255,255,255,0.15)" />
            <text x={78} y={96} fill="rgba(255,255,255,0.14)" fontSize={8} fontFamily="'JetBrains Mono', monospace" letterSpacing={2}>
              {t('zone_a')}
            </text>
            <text x={78} y={300} fill="rgba(255,255,255,0.14)" fontSize={8} fontFamily="'JetBrains Mono', monospace" letterSpacing={2}>
              {t('zone_b')}
            </text>
            <text x={78} y={560} fill="rgba(255,255,255,0.14)" fontSize={8} fontFamily="'JetBrains Mono', monospace" letterSpacing={2}>
              {t('zone_c')}
            </text>
            <text x={300} y={612} fill="rgba(255,255,255,0.1)" fontSize={7} fontFamily="'JetBrains Mono', monospace" letterSpacing={2} textAnchor="end">
              MUNDA LIGHTING
            </text>
          </g>

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

          {/* Level 1: target zone */}
          {currentLevel === 1 && (
            <g pointerEvents="none">
              <rect
                x={108}
                y={168}
                width={184}
                height={304}
                rx={18}
                fill="rgba(0,229,255,0.05)"
                stroke="rgba(0,229,255,0.5)"
                strokeWidth={1.2}
                strokeDasharray="5 5"
                className="animate-pulse-soft"
              />
              <rect x={108} y={168} width={184} height={304} rx={18} fill="none" stroke="rgba(125,247,255,0.12)" strokeWidth={6} />
              <text
                x={200}
                y={160}
                textAnchor="middle"
                fill="rgba(125,247,255,0.8)"
                fontSize={8}
                fontFamily="'JetBrains Mono', monospace"
                letterSpacing={2}
              >
                {t('target_zone')}
              </text>
              <text
                x={200}
                y={332}
                textAnchor="middle"
                fill="rgba(125,247,255,0.95)"
                fontSize={15}
                fontFamily="'JetBrains Mono', monospace"
                fontWeight={700}
              >
                {Math.round(metrics.uniformity)}%
              </text>
              <text
                x={200}
                y={350}
                textAnchor="middle"
                fill="rgba(255,255,255,0.45)"
                fontSize={7}
                fontFamily="'JetBrains Mono', monospace"
                letterSpacing={2}
              >
                ≥ 75%
              </text>
              {metrics.uniformity >= 75 && (
                <text
                  x={200}
                  y={378}
                  textAnchor="middle"
                  fill="#00e5ff"
                  fontSize={8}
                  fontFamily="'JetBrains Mono', monospace"
                  letterSpacing={2}
                  className="animate-pop"
                >
                  ✓ {t('target_reached').toUpperCase()}
                </text>
              )}
            </g>
          )}

          <g
            clipPath="url(#panel-clip)"
            pointerEvents="none"
            style={{ opacity: heatmapOn ? 0.35 : 1, transition: 'opacity 0.5s' }}
          >
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

          {leds.map((led) => {
            const selected = led.id === selectedId;
            return (
              <g
                key={led.id}
                onPointerDown={(e) => onLedPointerDown(e, led)}
                onPointerMove={onLedPointerMove}
                onPointerUp={onLedPointerUp}
                onClick={(e) => e.stopPropagation()}
                className="group cursor-grab active:cursor-grabbing"
                style={{ touchAction: 'none' }}
              >
                <circle cx={led.x} cy={led.y} r={18} fill="transparent" />
                <circle
                  cx={led.x}
                  cy={led.y}
                  r={8}
                  fill="none"
                  stroke="rgba(125,247,255,0.55)"
                  strokeWidth={1}
                  className="opacity-0 transition-opacity duration-200 group-hover:opacity-70"
                />
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

        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-0 h-full w-full mix-blend-screen transition-opacity duration-500',
            heatmapOn || testPhase !== 'idle' ? 'opacity-100' : 'opacity-0',
          )}
        />
        {testPhase === 'running' && (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-col items-center gap-2">
            <span className="mt-3 inline-flex items-center gap-2 border border-electric/50 bg-ink/80 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.3em] text-electric backdrop-blur-sm">
              <span className="size-1.5 animate-pulse-dot rounded-full bg-electric" />
              {t('test_in_progress')}
              <span ref={testPctRef} className="text-electric-bright">
                0%
              </span>
            </span>
            <div className="h-[2px] w-48 overflow-hidden rounded-full bg-white/10">
              <div
                ref={testBarRef}
                className="h-full bg-electric transition-all duration-500"
                style={{ width: '0%' }}
              />
            </div>
          </div>
        )}
      </div>

      {heatmapOn && (
        <div className="mt-3 flex items-center gap-3">
          <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-fog/70">
            {t('no_light')}
          </span>
          <div className="h-1.5 flex-1 rounded-full bg-[linear-gradient(to_right,#080610,#2a1250,#7c3aed,#2563eb,#00e5ff,#ffffff)]" />
          <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-electric-bright/80">
            {t('strong')}
          </span>
        </div>
      )}
    </div>
  );
}
