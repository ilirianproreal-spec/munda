import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { PANEL, MATERIALS, FIBER_CONFIGS, FIBER_ANCHORS } from '../../data/lab';
import { strandPath, ledRadius, clamp } from '../../lib/light';
import { useT } from '../../lib/translations';
import { cn } from '../../lib/cn';
import type { ProductSnapshot } from '../../store/labStore';
import type { Led } from '../../types';

export type RevealAmbientMode = 'soft' | 'normal' | 'sport' | 'premium';
export type RevealAnimation = 'static' | 'pulse' | 'flow' | 'wave';
export type RevealCamera = 'front' | 'door' | 'dashboard' | 'full';
export type DayNight = 'day' | 'night';

/* ————— camera presets (scene 1440×810, origin = viewport center) ————— */
const CAMS: Record<RevealCamera, { scale: number; x: number; y: number }> = {
  front: { scale: 1.08, x: 0, y: -12 },
  door: { scale: 1.9, x: 720 - 1200 * 1.9, y: 405 - 505 * 1.9 },
  dashboard: { scale: 1.75, x: 720 - 500 * 1.75, y: 405 - 465 * 1.75 },
  full: { scale: 0.96, x: 720 - 720 * 0.96, y: 405 - 405 * 0.96 },
};

/* ————— ambient mode parameters ————— */
const MODE: Record<RevealAmbientMode, { amb: number; bar: number; spread: number }> = {
  soft: { amb: 0.45, bar: 0.55, spread: 1.15 },
  normal: { amb: 0.75, bar: 0.8, spread: 1 },
  sport: { amb: 1.05, bar: 1.1, spread: 0.82 },
  premium: { amb: 0.9, bar: 0.95, spread: 1.08 },
};

/* ————— door panel: maps the lab's 400×640 design onto the cabin door ————— */
const DOOR = { x0: 1004, y0: 356, w: 396, h: 350 };
const mapX = (x: number) => DOOR.x0 + (x / PANEL.viewW) * DOOR.w;
const mapY = (y: number) => DOOR.y0 + (y / PANEL.viewH) * DOOR.h;

const DOOR_PATH =
  'M 1016 352 L 1384 352 Q 1406 352 1406 374 L 1406 692 Q 1406 714 1384 714 L 1016 714 Q 994 714 994 692 L 994 374 Q 994 352 1016 352 Z';

const DASH_BAR = 'M 130 452 C 300 436, 520 448, 700 458 C 790 464, 840 468, 872 473';
const DOOR_TOP_GUIDE = 'M 1016 362 C 1120 352, 1280 352, 1386 362';
const ARMREST_GUIDE = 'M 1072 548 C 1140 542, 1260 542, 1332 548';
const CONSOLE_STRIP = 'M 1090 640 L 1176 806';

const STARS: Array<[number, number, number, number]> = [
  [180, 120, 1.2, 0.5], [320, 90, 1, 0.4], [520, 140, 1.4, 0.55], [680, 100, 1, 0.35],
  [820, 150, 1.2, 0.5], [240, 190, 1, 0.3], [420, 180, 1.3, 0.45], [600, 170, 1, 0.4],
  [760, 190, 1.1, 0.3], [900, 130, 1.2, 0.5], [140, 150, 1, 0.35], [380, 110, 1.1, 0.45],
  [560, 120, 1.4, 0.3], [700, 140, 1, 0.5], [860, 180, 1.3, 0.4],
];

interface InteriorSceneProps {
  product: ProductSnapshot;
  /** live light color (hex) */
  color: string;
  /** live master intensity 0..100 */
  intensity: number;
  ambientMode: RevealAmbientMode;
  animation: RevealAnimation;
  dayNight: DayNight;
  camera: RevealCamera;
  className?: string;
}

/**
 * 2.5D cinematic automotive interior — the FINAL PRODUCT REVEAL stage.
 * The door panel is a live projection of the player's design: LED positions,
 * fiber routing, material and intensity all come from the lab snapshot.
 */
export function InteriorScene({
  product,
  color,
  intensity,
  ambientMode,
  animation,
  dayNight,
  camera,
  className,
}: InteriorSceneProps) {
  const t = useT();
  const mat = MATERIALS.find((m) => m.id === product.material) ?? MATERIALS[0];
  const fib = FIBER_CONFIGS.find((f) => f.id === product.fiberConfig) ?? FIBER_CONFIGS[0];

  const day = dayNight === 'day';
  const mode = MODE[ambientMode];
  const master = intensity / 100; // 0..1
  const glowMul = clamp(mode.amb * (day ? 0.5 : 1) * (0.35 + 0.65 * master), 0, 1);
  const barMul = clamp(mode.bar * (day ? 0.55 : 1) * (0.35 + 0.65 * master), 0, 1);
  const cam = CAMS[camera];

  const pulseCls = animation === 'pulse' ? 'fr-pulse' : undefined;
  const waveCls = animation === 'wave' ? 'fr-wave' : undefined;
  const breatheCls = animation === 'wave' ? 'fr-breathe' : undefined;

  const sceneLeds = useMemo(
    () =>
      product.leds.map((l) => {
        const live: Led = { ...l, intensity: (l.intensity * intensity) / 100 };
        return {
          led: live,
          x: mapX(l.x),
          y: mapY(l.y),
          r: ledRadius(live, mat.spread * mode.spread) * 0.8,
          alpha: clamp(0.25 + 0.7 * (l.intensity / 100) * glowMul, 0, 1),
          coreA: clamp(0.45 + 0.55 * (l.intensity / 100) * (0.4 + 0.6 * master), 0.3, 1),
        };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [product.leds, product.material, mat.spread, intensity, ambientMode, dayNight, glowMul],
  );

  const fiberOp = clamp(0.3 + 0.55 * glowMul, 0, 1);

  return (
    <svg
      viewBox="0 0 1440 810"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label="Premium automotive interior with your lighting design"
    >
      <defs>
        <linearGradient id="fr-bg-day" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2c313c" />
          <stop offset="45%" stopColor="#181b22" />
          <stop offset="100%" stopColor="#0a0b10" />
        </linearGradient>
        <linearGradient id="fr-bg-night" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d0e16" />
          <stop offset="55%" stopColor="#07080d" />
          <stop offset="100%" stopColor="#040407" />
        </linearGradient>

        <linearGradient id="fr-win-day" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4d5668" />
          <stop offset="70%" stopColor="#2b303d" />
          <stop offset="100%" stopColor="#1a1d26" />
        </linearGradient>
        <linearGradient id="fr-win-night" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10121e" />
          <stop offset="75%" stopColor="#080910" />
          <stop offset="100%" stopColor="#05060a" />
        </linearGradient>
        <linearGradient id="fr-city" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(139,92,246,0)" />
          <stop offset="100%" stopColor="rgba(139,92,246,0.16)" />
        </linearGradient>
        <linearGradient id="fr-daylight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,244,224,0.09)" />
          <stop offset="45%" stopColor="rgba(255,244,224,0.02)" />
          <stop offset="100%" stopColor="rgba(255,244,224,0)" />
        </linearGradient>

        <linearGradient id="fr-roof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#08080d" />
          <stop offset="100%" stopColor="#101018" />
        </linearGradient>

        <linearGradient id="fr-dash-top" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1d1d27" />
          <stop offset="100%" stopColor="#12121a" />
        </linearGradient>
        <linearGradient id="fr-dash-face" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#16161f" />
          <stop offset="100%" stopColor="#0b0b12" />
        </linearGradient>
        <radialGradient id="fr-cluster-face" cx="0.5" cy="0.45" r="0.6">
          <stop offset="0%" stopColor="#171724" />
          <stop offset="100%" stopColor="#0a0a11" />
        </radialGradient>
        <linearGradient id="fr-screen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0e1420" />
          <stop offset="100%" stopColor="#080c14" />
        </linearGradient>

        <radialGradient id="fr-ceiling" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor={color} stopOpacity={0.55} />
          <stop offset="60%" stopColor={color} stopOpacity={0.12} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </radialGradient>

        <linearGradient id="fr-bar-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity={0.05} />
          <stop offset="16%" stopColor={color} stopOpacity={0.95} />
          <stop offset="84%" stopColor={color} stopOpacity={0.95} />
          <stop offset="100%" stopColor={color} stopOpacity={0.05} />
        </linearGradient>

        <radialGradient id="fr-floor-dash" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor={color} stopOpacity={0.5} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </radialGradient>

        <radialGradient id="fr-vignette" cx="0.5" cy="0.45" r="0.78">
          <stop offset="55%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.6)" />
        </radialGradient>

        <filter id="fr-bloom" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="13" />
        </filter>
        <filter id="fr-bloom-sm" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <filter id="fr-shadow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="22" />
        </filter>

        <pattern id="fr-pat-textile" width="14" height="14" patternUnits="userSpaceOnUse">
          <path d="M0 7 H14" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <path d="M7 0 V14" stroke="rgba(255,255,255,0.035)" strokeWidth="1" />
        </pattern>
        <pattern
          id="fr-pat-carbon"
          width="12"
          height="12"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <path d="M0 6 H12" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        </pattern>
        <linearGradient id="fr-pat-soft" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#191922" />
          <stop offset="100%" stopColor="#0e0e15" />
        </linearGradient>
        <linearGradient id="fr-pat-alu" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1c1c26" />
          <stop offset="50%" stopColor="#13131c" />
          <stop offset="100%" stopColor="#1c1c26" />
        </linearGradient>

        <clipPath id="fr-door-clip">
          <path d={DOOR_PATH} />
        </clipPath>

        {sceneLeds.map((s) => (
          <radialGradient key={`fr-lg-${s.led.id}`} id={`fr-lg-${s.led.id}`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor={color} stopOpacity={s.alpha} />
            <stop offset="42%" stopColor={color} stopOpacity={s.alpha * 0.42} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </radialGradient>
        ))}
      </defs>

      {/* ————— camera rig ————— */}
      <motion.g
        initial={false}
        animate={{ scale: cam.scale, x: cam.x, y: cam.y }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ originX: 0.5, originY: 0.5 }}
      >
        {/* oversized backdrop (so zoom-out never reveals edges) */}
        <rect x={-420} y={-320} width={2280} height={1450} fill={day ? 'url(#fr-bg-day)' : 'url(#fr-bg-night)'} />

        {/* windshield / window strip */}
        <rect x={-420} y={-320} width={1440} height={660} fill={day ? 'url(#fr-win-day)' : 'url(#fr-win-night)'} />
        {!day && (
          <g>
            {STARS.map(([sx, sy, sr, so], i) => (
              <circle key={i} cx={sx} cy={sy} r={sr} fill="#cfd8ff" opacity={so} />
            ))}
            <rect x={40} y={232} width={900} height={120} fill="url(#fr-city)" />
            <rect x={40} y={296} width={900} height={2} fill="rgba(196,181,253,0.2)" />
          </g>
        )}
        {day && <rect x={-420} y={-320} width={2280} height={900} fill="url(#fr-daylight)" />}

        {/* roof / headliner */}
        <rect x={-420} y={-320} width={2280} height={392} fill="url(#fr-roof)" />
        {/* ceiling ambient wash */}
        <circle
          cx={720}
          cy={30}
          r={520}
          fill="url(#fr-ceiling)"
          style={{ mixBlendMode: 'screen' }}
          opacity={0.42 * glowMul}
          className={cn(pulseCls, breatheCls)}
        />

        {/* A-pillar / left frame */}
        <rect x={-420} y={-320} width={130} height={1140} fill="#0a0a10" />
        {/* B-pillar */}
        <rect x={940} y={-320} width={64} height={1240} fill="#0b0b12" stroke="rgba(255,255,255,0.04)" />

        {/* rear seats (behind the dash) */}
        <g fill="#0d0d14">
          <path d="M 80 330 C 140 210, 260 190, 340 200 L 380 330 Z" />
          <path d="M 420 330 C 480 215, 600 195, 680 205 L 720 330 Z" />
          <rect x={140} y={150} width={150} height={46} rx={16} />
          <rect x={470} y={155} width={150} height={46} rx={16} />
        </g>
        {/* ambient rim on headrests */}
        <g stroke={color} opacity={0.16 * glowMul} fill="none" style={{ mixBlendMode: 'screen' }}>
          <path d="M 146 150 L 284 150" strokeWidth={1.4} />
          <path d="M 476 155 L 614 155" strokeWidth={1.4} />
        </g>

        {/* ————— dashboard ————— */}
        <g>
          <polygon points="60,360 1020,340 1020,400 60,420" fill="url(#fr-dash-top)" />
          <path d="M 60 420 L 1020 400 L 1020 560 C 820 586, 260 594, 60 580 Z" fill="url(#fr-dash-face)" />
          <path
            d="M 72 408 L 1008 390"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={1}
            strokeDasharray="3 9"
          />
          {/* vents */}
          {[468, 498].map((vy) => (
            <g key={vy}>
              <rect x={150} y={vy} width={130} height={15} rx={7} fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" />
              {[168, 192, 216, 240, 264].map((vx) => (
                <line key={vx} x1={vx} y1={vy + 3} x2={vx} y2={vy + 12} stroke="rgba(255,255,255,0.12)" strokeWidth={1} />
              ))}
            </g>
          ))}

          {/* instrument cluster */}
          <g>
            <circle cx={430} cy={452} r={54} fill="url(#fr-cluster-face)" stroke="#1e1e2a" strokeWidth={5} />
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i / 12) * Math.PI * 2;
              return (
                <line
                  key={i}
                  x1={430 + Math.cos(a) * 44}
                  y1={452 + Math.sin(a) * 44}
                  x2={430 + Math.cos(a) * 50}
                  y2={452 + Math.sin(a) * 50}
                  stroke="rgba(255,255,255,0.14)"
                  strokeWidth={1.4}
                />
              );
            })}
            <circle cx={430} cy={452} r={40} fill="none" stroke={color} strokeWidth={1.6} strokeDasharray="58 194" transform="rotate(120 430 452)" opacity={0.4 * glowMul} className={pulseCls} style={{ mixBlendMode: 'screen' }} />
            <text x={430} y={438} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize={13} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>
              220
            </text>
            <text x={430} y={472} textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize={7} fontFamily="'JetBrains Mono', monospace" letterSpacing={2}>
              KM/H
            </text>
            <circle cx={430} cy={452} r={2.6} fill={color} opacity={0.8} style={{ mixBlendMode: 'screen' }} />
          </g>

          {/* center stack */}
          <g>
            <rect x={600} y={436} width={170} height={130} rx={14} fill="#101018" stroke="rgba(255,255,255,0.09)" />
            <rect x={614} y={450} width={142} height={68} rx={8} fill="url(#fr-screen)" stroke={color} strokeOpacity={0.3 * glowMul} strokeWidth={1} />
            <rect x={626} y={462} width={62} height={8} rx={4} fill="rgba(255,255,255,0.14)" />
            <rect x={626} y={478} width={90} height={6} rx={3} fill="rgba(255,255,255,0.07)" />
            <circle cx={740} cy={472} r={5} fill={color} opacity={0.8} className={pulseCls} style={{ mixBlendMode: 'screen' }} />
            <circle cx={640} cy={546} r={19} fill="#0e0e16" stroke="#22222e" strokeWidth={1.5} />
            <circle cx={730} cy={546} r={19} fill="#0e0e16" stroke="#22222e" strokeWidth={1.5} />
            <circle cx={640} cy={546} r={4} fill={color} opacity={0.5} style={{ mixBlendMode: 'screen' }} />
            {[664, 684, 704].map((bx) => (
              <rect key={bx} x={bx} y={540} width={12} height={12} rx={3} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" />
            ))}
          </g>

          {/* dashboard light bar */}
          <g style={{ mixBlendMode: 'screen' }} className={pulseCls}>
            <path d={DASH_BAR} stroke={color} strokeWidth={12} strokeLinecap="round" fill="none" opacity={0.22 * barMul} filter="url(#fr-bloom)" />
            <path d={DASH_BAR} stroke="url(#fr-bar-grad)" strokeWidth={2.6} strokeLinecap="round" fill="none" opacity={barMul} className={waveCls} />
          </g>

          <text x={545} y={556} textAnchor="middle" fill="rgba(255,255,255,0.13)" fontSize={11} fontFamily="'JetBrains Mono', monospace" letterSpacing={6}>
            MUNDA LIGHTING
          </text>

          {/* steering wheel */}
          <g>
            <circle cx={400} cy={640} r={125} fill="none" stroke="#14141b" strokeWidth={16} />
            <circle cx={400} cy={640} r={125} fill="none" stroke="#23232e" strokeWidth={3} strokeDasharray="300 490" transform="rotate(-60 400 640)" />
            <line x1={275} y1={640} x2={372} y2={640} stroke="#14141b" strokeWidth={10} strokeLinecap="round" />
            <line x1={428} y1={640} x2={525} y2={640} stroke="#14141b" strokeWidth={10} strokeLinecap="round" />
            <line x1={400} y1={612} x2={400} y2={520} stroke="#14141b" strokeWidth={10} strokeLinecap="round" />
            <circle cx={400} cy={640} r={28} fill="#101016" stroke="#1c1c26" strokeWidth={2} />
            <circle cx={400} cy={640} r={95} fill="none" stroke={color} strokeWidth={1.6} opacity={0.22 * glowMul} className={pulseCls} style={{ mixBlendMode: 'screen' }} />
          </g>
        </g>

        {/* front passenger seat — cropped corner */}
        <g>
          <path d="M 1385 680 C 1390 580, 1415 540, 1440 535 L 1440 700 L 1385 700 Z" fill="#101019" />
          <path d="M 1395 810 L 1395 710 C 1395 680, 1415 660, 1440 660 L 1440 810 Z" fill="#0e0e15" />
          <rect x={1392} y={480} width={48} height={64} rx={18} fill="#12121b" stroke="rgba(255,255,255,0.05)" />
        </g>

        {/* ————— door panel (the player's design) ————— */}
        <g>
          {/* soft shadow behind the door */}
          <ellipse cx={1200} cy={726} rx={230} ry={26} fill="rgba(0,0,0,0.55)" filter="url(#fr-shadow)" />

          {/* surface */}
          <path d={DOOR_PATH} fill={`url(#fr-pat-${mat.id})`} stroke="rgba(255,255,255,0.12)" strokeWidth={1.3} />

          {/* hardware details */}
          <g>
            <path d="M 1028 378 L 1372 378 Q 1390 378 1390 396 L 1390 668 Q 1390 686 1372 686 L 1028 686 Q 1010 686 1010 668 L 1010 396 Q 1010 378 1028 378 Z" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={1} strokeDasharray="3 9" />
            {/* window switch cluster */}
            <rect x={1232} y={368} width={46} height={26} rx={6} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.14)" />
            <rect x={1240} y={375} width={30} height={5} rx={2.5} fill="rgba(255,255,255,0.12)" />
            <rect x={1240} y={384} width={30} height={4} rx={2} fill="rgba(255,255,255,0.08)" />
            {/* door pull handle */}
            <rect x={1272} y={400} width={82} height={15} rx={7} fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.18)" />
            <rect x={1272} y={404} width={82} height={3} rx={1.5} fill="rgba(255,255,255,0.12)" />
            {/* armrest */}
            <rect x={1068} y={540} width={268} height={56} rx={18} fill="rgba(255,255,255,0.045)" stroke="rgba(255,255,255,0.13)" />
            <rect x={1080} y={545} width={244} height={3} rx={1.5} fill="rgba(255,255,255,0.07)" />
            {/* speaker grille */}
            <ellipse cx={1082} cy={652} rx={52} ry={26} fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.1)" />
            <path d="M 1052 652 A 30 16 0 0 0 1112 652" fill="none" stroke="rgba(255,255,255,0.08)" />
            <path d="M 1062 652 A 20 10 0 0 0 1102 652" fill="none" stroke="rgba(255,255,255,0.07)" />
            {/* storage pocket */}
            <rect x={1036} y={668} width={100} height={32} rx={10} fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.09)" />
            <text x={1380} y={702} textAnchor="end" fill="rgba(255,255,255,0.16)" fontSize={8} fontFamily="'JetBrains Mono', monospace" letterSpacing={3}>
              MUNDA · {t('reveal_brand')}
            </text>
          </g>

          {/* light guides */}
          <g style={{ mixBlendMode: 'screen' }} className={pulseCls}>
            <path d={DOOR_TOP_GUIDE} stroke={color} strokeWidth={9} strokeLinecap="round" fill="none" opacity={0.26 * barMul} filter="url(#fr-bloom-sm)" />
            <path d={DOOR_TOP_GUIDE} stroke="url(#fr-bar-grad)" strokeWidth={2} strokeLinecap="round" fill="none" opacity={barMul} className={waveCls} />
            <path d={ARMREST_GUIDE} stroke={color} strokeWidth={8} strokeLinecap="round" fill="none" opacity={0.22 * barMul} filter="url(#fr-bloom-sm)" />
            <path d={ARMREST_GUIDE} stroke={color} strokeWidth={1.8} strokeLinecap="round" fill="none" opacity={barMul * 0.9} className={waveCls} />
          </g>

          {/* LED light field + fibers (clipped to the door) */}
          <g clipPath="url(#fr-door-clip)" style={{ mixBlendMode: 'screen' }} className={pulseCls}>
            {sceneLeds.map((s) => (
              <circle key={`glow-${s.led.id}`} cx={s.x} cy={s.y} r={s.r} fill={`url(#fr-lg-${s.led.id})`} />
            ))}

            {fib.anchors.length > 0 &&
              sceneLeds.map((s) =>
                fib.anchors.map((aId) => {
                  const a = FIBER_ANCHORS[aId];
                  const ax = mapX(a.x);
                  const ay = mapY(a.y);
                  const d = strandPath({ ...s.led, x: s.x, y: s.y }, { x: ax, y: ay });
                  return (
                    <g key={`${s.led.id}-${aId}`}>
                      <path d={d} stroke={color} strokeOpacity={0.12 * glowMul} strokeWidth={7} strokeLinecap="round" fill="none" filter="url(#fr-bloom-sm)" />
                      <path
                        id={`fr-fp-${s.led.id}-${aId}`}
                        d={d}
                        stroke={color}
                        strokeOpacity={fiberOp}
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        fill="none"
                        className={animation === 'flow' ? 'fr-flow' : undefined}
                      />
                      {animation === 'flow' && (
                        <circle r={2.6} fill={color} style={{ mixBlendMode: 'screen' }}>
                          <animateMotion
                            dur={`${2.2 + (sceneLeds.indexOf(s) % 3) * 0.5}s`}
                            repeatCount="indefinite"
                            calcMode="linear"
                          >
                            <mpath href={`#fr-fp-${s.led.id}-${aId}`} />
                          </animateMotion>
                        </circle>
                      )}
                    </g>
                  );
                }),
              )}
          </g>

          {/* LED cores (always crisp) */}
          <g style={{ mixBlendMode: 'screen' }}>
            {sceneLeds.map((s) => (
              <g key={`core-${s.led.id}`}>
                <circle cx={s.x} cy={s.y} r={6} fill={color} opacity={s.coreA * 0.7} filter="url(#fr-bloom-sm)" />
                <circle cx={s.x} cy={s.y} r={3.4} fill="#ffffff" opacity={0.92} />
              </g>
            ))}
          </g>
        </g>

        {/* ————— center console ————— */}
        <g>
          <path d="M 830 640 L 1090 640 L 1180 810 L 760 810 Z" fill="#0e0e15" stroke="rgba(255,255,255,0.06)" />
          <rect x={952} y={700} width={52} height={34} rx={12} fill="#16161f" stroke="rgba(255,255,255,0.12)" />
          <circle cx={978} cy={717} r={7} fill={color} opacity={0.55 * glowMul} className={pulseCls} style={{ mixBlendMode: 'screen' }} />
          {/* console ambient strip */}
          <g style={{ mixBlendMode: 'screen' }} className={pulseCls}>
            <path d={CONSOLE_STRIP} stroke={color} strokeWidth={8} strokeLinecap="round" fill="none" opacity={0.2 * barMul} filter="url(#fr-bloom-sm)" />
            <path d={CONSOLE_STRIP} stroke="url(#fr-bar-grad)" strokeWidth={2} strokeLinecap="round" fill="none" opacity={barMul * 0.85} className={waveCls} />
          </g>
        </g>

        {/* ————— floor reflections ————— */}
        <g style={{ mixBlendMode: 'screen' }} className={pulseCls}>
          <ellipse cx={560} cy={742} rx={320} ry={52} fill="url(#fr-floor-dash)" opacity={0.16 * glowMul} filter="url(#fr-bloom)" />
          <ellipse cx={1210} cy={752} rx={180} ry={34} fill="url(#fr-floor-dash)" opacity={0.22 * glowMul} filter="url(#fr-bloom)" />
          <ellipse cx={1010} cy={764} rx={130} ry={24} fill="url(#fr-floor-dash)" opacity={0.14 * glowMul} filter="url(#fr-bloom)" />
        </g>
      </motion.g>

      {/* vignette — screen space, never zooms */}
      <rect x={0} y={0} width={1440} height={810} fill="url(#fr-vignette)" pointerEvents="none" />
    </svg>
  );
}
