import { motion } from 'framer-motion';

const MONO = "'JetBrains Mono', ui-monospace, monospace";

/* ————— HAPI 1 · LED ————— */

const RAYS = [-70, -45, -20, 0, 20, 45, 70];

export function LEDArt() {
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="led-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="rgba(0,229,255,0.55)" />
          <stop offset="100%" stopColor="rgba(0,229,255,0)" />
        </radialGradient>
      </defs>

      {/* panel surface */}
      <line x1="36" y1="158" x2="284" y2="158" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
      <line
        x1="36"
        y1="158"
        x2="284"
        y2="158"
        stroke="rgba(0,229,255,0.25)"
        strokeWidth="3"
        strokeLinecap="round"
        className="animate-pulse-soft"
      />

      {/* light rays */}
      {RAYS.map((a, i) => {
        const rad = (a * Math.PI) / 180;
        return (
          <line
            key={a}
            x1="160"
            y1="104"
            x2={160 + Math.cos(rad) * 46}
            y2={104 + Math.sin(rad) * 46}
            stroke="rgba(125,247,255,0.8)"
            strokeWidth="1.2"
            className="animate-ray"
            style={{ animationDelay: `${i * 0.32}s` }}
          />
        );
      })}

      {/* glow + chip */}
      <circle cx="160" cy="104" r="34" fill="url(#led-glow)" />
      <rect
        x="138"
        y="128"
        width="44"
        height="30"
        rx="3"
        stroke="#00e5ff"
        strokeWidth="1.5"
        fill="rgba(0,229,255,0.08)"
      />
      <path d="M148 128 q12 -10 24 0" stroke="#7df7ff" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="152" y1="158" x2="152" y2="166" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      <line x1="168" y1="158" x2="168" y2="166" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />

      <text
        x="160"
        y="190"
        textAnchor="middle"
        fill="#7df7ff"
        fontSize="11"
        fontFamily={MONO}
        letterSpacing="2"
      >
        LED — BURIMI I DRITËS
      </text>
    </svg>
  );
}

/* ————— HAPI 2 · FIBRA OPTIKE ————— */

export function FiberArt() {
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="fiber-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="rgba(0,229,255,0.5)" />
          <stop offset="100%" stopColor="rgba(0,229,255,0)" />
        </radialGradient>
        <linearGradient id="fiber-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(0,229,255,0.9)" />
          <stop offset="60%" stopColor="rgba(0,229,255,0.35)" />
          <stop offset="100%" stopColor="rgba(139,92,246,0.9)" />
        </linearGradient>
      </defs>

      {/* LED source */}
      <rect
        x="18"
        y="80"
        width="40"
        height="30"
        rx="3"
        stroke="#00e5ff"
        strokeWidth="1.5"
        fill="rgba(0,229,255,0.08)"
      />
      <path d="M30 80 q9 -8 18 0" stroke="#7df7ff" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="42" cy="95" r="26" fill="url(#fiber-glow)" className="animate-pulse-soft" />

      {/* fiber strand (glow underlay + core) */}
      <path
        id="fiber-path"
        d="M58 95 C 90 55, 130 140, 170 102 S 250 60, 292 92"
        stroke="rgba(0,229,255,0.12)"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M58 95 C 90 55, 130 140, 170 102 S 250 60, 292 92"
        stroke="url(#fiber-grad)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* light pulses traveling along the fiber */}
      <circle r="4" fill="#7df7ff">
        <animateMotion dur="3s" repeatCount="indefinite" calcMode="linear">
          <mpath href="#fiber-path" />
        </animateMotion>
      </circle>
      <circle r="2.6" fill="#c4b5fd">
        <animateMotion dur="3s" begin="1.5s" repeatCount="indefinite" calcMode="linear">
          <mpath href="#fiber-path" />
        </animateMotion>
      </circle>

      {/* destination zones */}
      <line x1="238" y1="58" x2="266" y2="58" stroke="rgba(139,92,246,0.6)" strokeWidth="1.5" />
      <line x1="238" y1="142" x2="266" y2="142" stroke="rgba(139,92,246,0.6)" strokeWidth="1.5" />
      <circle cx="292" cy="92" r="5" fill="#00e5ff" className="animate-pulse-soft" />
      <circle
        cx="292"
        cy="92"
        r="10"
        stroke="rgba(0,229,255,0.35)"
        strokeWidth="1"
        className="animate-pulse-soft"
        style={{ animationDelay: '0.4s' }}
      />

      <text
        x="160"
        y="190"
        textAnchor="middle"
        fill="#7df7ff"
        fontSize="11"
        fontFamily={MONO}
        letterSpacing="2"
      >
        FIBRA — TRANSPORTI I DRITËS
      </text>
    </svg>
  );
}

/* ————— HAPI 3 · TEKSTILI ————— */

const SPARKLES: Array<[number, number]> = [
  [118, 78],
  [202, 68],
  [138, 118],
  [222, 118],
  [104, 104],
  [186, 134],
  [160, 62],
];

export function TextileArt() {
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full" fill="none" aria-hidden="true">
      <defs>
        <pattern id="weave" width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M0 8 H16" stroke="rgba(255,255,255,0.09)" strokeWidth="1" />
          <path d="M8 0 V16" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        </pattern>
        <radialGradient id="textile-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="rgba(0,229,255,0.5)" />
          <stop offset="100%" stopColor="rgba(0,229,255,0)" />
        </radialGradient>
      </defs>

      {/* woven substrate */}
      <rect
        x="34"
        y="44"
        width="252"
        height="112"
        fill="url(#weave)"
        stroke="rgba(0,229,255,0.22)"
        strokeWidth="1"
      />

      {/* diffused light spreading over the surface */}
      <circle cx="160" cy="100" r="58" fill="url(#textile-glow)" className="animate-pulse-soft" />
      <circle
        cx="160"
        cy="100"
        r="6"
        fill="#7df7ff"
        className="animate-pulse-soft"
        style={{ animationDelay: '0.3s' }}
      />

      {/* sparkles */}
      {SPARKLES.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r="1.6"
          fill="#7df7ff"
          className="animate-ray"
          style={{ animationDelay: `${i * 0.4}s` }}
        />
      ))}

      <text
        x="160"
        y="190"
        textAnchor="middle"
        fill="#7df7ff"
        fontSize="11"
        fontFamily={MONO}
        letterSpacing="2"
      >
        TEKSTILI — SHPËRNDARJA E DRITËS
      </text>
    </svg>
  );
}

/* ————— HAPI 4 · OPTIMIZO ————— */

const BARS = [
  { label: 'NDRIÇIMI', x: 46, w: 104, color: 'rgba(0,229,255,0.55)', delay: 0.35 },
  { label: 'ENERGJIA', x: 160, w: 74, color: 'rgba(139,92,246,0.55)', delay: 0.6 },
  { label: 'KOSTO', x: 256, w: 54, color: 'rgba(255,255,255,0.4)', delay: 0.85 },
];

export function OptimizeArt() {
  return (
    <svg viewBox="0 0 320 120" className="h-full w-full" fill="none" aria-hidden="true">
      {BARS.map((b) => (
        <g key={b.label}>
          <text
            x={b.x + b.w / 2}
            y="16"
            textAnchor="middle"
            fill="#8e8e9d"
            fontSize="9"
            fontFamily={MONO}
            letterSpacing="2"
          >
            {b.label}
          </text>
          <rect x={b.x} y="26" width={b.w} height="10" rx="2" fill="rgba(255,255,255,0.06)" />
          <motion.rect
            x={b.x}
            y="26"
            width={b.w}
            height="10"
            rx="2"
            fill={b.color}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: b.delay }}
            style={{ transformBox: 'fill-box', transformOrigin: 'left center' }}
          />
          <circle
            cx={b.x + b.w}
            cy="31"
            r="2.5"
            fill={b.color}
            className="animate-pulse-soft"
            style={{ animationDelay: `${b.delay}s` }}
          />
        </g>
      ))}

      {/* balance line */}
      <line
        x1="30"
        y1="64"
        x2="290"
        y2="64"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
        strokeDasharray="3 4"
      />
      <text
        x="160"
        y="94"
        textAnchor="middle"
        fill="#c4b5fd"
        fontSize="11"
        fontFamily={MONO}
        letterSpacing="2"
      >
        GJEJ EKUILIBRIN
      </text>
    </svg>
  );
}
