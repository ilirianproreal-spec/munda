import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Controlled camera rig — the object always stays framed.
 * Drag rotates slightly (clamped), wheel / pinch zooms (clamped),
 * everything is damped for smooth movement. No uncontrolled spinning.
 * When the door opens the camera eases toward the opening; closing
 * returns it to the hero framing.
 */

const AZ = { min: -0.85, max: 0.85 };
const POL = { min: 0.92, max: 1.48 };
const RAD = { min: 1.7, max: 3.6 };
const TARGET = new THREE.Vector3(0, 0.74, 0);

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

function pinchDist(p: Map<number, { x: number; y: number }>) {
  const [a, b] = [...p.values()];
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function CameraRig({ open, domEl }: { open: boolean; domEl: HTMLElement | null }) {
  const { camera } = useThree();
  const s = useRef({
    az: 0.42,
    pol: 1.18,
    rad: 2.35,
    tAz: 0.42,
    tPol: 1.18,
    tRad: 2.35,
    dragging: false,
    last: { x: 0, y: 0 },
    pointers: new Map<number, { x: number; y: number }>(),
    pinch: 0,
  });

  useEffect(() => {
    const el = domEl;
    if (!el) return;
    const st = s.current;

    const onDown = (e: PointerEvent) => {
      st.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (st.pointers.size === 1) {
        st.dragging = true;
        st.last = { x: e.clientX, y: e.clientY };
      } else if (st.pointers.size === 2) {
        st.dragging = false;
        st.pinch = pinchDist(st.pointers);
      }
      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        /* pointer already released */
      }
    };

    const onMove = (e: PointerEvent) => {
      if (!st.pointers.has(e.pointerId)) return;
      if (st.pointers.size === 2) {
        st.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
        const d = pinchDist(st.pointers);
        if (st.pinch > 0) st.tRad = clamp(st.tRad * (st.pinch / d), RAD.min, RAD.max);
        st.pinch = d;
      } else if (st.dragging) {
        const dx = e.clientX - st.last.x;
        const dy = e.clientY - st.last.y;
        st.last = { x: e.clientX, y: e.clientY };
        st.tAz = clamp(st.tAz - dx * 0.005, AZ.min, AZ.max);
        st.tPol = clamp(st.tPol - dy * 0.005, POL.min, POL.max);
      }
    };

    const onUp = (e: PointerEvent) => {
      st.pointers.delete(e.pointerId);
      st.pinch = 0;
      if (st.pointers.size === 1) {
        const [p] = st.pointers.values();
        st.last = { x: p.x, y: p.y };
      }
      if (st.pointers.size === 0) st.dragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      st.tRad = clamp(st.tRad * (1 + Math.sign(e.deltaY) * 0.09), RAD.min, RAD.max);
    };

    el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      el.removeEventListener('wheel', onWheel);
    };
  }, [domEl]);

  useFrame((_, dt) => {
    const st = s.current;
    const bias = open ? 1 : 0;

    // door-state camera bias — eases toward the opening / back to hero framing
    const tAz = st.tAz + 0.3 * bias;
    const tPol = st.tPol - 0.05 * bias;
    const tRad = st.tRad * (1 - 0.1 * bias);

    st.az = THREE.MathUtils.damp(st.az, tAz, 4, dt);
    st.pol = THREE.MathUtils.damp(st.pol, tPol, 4, dt);
    st.rad = THREE.MathUtils.damp(st.rad, tRad, 4, dt);

    const sp = Math.sin(st.pol);
    const cp = Math.cos(st.pol);
    const pos = new THREE.Vector3(
      TARGET.x + st.rad * sp * Math.sin(st.az),
      TARGET.y + st.rad * cp,
      TARGET.z + st.rad * sp * Math.cos(st.az),
    );
    camera.position.lerp(pos, 1 - Math.exp(-8 * dt));
    camera.lookAt(TARGET);
  });

  return null;
}
