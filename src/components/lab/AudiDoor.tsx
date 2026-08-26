import { PANEL_PATH } from '../../lib/light';
import { shapeById, shapeTranslate, pathLength, VARIANT_META } from '../../lib/doorPaths';
import type { LightDesign, DoorView } from '../../store/designStore';

interface Props {
  design: LightDesign;
  view?: DoorView;
  className?: string;
}

/**
 * The door. Three honest views of the same light design:
 *  FRONT — the door card with the light guide live on the panel.
 *  SIDE  — where the guide sits in depth: on the trim, spilling onto the floor.
 *  CLOSE-UP — the engineering: LED nodes inside the light guide.
 * Every design change re-renders instantly; patterns run on SMIL (no CSS).
 */
export function AudiDoor({ design, view = 'front', className }: Props) {
  return (
    <div className={className}>
      {view === 'front' && <FrontView design={design} />}
      {view === 'side' && <SideView design={design} />}
      {view === 'closeup' && <CloseUpView design={design} />}
    </div>
  );
}

/* ————————————————— FRONT — the door card ————————————————— */

function FrontView({ design }: { design: LightDesign }) {
  const shape = shapeById(design.shape);
  const tr = shapeTranslate(shape, design.position);
  const total = pathLength(shape.d);
  const dashLen = (design.length / 100) * total;
  const b = design.brightness / 100;
  const on = design.power;
  const night = design.dayNight === 'night';
  const color = design.color;
  const meta = VARIANT_META[design.door];

  const glowW = design.thickness * 2.2 + design.glow * 0.14;
  const glowO = Math.min(0.5, 0.16 * b + design.glow * 0.004 * b);
  const dash = `${dashLen} ${total}`;

  return (
    <svg viewBox="0 0 400 640" className="h-full w-full select-none" role="img" aria-label="Automotive door with LED light guide">
      <defs>
        <clipPath id="dd-clip">
          <path d={PANEL_PATH} />
        </clipPath>
        <pattern id="dd-textile" width="12" height="12" patternUnits="userSpaceOnUse">
          <path d="M0 6 H12" stroke="rgba(255,255,255,0.055)" strokeWidth="1" />
          <path d="M6 0 V12" stroke="rgba(255,255,255,0.035)" strokeWidth="1" />
        </pattern>
        <pattern id="dd-carbon" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 5 H10" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        </pattern>
      </defs>

      {/* ambient base */}
      <path d={PANEL_PATH} fill={night ? 'rgba(2,2,4,0.5)' : 'rgba(255,255,255,0.03)'} />
      <path
        d={PANEL_PATH}
        fill={meta.texture === 'none' ? 'rgba(24,24,31,0.92)' : `url(#dd-${meta.texture})`}
        stroke="rgba(255,255,255,0.14)"
        strokeWidth={1.2}
      />

      {/* door trim details */}
      <g opacity={night ? 0.72 : 1}>
        {meta.stitch && (
          <path
            d="M 90 26 L 310 26 Q 334 26 334 50 L 334 598 Q 334 622 310 622 L 90 622 Q 66 622 66 598 L 66 50 Q 66 26 90 26 Z"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={1}
            strokeDasharray="2 7"
          />
        )}
        <rect
          x={252}
          y={150}
          width={58}
          height={20}
          rx={6}
          transform={meta.handle === 'angle' ? 'skewX(-6)' : undefined}
          fill={meta.handle === 'chrome' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.045)'}
          stroke="rgba(255,255,255,0.22)"
        />
        <rect x={262} y={156} width={38} height={8} rx={4} fill={`${color}1f`} stroke={`${color}38`} />
        <rect
          x={96}
          y={404}
          width={208}
          height={meta.speakerH}
          rx={14}
          fill="rgba(255,255,255,0.04)"
          stroke="rgba(255,255,255,0.1)"
        />
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
          opacity={on ? (night ? 0.1 : 0.04) * b : 0}
          style={{ transition: 'opacity 0.3s' }}
        />
        {/* halo */}
        <path
          d={shape.d}
          fill="none"
          stroke={color}
          strokeWidth={glowW}
          strokeLinecap="round"
          opacity={on ? glowO : 0}
          style={{ transition: 'opacity 0.3s' }}
        />
        {/* guide body */}
        <path
          d={shape.d}
          fill="none"
          stroke={color}
          strokeWidth={design.thickness}
          strokeLinecap="round"
          strokeDasharray={dash}
          opacity={on ? Math.max(0.25, b) : 0}
          style={{ transition: 'opacity 0.3s' }}
        />
        {/* bright core */}
        <path
          d={shape.d}
          fill="none"
          stroke="#ffffff"
          strokeWidth={Math.max(0.6, design.thickness * 0.32)}
          strokeLinecap="round"
          strokeDasharray={dash}
          opacity={on ? 0.6 * b : 0}
          style={{ transition: 'opacity 0.3s' }}
        />

        {/* patterns */}
        {on && design.pattern === 'pulse' && (
          <path d={shape.d} fill="none" stroke={color} strokeWidth={design.thickness} strokeLinecap="round" strokeDasharray={dash}>
            <animate attributeName="opacity" values="0.35;1;0.35" dur="2.2s" repeatCount="indefinite" />
          </path>
        )}
        {on && design.pattern === 'flow' && (
          <path
            d={shape.d}
            fill="none"
            stroke="#ffffff"
            strokeWidth={Math.max(1, design.thickness * 0.7)}
            strokeLinecap="round"
            strokeDasharray={`10 ${dashLen}`}
            opacity={0.85}
          >
            <animate attributeName="stroke-dashoffset" from="0" to={-dashLen} dur="2.4s" repeatCount="indefinite" />
          </path>
        )}
        {on && design.pattern === 'wave' && (
          <path
            d={shape.d}
            fill="none"
            stroke={color}
            strokeWidth={design.thickness * 2.4}
            strokeLinecap="round"
            strokeDasharray={`${Math.max(24, dashLen * 0.35)} ${dashLen}`}
            opacity={0.5}
          >
            <animate attributeName="stroke-dashoffset" from="0" to={-dashLen} dur="3.6s" repeatCount="indefinite" />
          </path>
        )}
      </g>

      <text
        x={300}
        y={612}
        textAnchor="end"
        fill="rgba(255,255,255,0.2)"
        fontSize={8}
        fontFamily="'JetBrains Mono', monospace"
        letterSpacing={3}
      >
        HERMES
      </text>
    </svg>
  );
}

/* ————————————————— SIDE — where the light sits in depth ————————————————— */

function SideView({ design }: { design: LightDesign }) {
  const b = design.brightness / 100;
  const on = design.power;
  const night = design.dayNight === 'night';
  const color = design.color;
  const y = 96 + (design.position / 100) * 420; // guide height on the door face

  return (
    <svg viewBox="0 0 400 640" className="h-full w-full select-none" role="img" aria-label="Door side view with light guide position">
      {/* cabin floor */}
      <line x1={120} y1={568} x2={372} y2={568} stroke="rgba(255,255,255,0.18)" strokeWidth={1} />
      <line x1={120} y1={576} x2={320} y2={576} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />

      {/* door slab (seen from the side) */}
      <rect x={56} y={56} width={76} height={512} rx={10} fill={night ? 'rgba(20,20,26,0.95)' : 'rgba(30,30,38,0.95)'} stroke="rgba(255,255,255,0.2)" strokeWidth={1.2} />
      {/* inner face / trim line */}
      <line x1={132} y1={72} x2={132} y2={552} stroke="rgba(255,255,255,0.16)" strokeWidth={1} />

      {/* light spill on the floor */}
      <ellipse
        cx={280}
        cy={568}
        rx={96}
        ry={7}
        fill={color}
        opacity={on ? (night ? 0.16 : 0.05) * b : 0}
        style={{ transition: 'opacity 0.3s' }}
      />
      {/* cone edges */}
      <line x1={132} y1={y} x2={228} y2={568} stroke={color} strokeWidth={1} opacity={on ? 0.22 * b : 0} />
      <line x1={132} y1={y} x2={352} y2={568} stroke={color} strokeWidth={1} opacity={on ? 0.14 * b : 0} />

      {/* the guide node on the trim */}
      <circle cx={132} cy={y} r={design.thickness * 1.6 + 2} fill={color} opacity={on ? 0.25 * b : 0} style={{ transition: 'opacity 0.3s' }} />
      <circle cx={132} cy={y} r={Math.max(2, design.thickness * 0.9)} fill={color} opacity={on ? b : 0} style={{ transition: 'opacity 0.3s' }} />
      <circle cx={132} cy={y} r={Math.max(0.8, design.thickness * 0.35)} fill="#ffffff" opacity={on ? 0.7 * b : 0} />

      {/* patterns on the node */}
      {on && design.pattern === 'pulse' && (
        <circle cx={132} cy={y} r={Math.max(2, design.thickness * 0.9)} fill={color}>
          <animate attributeName="opacity" values="0.35;1;0.35" dur="2.2s" repeatCount="indefinite" />
        </circle>
      )}
      {on && (design.pattern === 'flow' || design.pattern === 'wave') && (
        <circle r={Math.max(2, design.thickness)} fill="#ffffff" opacity={design.pattern === 'flow' ? 0.9 : 0.5}>
          <animateMotion
            dur={design.pattern === 'flow' ? '1.8s' : '3.4s'}
            repeatCount="indefinite"
            path="M 132 552 L 132 72"
          />
        </circle>
      )}

      {/* labels */}
      <text x={56} y={40} fill="rgba(255,255,255,0.3)" fontSize={7} fontFamily="'JetBrains Mono', monospace" letterSpacing={3}>
        DOOR
      </text>
      <line x1={148} y1={y} x2={226} y2={y - 24} stroke="rgba(255,255,255,0.22)" strokeWidth={0.8} />
      <text x={232} y={y - 20} fill="rgba(255,255,255,0.32)" fontSize={7} fontFamily="'JetBrains Mono', monospace" letterSpacing={2}>
        LIGHT GUIDE
      </text>
    </svg>
  );
}

/* ————————————————— CLOSE-UP — the LED module ————————————————— */

function CloseUpView({ design }: { design: LightDesign }) {
  const b = design.brightness / 100;
  const on = design.power;
  const night = design.dayNight === 'night';
  const color = design.color;
  const tubeH = 26 + design.thickness * 4;
  const tubeW = 56 + (design.length / 100) * 240;
  const tubeX = (400 - tubeW) / 2;
  const tubeY = (400 - tubeH) / 2 - 10;
  const dotR = 2.6 + design.thickness * 0.6;
  const dots = 5;
  const flow = design.pattern === 'flow';
  const wave = design.pattern === 'wave';
  const pulse = design.pattern === 'pulse';

  return (
    <svg viewBox="0 0 400 400" className="h-full w-full select-none" role="img" aria-label="LED light guide close-up">
      <defs>
        <pattern id="cu-tex" width="12" height="12" patternUnits="userSpaceOnUse">
          <path d="M0 6 H12" stroke="rgba(255,255,255,0.045)" strokeWidth="1" />
          <path d="M6 0 V12" stroke="rgba(255,255,255,0.028)" strokeWidth="1" />
        </pattern>
        <filter id="cu-blur" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* door surface */}
      <rect x={28} y={28} width={344} height={344} rx={18} fill={night ? 'rgba(14,14,19,0.98)' : 'rgba(26,26,33,0.98)'} stroke="rgba(255,255,255,0.12)" strokeWidth={1.2} />
      <rect x={28} y={28} width={344} height={344} rx={18} fill="url(#cu-tex)" />

      {/* glow pool on the surface */}
      <rect x={tubeX - 14} y={tubeY + tubeH} width={tubeW + 28} height={60} rx={22} fill={color} opacity={on ? (night ? 0.1 : 0.05) * b : 0} style={{ transition: 'opacity 0.3s' }} />

      {/* halo behind the guide */}
      <rect x={tubeX - 10} y={tubeY - 10} width={tubeW + 20} height={tubeH + 20} rx={(tubeH + 20) / 2} fill={color} opacity={on ? Math.min(0.4, 0.08 + design.glow * 0.004) * b : 0} filter="url(#cu-blur)" style={{ transition: 'opacity 0.3s' }} />

      {/* housing */}
      <rect x={tubeX} y={tubeY} width={tubeW} height={tubeH} rx={tubeH / 2} fill="#0a0a10" stroke="rgba(255,255,255,0.24)" strokeWidth={1.2} />
      {/* inner channel */}
      <rect x={tubeX + 10} y={tubeY + tubeH * 0.32} width={tubeW - 20} height={tubeH * 0.36} rx={tubeH * 0.18} fill="rgba(255,255,255,0.06)" />

      {/* LED nodes */}
      <g opacity={on ? b : 0.06} style={{ transition: 'opacity 0.3s' }}>
        {Array.from({ length: dots }, (_, i) => {
          const x = tubeX + 18 + (i * (tubeW - 36)) / (dots - 1);
          const cy = tubeY + tubeH / 2;
          const begin = flow ? `${i * 0.32}s` : wave ? (i % 2 === 0 ? '0s' : '0.9s') : '0s';
          return (
            <g key={i}>
              <circle cx={x} cy={cy} r={dotR * 2.6} fill={color} opacity={0.18} />
              <circle cx={x} cy={cy} r={dotR} fill={color}>
                {(pulse || flow || wave) && (
                  <animate
                    attributeName="opacity"
                    values="0.25;1;0.25"
                    keyTimes="0;0.5;1"
                    dur={pulse ? '2.2s' : flow ? '1.5s' : '1.8s'}
                    begin={begin}
                    repeatCount="indefinite"
                  />
                )}
              </circle>
              <circle cx={x} cy={cy} r={Math.max(0.7, dotR * 0.35)} fill="#ffffff" />
            </g>
          );
        })}
      </g>

      {/* labels */}
      <text x={40} y={66} fill="rgba(255,255,255,0.3)" fontSize={7} fontFamily="'JetBrains Mono', monospace" letterSpacing={3}>
        LIGHT GUIDE
      </text>
      <line x1={64} y1={tubeY + tubeH / 2} x2={118} y2={tubeY - 34} stroke="rgba(255,255,255,0.22)" strokeWidth={0.8} />
      <text x={124} y={tubeY - 30} fill="rgba(255,255,255,0.32)" fontSize={7} fontFamily="'JetBrains Mono', monospace" letterSpacing={2}>
        LED MODULE
      </text>
    </svg>
  );
}
