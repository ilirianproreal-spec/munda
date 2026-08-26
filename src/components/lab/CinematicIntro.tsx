import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import type { PointerEvent as RPointerEvent } from 'react';
import { ArrowRight } from 'lucide-react';
import { PANEL_PATH } from '../../lib/light';
import { useT } from '../../lib/translations';
import { play } from '../../lib/sound';

/**
 * Cinematic chapters 01–02 of the MUNDA · Audi door lighting experience.
 *
 * 01 THE LIGHT — a nearly black screen, one thin LED light guide, and the
 *     question "CAN YOU SEE THE ENGINEERING BEHIND THE LIGHT?". The pointer
 *     drives a light pulse along the guide; a click sends a soft ripple.
 * 02 THE DOOR — the camera pulls back: the door card materialises around the
 *     very same line, revealing it as the door's LED ambient light guide.
 *
 * The floating line is anchored at 32% of the viewport height; the door is
 * positioned (top: calc(32% + min(150.5px, 17.5vh))) so its trim line — 15%
 * down a 400×640 viewBox — lands at exactly the same 32%. The line never
 * moves; the door draws itself around it.
 */
export function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  const t = useT();
  const [stage, setStage] = useState<'light' | 'door'>('light');
  const [interacted, setInteracted] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number }>>([]);

  /* pointer-driven pulse along the 320px guide (centered → ±160px) */
  const pulseX = useMotionValue(0);
  const springX = useSpring(pulseX, { stiffness: 160, damping: 22, mass: 0.6 });
  const rippleSeq = useRef(0);

  /* advance: shortly after the first interaction, or as a fallback after 12s */
  useEffect(() => {
    const fallback = window.setTimeout(() => setStage('door'), 12000);
    if (!interacted) return () => window.clearTimeout(fallback);
    const t2 = window.setTimeout(() => setStage('door'), 3000);
    return () => {
      window.clearTimeout(fallback);
      window.clearTimeout(t2);
    };
  }, [interacted]);

  const handleMove = (e: RPointerEvent<HTMLDivElement>) => {
    if (stage !== 'light') return;
    const cx = window.innerWidth / 2;
    const x = Math.max(-160, Math.min(160, e.clientX - cx));
    pulseX.set(x);
    if (!interacted) setInteracted(true);
  };

  const handleClick = (e: RPointerEvent<HTMLDivElement>) => {
    if (stage !== 'light') return;
    const cx = window.innerWidth / 2;
    const x = Math.max(-160, Math.min(160, e.clientX - cx));
    const id = ++rippleSeq.current;
    setRipples((r) => [...r, { id, x }]);
    window.setTimeout(() => setRipples((r) => r.filter((p) => p.id !== id)), 950);
    play('led');
    if (!interacted) setInteracted(true);
  };

  const skip = (e?: { stopPropagation: () => void }) => {
    e?.stopPropagation();
    play('click');
    onComplete();
  };

  return (
    <div
      className="fixed inset-0 z-[70] select-none overflow-hidden bg-ink"
      onPointerMove={handleMove}
      onClick={handleClick}
      role="presentation"
    >
      {/* chapter kicker */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute left-1/2 top-[18%] -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.5em] text-white/45"
      >
        {t('intro_kicker')}
      </motion.div>

      {/* ————— the light guide (anchored at 32% of the viewport) ————— */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0.4 }}
        animate={{
          opacity: stage === 'light' ? 1 : 0,
          scaleX: 1,
        }}
        transition={{ opacity: { duration: 0.9, delay: stage === 'light' ? 0.4 : 0.1 }, scaleX: { duration: 1.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] } }}
        className="absolute left-1/2 top-[32%] h-[2px] w-80 -translate-x-1/2 -translate-y-1/2"
      >
        {/* soft halo */}
        <motion.div
          animate={{ opacity: stage === 'light' ? [0.22, 0.5, 0.22] : 0 }}
          transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -inset-x-8 -top-[5px] -bottom-[5px] rounded-full bg-electric/25 blur-md"
        />
        {/* core */}
        <div className="absolute inset-0 rounded-full bg-electric/75" />
        <div className="absolute left-1/2 top-1/2 h-[3px] w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric-bright/60 blur-[1px]" />
      </motion.div>

      {/* pointer pulse + ripples (light chapter only) */}
      <AnimatePresence>
        {stage === 'light' && (
          <motion.div
            key="pulse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              style={{ x: springX }}
              className="absolute left-1/2 top-[32%] size-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric-bright shadow-[0_0_16px_3px_rgba(0,229,255,0.65)]"
            />
            {ripples.map((r) => (
              <motion.span
                key={r.id}
                initial={{ scale: 0.35, opacity: 0.85, x: r.x }}
                animate={{ scale: 2.8, opacity: 0, x: r.x }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                className="absolute left-1/2 top-[32%] size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-electric/60"
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* headline */}
      <div className="pointer-events-none absolute inset-x-0 top-[54%] text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: stage === 'light' ? 1 : 0, y: stage === 'light' ? 0 : -10 }}
          transition={{ delay: 1.1, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-lg font-extrabold uppercase tracking-[0.22em] text-white sm:text-3xl sm:tracking-[0.35em]"
        >
          {t('intro_question_1')}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: stage === 'light' ? 1 : 0, y: stage === 'light' ? 0 : -10 }}
          transition={{ delay: 1.35, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-3 font-display text-2xl font-extrabold uppercase tracking-[0.22em] text-electric [text-shadow:0_0_30px_rgba(0,229,255,0.35)] sm:text-4xl sm:tracking-[0.35em]"
        >
          {t('intro_question_2')}
        </motion.div>
      </div>

      {/* interaction hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: stage === 'light' ? 1 : 0 }}
        transition={{ delay: 2, duration: 1 }}
        className="pointer-events-none absolute inset-x-0 bottom-[14%] text-center font-mono text-[9px] uppercase tracking-[0.4em] text-white/30"
      >
        {t('intro_hint')}
      </motion.div>

      {/* ————— the door materialises around the line ————— */}
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: stage === 'door' ? 1 : 0, scale: stage === 'door' ? 1 : 1.05 }}
        transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute left-1/2 w-[min(430px,50vh)] -translate-x-1/2 -translate-y-1/2 aspect-[400/640]"
        style={{ top: 'calc(32% + min(150.5px, 17.5vh))' }}
      >
        <svg viewBox="0 0 400 640" className="h-full w-full" aria-hidden="true">
          {/* panel outline — drawn like an engineering blueprint */}
          <motion.path
            d={PANEL_PATH}
            fill="rgba(255,255,255,0.02)"
            stroke="rgba(255,255,255,0.32)"
            strokeWidth={1.2}
            initial={{ pathLength: 0, opacity: 0.4 }}
            animate={{ pathLength: stage === 'door' ? 1 : 0, opacity: 1 }}
            transition={{ pathLength: { duration: 1.9, delay: 0.2, ease: 'easeInOut' }, opacity: { duration: 0.6 } }}
          />
          {/* interior details */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: stage === 'door' ? 1 : 0 }}
            transition={{ duration: 1.1, delay: 1.1 }}
          >
            <path
              d="M 90 26 L 310 26 Q 334 26 334 50 L 334 598 Q 334 622 310 622 L 90 622 Q 66 622 66 598 L 66 50 Q 66 26 90 26 Z"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={1}
              strokeDasharray="2 7"
            />
            <rect x={252} y={150} width={58} height={20} rx={6} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.18)" />
            <rect x={262} y={156} width={38} height={8} rx={4} fill="rgba(0,229,255,0.10)" stroke="rgba(0,229,255,0.22)" />
            <rect x={96} y={404} width={208} height={34} rx={14} fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.09)" />
            <circle cx={110} cy={520} r={26} stroke="rgba(255,255,255,0.12)" strokeWidth={1} strokeDasharray="1 3" />
            <circle cx={110} cy={520} r={16} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
            <circle cx={110} cy={520} r={2.5} fill="rgba(255,255,255,0.16)" />
          </motion.g>

          {/* the ambient light guide — the floating line, now in its home */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: stage === 'door' ? 1 : 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
          >
            <rect x={70} y={74} width={260} height={46} rx={22} fill="rgba(0,229,255,0.05)" />
            <path d="M 96 96 L 304 96" stroke="rgba(0,229,255,0.13)" strokeWidth={10} strokeLinecap="round" />
          </motion.g>
          <motion.path
            d="M 96 96 L 304 96"
            fill="none"
            stroke="#00e5ff"
            strokeWidth={1.8}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0.9 }}
            animate={{ pathLength: stage === 'door' ? 1 : 0 }}
            transition={{ pathLength: { duration: 1.35, delay: 0.35, ease: 'easeInOut' } }}
          />
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: stage === 'door' ? 1 : 0 }}
            transition={{ duration: 0.7, delay: 1.35 }}
          >
            <rect x={88} y={91} width={8} height={10} rx={2} fill="rgba(255,255,255,0.22)" />
            <rect x={304} y={91} width={8} height={10} rx={2} fill="rgba(255,255,255,0.22)" />
          </motion.g>
        </svg>
      </motion.div>

      {/* door chapter: title block */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: stage === 'door' ? 1 : 0, y: stage === 'door' ? 0 : 18 }}
        transition={{ duration: 1, delay: stage === 'door' ? 1.4 : 0, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute bottom-10 left-6 max-w-md sm:left-10"
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.45em] text-electric">
          {t('intro_kicker')}
        </div>
        <h1 className="mt-3 font-display text-2xl font-extrabold uppercase leading-tight tracking-[0.12em] text-white sm:text-4xl">
          {t('intro_door_title_1')}
          <br />
          {t('intro_door_title_2')}
        </h1>
        <div className="mt-2.5 font-mono text-[10px] uppercase tracking-[0.25em] text-fog">
          {t('intro_door_sub')}
        </div>
        <div className="pointer-events-auto mt-8">
          <button
            type="button"
            onClick={skip}
            className="group inline-flex items-center gap-3 border border-electric/60 px-7 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-electric transition-colors duration-300 hover:bg-electric/10"
          >
            {t('intro_begin')}
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </motion.div>

      {/* skip — always available */}
      <button
        type="button"
        onClick={skip}
        className="absolute right-6 top-5 z-10 border border-white/15 px-3.5 py-2 font-mono text-[9px] uppercase tracking-[0.3em] text-white/50 transition-colors duration-300 hover:border-white/40 hover:text-white"
      >
        {t('intro_skip')}
      </button>
    </div>
  );
}
