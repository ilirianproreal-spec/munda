import { useEffect, useRef } from 'react';

type Kind = 'amber' | 'cyan';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  kind: Kind;
  phase: number;
  sway: number;
  swaySpeed: number;
}

const COLORS: Record<Kind, string> = {
  amber: '255,184,77',
  cyan: '63,224,255',
};

/**
 * Ambient light-particle field rendered on <canvas>.
 * Slow-drifting glowing particles linked by faint fiber-optic strands.
 */
export function LightField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;
    let t = 0;
    let particles: Particle[] = [];

    const spawn = (count: number) => {
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 8,
        vy: -6 - Math.random() * 10,
        r: 0.6 + Math.random() * 1.7,
        kind: Math.random() < 0.72 ? 'amber' : 'cyan',
        phase: Math.random() * Math.PI * 2,
        sway: 8 + Math.random() * 26,
        swaySpeed: 0.2 + Math.random() * 0.5,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round((w * h) / 16000);
      spawn(Math.min(90, Math.max(34, count)));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      t += 0.008;

      // fiber-optic links between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 12100) {
            const alpha = (1 - d2 / 12100) * 0.16;
            ctx.strokeStyle = `rgba(${COLORS[a.kind]},${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        const swayX = Math.sin(t * p.swaySpeed * 10 + p.phase) * p.sway;
        p.x += p.vx * 0.02;
        p.y += p.vy * 0.02;
        if (p.y < -12) {
          p.y = h + 12;
          p.x = Math.random() * w;
        }
        if (p.x < -24) p.x = w + 24;
        if (p.x > w + 24) p.x = -24;

        const x = p.x + swayX;
        const c = COLORS[p.kind];
        ctx.beginPath();
        ctx.arc(x, p.y, p.r, 0, Math.PI * 2);
        if (p.kind === 'amber') {
          ctx.shadowColor = 'rgba(255,184,77,0.9)';
          ctx.shadowBlur = 10;
          ctx.fillStyle = `rgba(${c},0.85)`;
        } else {
          ctx.shadowColor = 'rgba(63,224,255,0.9)';
          ctx.shadowBlur = 8;
          ctx.fillStyle = `rgba(${c},0.7)`;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    };

    resize();
    if (reduced) {
      draw(); // single static frame
    } else {
      const loop = () => {
        draw();
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
