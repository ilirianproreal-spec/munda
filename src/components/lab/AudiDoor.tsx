import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { PANEL_PATH, clamp } from '../../lib/light';
import { shapeById, shapeTranslate, pathLength } from '../../lib/doorPaths';
import type { LightDesign } from '../../store/designStore';
import { cn } from '../../lib/cn';

interface Props {
  design: LightDesign;
  className?: string;
}

/**
 * The door. One clean automotive door card; the light guide renders live
 * from the design — shape, position, color and brightness change instantly.
 */
export function AudiDoor({ design, className }: Props) {
  const shape = shapeById(design.shape);
  const tr = shapeTranslate(shape, design.position);
  const total = pathLength(shape.d);
  const len = total * 0.8; // full-length guide
  const b = design.brightness / 100;
  const night = design.dayNight === 'night';
  const color = design.color;
  const dash = `${len} ${total}`;

  const glowW = 3 * 2.2 + 45 * 0.14;
  const glowO = Math.min(0.5, 0.16 * b + 45 * 0.004 * b);

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

      {/* ambient base */}
      <path d={PANEL_PATH} fill={night ? 'rgba(2,2,4,0.5)' : 'rgba(255,255,255,0.03)'} />
      <path d={PANEL_PATH} fill="url(#dd-textile)" stroke="rgba(255,255,255,0.14)" strokeWidth={1.2} />

      {/* door trim details */}
      <g opacity={night ? 0.72 : 1}>
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

      {/* the light */}
      <g clipPath="url(#dd-clip)" transform={`translate(${tr.x} ${tr.y})`}>
        {/* ambient pool on the door surface */}
        <path
          d={shape.d}
          fill="none"
          stroke={color}
          strokeWidth={night ? 46 : 26}
          strokeLinecap="round"
          opacity={(night ? 0.1 : 0.04) * b}
          style={{ transition: 'opacity 0.25s' }}
        />
        {/* halo */}
        <path
          d={shape.d}
          fill="none"
          stroke={color}
          strokeWidth={glowW}
          strokeLinecap="round"
          opacity={glowO}
          style={{ transition: 'opacity 0.25s' }}
        />
        {/* guide body */}
        <path
          d={shape.d}
          fill="none"
          stroke={color}
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={dash}
          opacity={Math.max(0.25, b)}
          style={{ transition: 'opacity 0.25s' }}
        />
        {/* bright core */}
        <path
          d={shape.d}
          fill="none"
          stroke="#ffffff"
          strokeWidth={1}
          strokeLinecap="round"
          strokeDasharray={dash}
          opacity={0.6 * b}
          style={{ transition: 'opacity 0.25s' }}
        />
      </g>

      <text x={300} y={612} textAnchor="end" fill="rgba(255,255,255,0.2)" fontSize={8} fontFamily="'JetBrains Mono', monospace" letterSpacing={3}>
        HERMES
      </text>
    </svg>
  );
}

/**
 * The door wrapped in a subtle drag-to-turn interaction:
 * a gentle 3D tilt that returns to rest — the "hold the door in your hand" feel.
 */
export function TiltableDoor({ design, className }: Props) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 140, damping: 18 });
  const sry = useSpring(ry, { stiffness: 140, damping: 18 });
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

  return (
    <motion.div
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 1000 }}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={release}
      onPointerCancel={release}
      className={cn('touch-none select-none cursor-grab active:cursor-grabbing', className)}
    >
      <AudiDoor design={design} className="h-full" />
    </motion.div>
  );
}
