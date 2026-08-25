import { useEffect, useRef } from 'react';

type StrandColor = 'electric' | 'violet';

interface Pulse {
  t: number;
  speed: number;
  size: number;
}

interface Strand {
  p0x: number;
  p0y: number;
  p1x: number;
  p1y: number;
  p2x: number;
  p2y: number;
  p3x: number;
  p3y: number;
  color: StrandColor;
  pulses: Pulse[];
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  phase: number;
  color: StrandColor;
}

const STRAND_RGBA: Record<StrandColor, { main: string; pulse: string }> = {
  electric: { main: '0,229,255', pulse: '125,247,255' },
  violet: { main: '139,92,246', pulse: '196,181,253' },
};

function bezierPoint(s: Strand, t: number): [number, number] {
  const u = 1 - t;
  const x = u * u * u * s.p0x + 3 * u * u * t * s.p1x + 3 * u * t * t * s.p2x + t * t * t * s.p3x;
  const y = u * u * u * s.p0y + 3 * u * u * t * s.p1y + 3 * u * t * t * s.p2y + t * t * t * s.p3y;
  return [x, y];
}

/**
 * Animated optical-fiber field on <canvas>: curved fiber strands with
 * light pulses traveling along them, plus slow-drifting ambient particles.
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
    let frame = 0;
    let strands: Strand[] = [];
    let particles: Particle[] = [];

    const makeStrands = (): Strand[] => {
      const n = Math.max(5, Math.round(w / 260));
      return Array.from({ length: n }, (_, i) => {
        const color: StrandColor = i % 4 === 3 ? 'violet' : 'electric';
        const y0 = h * (0.08 + (0.84 * i) / (n - 1)) + (Math.random() - 0.5) * h * 0.06;
        const y1 = h * (0.12 + (0.76 * ((i + 2) % n)) / (n - 1)) + (Math.random() - 0.5) * h * 0.06;
        const drift = (Math.random() - 0.5) * h * 0.4;
        return {
          p0x: -w * 0.08,
          p0y: y0,
          p1x: w * 0.32,
          p1y: y0 + drift,
          p2x: w * 0.68,
          p2y: y1 - drift,
          p3x: w * 1.08,
          p3y: y1,
          color,
          pulses: Array.from({ length: 2 + Math.floor(Math.random() * 2) }, () => ({
            t: Math.random(),
            speed: 0.004 + Math.random() * 0.005,
            size: 2 + Math.random() * 2.5,
          })),
        };
      });
    };

    const spawnParticles = () => {
      const count = Math.round((w * h) / 22000);
      particles = Array.from({ length: Math.min(55, Math.max(24, count)) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 6,
        vy: -4 - Math.random() * 6,
        r: 0.5 + Math.random() * 1.3,
        phase: Math.random() * Math.PI * 2,
        color: Math.random() < 0.75 ? 'electric' : 'violet',
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      strands = makeStrands();
      spawnParticles();
    };

    const draw = () => {
      frame += 1;
      ctx.clearRect(0, 0, w, h);

      // fiber strands + traveling light pulses
      for (const s of strands) {
        const rgba = STRAND_RGBA[s.color].main;
        ctx.strokeStyle = `rgba(${rgba},0.14)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(s.p0x, s.p0y);
        ctx.bezierCurveTo(s.p1x, s.p1y, s.p2x, s.p2y, s.p3x, s.p3y);
        ctx.stroke();

        ctx.strokeStyle = `rgba(${rgba},0.3)`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(s.p0x, s.p0y);
        ctx.bezierCurveTo(s.p1x, s.p1y, s.p2x, s.p2y, s.p3x, s.p3y);
        ctx.stroke();

        for (const p of s.pulses) {
          p.t += p.speed;
          if (p.t > 1.05) p.t = -0.05;
          const [x, y] = bezierPoint(s, Math.max(0, Math.min(1, p.t)));
          const prgba = STRAND_RGBA[s.color].pulse;
          const g = ctx.createRadialGradient(x, y, 0, x, y, p.size * 4);
          g.addColorStop(0, `rgba(${prgba},0.95)`);
          g.addColorStop(0.25, `rgba(${prgba},0.45)`);
          g.addColorStop(1, `rgba(${prgba},0)`);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(x, y, p.size * 4, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = `rgba(${prgba},1)`;
          ctx.beginPath();
          ctx.arc(x, y, 1.1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ambient particles
      for (const pt of particles) {
        const swayX = Math.sin(frame * 0.02 * pt.phase + pt.phase) * 6;
        pt.x += pt.vx * 0.02;
        pt.y += pt.vy * 0.02;
        if (pt.y < -10) {
          pt.y = h + 10;
          pt.x = Math.random() * w;
        }
        if (pt.x < -20) pt.x = w + 20;
        if (pt.x > w + 20) pt.x = -20;

        ctx.fillStyle = `rgba(${STRAND_RGBA[pt.color].main},0.55)`;
        ctx.beginPath();
        ctx.arc(pt.x + swayX, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fill();
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
