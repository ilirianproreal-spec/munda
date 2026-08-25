import { useSettingsStore } from '../store/settingsStore';

/**
 * Tiny Web Audio sound engine — synthesized tones, no assets.
 * Respects the soundOn setting in settingsStore.
 */

let ctx: AudioContext | null = null;

function ac(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function tone(
  freq: number,
  dur: number,
  type: OscillatorType,
  gain: number,
  when = 0,
  slideTo?: number,
) {
  const c = ac();
  if (!c) return;
  const t0 = c.currentTime + when;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t0);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g);
  g.connect(c.destination);
  o.start(t0);
  o.stop(t0 + dur + 0.05);
}

export type SoundEvent = 'click' | 'led' | 'test' | 'pass' | 'fail' | 'toggle';

export function play(evt: SoundEvent) {
  if (!useSettingsStore.getState().soundOn) return;
  switch (evt) {
    case 'click':
      tone(950, 0.06, 'square', 0.04);
      break;
    case 'led':
      tone(520, 0.09, 'sine', 0.07, 0, 700);
      break;
    case 'test':
      tone(220, 0.45, 'sawtooth', 0.05, 0, 440);
      tone(440, 0.4, 'sine', 0.04, 0.1);
      break;
    case 'pass':
      tone(660, 0.16, 'sine', 0.09);
      tone(880, 0.22, 'sine', 0.09, 0.14);
      break;
    case 'fail':
      tone(180, 0.4, 'sawtooth', 0.06, 0, 120);
      break;
    case 'toggle':
      tone(700, 0.05, 'square', 0.03);
      break;
  }
}
