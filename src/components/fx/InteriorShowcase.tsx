import { PANEL_PATH } from '../../lib/light';

/**
 * Futuristic automotive interior showcase (pure SVG + SMIL, no assets):
 * door panel with LEDs and traveling fiber light, textile surfaces,
 * and a dashboard with an animated ambient light strip.
 */
export function InteriorShowcase({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 560 500" className={className} fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="sh-led1" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="rgba(0,229,255,0.85)" />
          <stop offset="55%" stopColor="rgba(0,229,255,0.25)" />
          <stop offset="100%" stopColor="rgba(0,229,255,0)" />
        </radialGradient>
        <radialGradient id="sh-led2" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="rgba(139,92,246,0.8)" />
          <stop offset="55%" stopColor="rgba(139,92,246,0.2)" />
          <stop offset="100%" stopColor="rgba(139,92,246,0)" />
        </radialGradient>
        <linearGradient id="sh-amb" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(0,229,255,0)" />
          <stop offset="50%" stopColor="rgba(125,247,255,0.95)" />
          <stop offset="100%" stopColor="rgba(0,229,255,0)" />
        </linearGradient>
        <pattern id="sh-weave" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M0 5 H10" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <path d="M5 0 V10" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        </pattern>
        <clipPath id="sh-panel-clip">
          <path d={PANEL_PATH} />
        </clipPath>
        <linearGradient id="sh-wash" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(0,229,255,0)" />
          <stop offset="50%" stopColor="rgba(125,247,255,0.28)" />
          <stop offset="100%" stopColor="rgba(0,229,255,0)" />
        </linearGradient>
      </defs>

      {/* ——— door panel ——— */}
      <g transform="translate(30,70) scale(0.58)">
        <path d={PANEL_PATH} fill="url(#sh-weave)" stroke="rgba(255,255,255,0.12)" strokeWidth={1.4} />

        {/* handle + armrest + speaker */}
        <rect x={252} y={150} width={58} height={20} rx={6} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.18)" />
        <rect x={262} y={156} width={38} height={8} rx={4} fill="rgba(0,229,255,0.08)" stroke="rgba(0,229,255,0.25)" />
        <rect x={96} y={404} width={208} height={34} rx={14} fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" />
        <circle cx={110} cy={520} r={26} stroke="rgba(255,255,255,0.12)" strokeWidth={1} strokeDasharray="1 3" />
        <circle cx={110} cy={520} r={16} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
        <text x={300} y={612} textAnchor="end" fill="rgba(255,255,255,0.12)" fontSize={9} fontFamily="'JetBrains Mono', monospace" letterSpacing={2}>
          MUNDA
        </text>

        {/* light wash passing through the panel */}
        <g clipPath="url(#sh-panel-clip)">
          <rect x={60} y={20} width={280} height={608} fill="url(#sh-wash)">
            <animate attributeName="opacity" values="0;0.9;0" dur="6s" repeatCount="indefinite" />
          </rect>
        </g>

        {/* LEDs + glow */}
        <circle cx={150} cy={170} r={95} fill="url(#sh-led1)">
          <animate attributeName="opacity" values="0.55;1;0.55" dur="3.4s" repeatCount="indefinite" />
        </circle>
        <circle cx={150} cy={170} r={4} fill="#7df7ff" />
        <circle cx={280} cy={480} r={110} fill="url(#sh-led2)">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="4.2s" repeatCount="indefinite" />
        </circle>
        <circle cx={280} cy={480} r={4} fill="#c4b5fd" />

        {/* fiber strands + traveling pulses */}
        <path id="sh-f1" d="M150 170 C 190 120, 230 130, 290 150" stroke="rgba(0,229,255,0.35)" strokeWidth={1.2} fill="none" />
        <circle r={3} fill="#7df7ff">
          <animateMotion dur="3s" repeatCount="indefinite" calcMode="linear">
            <mpath href="#sh-f1" />
          </animateMotion>
        </circle>
        <path id="sh-f2" d="M280 480 C 240 430, 200 430, 160 460" stroke="rgba(139,92,246,0.4)" strokeWidth={1.2} fill="none" />
        <circle r={3} fill="#c4b5fd">
          <animateMotion dur="3.8s" repeatCount="indefinite" calcMode="linear">
            <mpath href="#sh-f2" />
          </animateMotion>
        </circle>
      </g>

      {/* ——— dashboard ——— */}
      <g transform="translate(330,110)">
        <rect x={0} y={0} width={200} height={280} rx={16} fill="#0b0b12" stroke="rgba(255,255,255,0.12)" strokeWidth={1.2} />
        <rect x={14} y={14} width={172} height={120} rx={10} fill="url(#sh-weave)" stroke="rgba(255,255,255,0.06)" />

        {/* ambient light strip */}
        <rect x={14} y={40} width={172} height={10} rx={5} fill="rgba(255,255,255,0.05)" stroke="rgba(0,229,255,0.2)" />
        <rect x={14} y={40} width={172} height={10} rx={5} fill="url(#sh-amb)" opacity={0.5}>
          <animate attributeName="opacity" values="0.25;0.75;0.25" dur="4s" repeatCount="indefinite" />
        </rect>
        <rect y={41} width={34} height={8} rx={4} fill="rgba(255,255,255,0.85)">
          <animate attributeName="x" values="16;152;16" dur="4.6s" repeatCount="indefinite" />
        </rect>

        {/* instrument cluster */}
        <circle cx={70} cy={150} r={34} stroke="rgba(255,255,255,0.16)" strokeWidth={1.2} fill="rgba(255,255,255,0.02)" />
        <circle cx={70} cy={150} r={22} stroke="rgba(255,255,255,0.07)" strokeWidth={1} strokeDasharray="2 4" />
        <circle cx={70} cy={150} r={3} fill="rgba(0,229,255,0.7)" />
        <circle cx={130} cy={150} r={34} stroke="rgba(255,255,255,0.16)" strokeWidth={1.2} fill="rgba(255,255,255,0.02)" />
        <circle cx={130} cy={150} r={22} stroke="rgba(255,255,255,0.07)" strokeWidth={1} strokeDasharray="2 4" />
        <circle cx={130} cy={150} r={3} fill="rgba(139,92,246,0.7)" />

        {/* center console light bar */}
        <rect x={14} y={210} width={172} height={44} rx={8} stroke="rgba(255,255,255,0.08)" fill="rgba(255,255,255,0.02)" />
        <rect x={30} y={228} width={140} height={8} rx={4} fill="rgba(255,255,255,0.06)">
          <animate attributeName="fill" values="rgba(255,255,255,0.06);rgba(0,229,255,0.45);rgba(255,255,255,0.06)" dur="5s" repeatCount="indefinite" />
        </rect>
      </g>

      {/* captions */}
      <text x={60} y={445} fill="rgba(255,255,255,0.28)" fontSize={9} fontFamily="'JetBrains Mono', monospace" letterSpacing={3}>
        DOOR PANEL — TEXTILE SUBSTRATE
      </text>
      <text x={350} y={445} fill="rgba(255,255,255,0.28)" fontSize={9} fontFamily="'JetBrains Mono', monospace" letterSpacing={3}>
        DASHBOARD — AMBIENT LIGHTING
      </text>
    </svg>
  );
}
