import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { PANEL_PATH, clamp } from '../../lib/light';
import { GUIDE, shapeTranslate, pathLength, effectDuration } from '../../lib/doorPaths';
import type { LightDesign } from '../../store/designStore';
import { cn } from '../../lib/cn';

interface Props {
  design: LightDesign;
  className?: string;
}

/**
 * The door. One clean automotive door card; the light guide is integrated
 * in the trim and renders live: power, color, brightness, intensity,
 * effect and speed. Effects run on SMIL — smooth, realistic, no CSS.
 */
export function AudiDoor({ design, className }: Props) {
  const tr = shapeTranslate(GUIDE, 50);
  const total = pathLength(GUIDE.d);
  const len = total * 0.8; // the lit portion of the guide
  const b = design.brightness / 100;
  const on = design.power;
  const color = design.color;
  const dash = `${len} ${total}`;
  const dur = effectDuration(design.effect, design.speed);
  const d = GUIDE.d;
  const trs = `translate(${tr.x} ${tr.y})`;

  const glowW = 3 * 2.2 + design.intensity * 0.14;
  const glowO = Math.min(0.5, 0.16 * b + design.intensity * 0.004 * b);

  return (
    <svg viewBox="0 0 400 640" className={cn('h-full w-full select-none', className)} role="img" aria-label="Automotive door with LED light guide">
      <defs>
        <clipPath id="dd-clip">
          <path d={PANEL_PATH} />
        </clipPath>
        <pattern id="dd-textile" width="12" height="12" patternUnits="userSpaceOnUse">
          <path d="M0 6 H12" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <path d="M6 0 V12" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        </pattern>
      </defs>

      {/* door — night cabin ambient so the light reads like real interior lighting */}
      <path d={PANEL_PATH} fill="rgba(2,2,4,0.5)" />
      <path d={PANEL_PATH} fill="url(#dd-textile)" stroke="rgba(255,255,255,0.14)" strokeWidth={1.2} />

      {/* door trim details */}
      <g opacity={0.72}>
        <path
          d="M 90 26 L 310 26 Q 334 26 334 50 L 334 598 Q 334 622 310 622 L 90 622 Q 66 622 66 598 L 66 50 Q 66 26 90 26 Z"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={1}
          strokeDasharray="2 7"
        />
        <rect x={252} y={150} width={58} height={20} rx={6} fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.22)" />
        <rect x={262} y={156} width={38} height={8} rx={4} fill={`${color}1f`} stroke={`${color}38`} />
        <rect x={96} y={404} width={208} height={42} rx={14} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" />
        <circle cx={110} cy={520} r={26} stroke="rgba(255,255,255,0.12)" strokeWidth={1} strokeDasharray="1 3" />
        <circle cx={110} cy={520} r={16} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
        <circle cx={110} cy={520} r={2.5} fill="rgba(255,255,255,0.18)" />
      </g>

      {/* the light — integrated in the trim */}
      <g clipPath="url(#dd-clip)" transform={trs} opacity={on ? 1 : 0.02} style={{ transition: 'opacity 0.35s' }}>
        {/* ambient pool on the door surface */}
        <path d={d} fill="none" stroke={color} strokeWidth={46} strokeLinecap="round" opacity={0.1 * b} />

        {/* halo */}
        <path d={d} fill="none" stroke={color} strokeWidth={glowW} strokeLinecap="round" opacity={glowO}>
          {on && design.effect === 'glow' && (
            <animate attributeName="opacity" values="0.12;0.5;0.12" dur={dur} repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines="0.45 0 0.55 1;0.45 0 0.55 1" />
          )}
        </path>

        {/* guide body */}
        <path d={d} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeDasharray={dash} opacity={Math.max(0.25, b)}>
          {on && design.effect === 'pulse' && (
            <animate attributeName="opacity" values="0.22;1;0.22" dur={dur} repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines="0.45 0 0.55 1;0.45 0 0.55 1" />
          )}
          {on && design.effect === 'flash' && (
            <animate attributeName="opacity" values="0.05;1;0.05;1;0.05" keyTimes="0;0.12;0.25;0.38;1" dur={dur} repeatCount="indefinite" calcMode="spline" keySplines="0.3 0 0.7 1;0.3 0 0.7 1;0.3 0 0.7 1;0.3 0 0.7 1" />
          )}
        </path>

        {/* bright core */}
        <path d={d} fill="none" stroke="#ffffff" strokeWidth={1} strokeLinecap="round" strokeDasharray={dash} opacity={0.6 * b} />

        {/* wave — a bright segment running along the guide */}
        {on && design.effect === 'wave' && (
          <path
            d={d}
            fill="none"
            stroke="#ffffff"
            strokeWidth={2.6}
            strokeLinecap="round"
            strokeDasharray={`${Math.max(18, len * 0.12)} ${len}`}
            opacity={0.9}
          >
            <animate attributeName="stroke-dashoffset" from="0" to={-len} dur={dur} repeatCount="indefinite" calcMode="linear" />
          </path>
        )}
      </g>

      <text x={300} y={612} textAnchor="end" fill="rgba(255,255,255,0.2)" fontSize={8} fontFamily="'JetBrains Mono', monospace" letterSpacing={3}>
        MUNDA
      </text>
    </svg>
  );
}

/**
 * The door wrapped in subtle interactions: drag to turn (gentle 3D tilt),
 * scroll to zoom in/out. Everything springs back or clamps smoothly.
 */
export function TiltableDoor({ design, className }: Props) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const scale = useMotionValue(1);
  const srx = useSpring(rx, { stiffness: 140, damping: 18 });
  const sry = useSpring(ry, { stiffness: 140, damping: 18 });
  const sScale = useSpring(scale, { stiffness: 160, damping: 22 });
  const drag = useRef<{ x: number; y: number } | null>(null);

  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    drag.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    ry.set(clamp(dx * 0.07, -11, 11));
    rx.set(clamp(-dy * 0.05, -7, 7));
  };
  const release = () => {
    drag.current = null;
    rx.set(0);
    ry.set(0);
  };
  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const next = clamp(scale.get() - Math.sign(e.deltaY) * 0.08, 0.75, 1.5);
    scale.set(next);
  };

  return (
    <motion.div
      style={{ rotateX: srx, rotateY: sry, scale: sScale, transformPerspective: 1000 }}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={release}
      onPointerCancel={release}
      onWheel={onWheel}
      className={cn('touch-none select-none cursor-grab active:cursor-grabbing', className)}
    >
      <AudiDoor design={design} className="h-full" />
    </motion.div>
  );
}
