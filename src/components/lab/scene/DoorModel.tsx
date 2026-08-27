import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { getFabric, getGrille } from '../../../lib/proceduralTextures';
import { registerStrip } from '../../../lib/lightLayer';

/**
 * The automotive door — a premium interior door card built from clean
 * primitives: textile card, chrome beltline, grab handle, window switches,
 * speaker grille, storage pocket, window glass.
 *
 * The MUNDA textile light is physically integrated: each emissive strip
 * sits inside a recessed groove on the card, with a soft light-spill plane
 * bleeding onto the textile below it — so it reads as light IN the material,
 * not a line floating on top. Strips are registered in the light layer so
 * phase 03 can drive colour / intensity independently.
 *
 * The whole card rotates around the front hinge; opening/closing is a
 * damped, controlled animation (no instant state switch).
 */

const HINGE_X = -0.55;
const DOOR_W = 1.0;
const CARD_H = 0.78;
const CARD_Y = 0.47; // vertical centre of the card
const CARD_Z = 0.045; // half thickness → front face at +0.045

/** Emissive strip inside a recessed groove — the integrated light channel. */
function LightChannel({
  x,
  y,
  w,
  grooveMat,
  stripMat,
  spillMat,
}: {
  x: number;
  y: number;
  w: number;
  grooveMat: THREE.Material;
  stripMat: THREE.Material;
  spillMat: THREE.Material;
}) {
  return (
    <group position={[x, y, 0]}>
      {/* recessed dark channel in the trim (open toward the viewer) */}
      <mesh position={[0, 0, CARD_Z + 0.005]} material={grooveMat}>
        <boxGeometry args={[w + 0.05, 0.026, 0.014]} />
      </mesh>
      {/* soft halo around the strip — the glow bleeding into the textile */}
      <mesh position={[0, 0, CARD_Z + 0.013]} material={spillMat} ref={(m) => m && registerStrip(m, 'spill')}>
        <planeGeometry args={[w + 0.18, 0.042]} />
      </mesh>
      {/* the light strip itself, seated in the channel, proud of the trim */}
      <mesh position={[0, 0, CARD_Z + 0.018]} material={stripMat} ref={(m) => m && registerStrip(m, 'strip')}>
        <boxGeometry args={[w, 0.014, 0.012]} />
      </mesh>
      {/* spill on the textile below — the light bleeding into the material */}
      <mesh position={[0, -0.014, CARD_Z + 0.004]} material={spillMat} ref={(m) => m && registerStrip(m, 'spill')}>
        <planeGeometry args={[w * 0.96, 0.05]} />
      </mesh>
    </group>
  );
}

export function DoorModel({ open }: { open: boolean }) {
  const hinge = useRef<THREE.Group>(null);
  const rot = useRef(0);

  const fabric = useMemo(() => {
    const t = getFabric();
    t.repeat.set(4, 3);
    return t;
  }, []);
  const grille = useMemo(() => getGrille(), []);

  const mats = useMemo(() => {
    const fabricMat = new THREE.MeshStandardMaterial({ map: fabric, color: '#b9beca', roughness: 0.9, metalness: 0 });
    const leather = new THREE.MeshStandardMaterial({ color: '#0d0d13', roughness: 0.5, metalness: 0 });
    const metal = new THREE.MeshStandardMaterial({ color: '#8f97a8', roughness: 0.32, metalness: 0.88 });
    const dark = new THREE.MeshStandardMaterial({ color: '#090a0f', roughness: 0.85, metalness: 0.05 });
    const glass = new THREE.MeshStandardMaterial({ color: '#0b131b', roughness: 0.08, metalness: 0.25, transparent: true, opacity: 0.5 });
    const groove = new THREE.MeshStandardMaterial({ color: '#04050a', roughness: 0.6, metalness: 0.1 });
    // — the MUNDA textile light (phase 03 drives these via lightLayer) —
    const strip = new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#ffffff', emissiveIntensity: 1.35 });
    const spill = new THREE.MeshStandardMaterial({ color: '#0a0a0f', emissive: '#ffffff', emissiveIntensity: 0.24, transparent: true, opacity: 0.9 });
    return { fabricMat, leather, metal, dark, glass, groove, strip, spill };
  }, [fabric]);

  useFrame((_, dt) => {
    rot.current = THREE.MathUtils.damp(rot.current, open ? 0.95 : 0, 4.5, dt);
    if (hinge.current) hinge.current.rotation.y = rot.current;
  });

  return (
    <group position={[HINGE_X, 0, 0]}>
      <group ref={hinge}>
        {/* door local origin sits at the hinge; the card spans 0..DOOR_W */}
        <group position={[DOOR_W / 2, 0, 0]}>
          {/* ——— card ——— */}
          <RoundedBox args={[DOOR_W, CARD_H, 0.09]} radius={0.018} smoothness={3} position={[0, CARD_Y, 0]} material={mats.fabricMat} />

          {/* beltline chrome trim */}
          <mesh position={[0, CARD_Y + CARD_H / 2 + 0.012, CARD_Z]} material={mats.metal}>
            <boxGeometry args={[1.03, 0.022, 0.1]} />
          </mesh>

          {/* window glass + top frame */}
          <mesh position={[0.04, CARD_Y + CARD_H / 2 + 0.155, CARD_Z + 0.004]} material={mats.glass}>
            <boxGeometry args={[0.82, 0.26, 0.012]} />
          </mesh>
          <mesh position={[0.04, CARD_Y + CARD_H / 2 + 0.29, CARD_Z]} material={mats.metal}>
            <boxGeometry args={[0.86, 0.018, 0.02]} />
          </mesh>

          {/* grab handle — recess + metal bar */}
          <mesh position={[-0.3, CARD_Y + 0.22, CARD_Z + 0.045]} material={mats.dark}>
            <boxGeometry args={[0.3, 0.085, 0.025]} />
          </mesh>
          <RoundedBox args={[0.26, 0.05, 0.035]} radius={0.008} smoothness={3} position={[-0.3, CARD_Y + 0.22, CARD_Z + 0.062]} material={mats.metal} />

          {/* armrest + window switches */}
          <RoundedBox args={[0.6, 0.105, 0.13]} radius={0.02} smoothness={3} position={[0.2, CARD_Y - 0.02, CARD_Z + 0.052]} material={mats.leather} />
          <mesh position={[0.05, CARD_Y - 0.015, CARD_Z + 0.125]} material={mats.dark}>
            <boxGeometry args={[0.2, 0.035, 0.012]} />
          </mesh>
          <mesh position={[-0.02, CARD_Y - 0.015, CARD_Z + 0.132]} material={mats.metal}>
            <boxGeometry args={[0.05, 0.012, 0.008]} />
          </mesh>
          <mesh position={[0.05, CARD_Y - 0.015, CARD_Z + 0.132]} material={mats.metal}>
            <boxGeometry args={[0.05, 0.012, 0.008]} />
          </mesh>
          <mesh position={[0.12, CARD_Y - 0.015, CARD_Z + 0.132]} material={mats.metal}>
            <boxGeometry args={[0.03, 0.012, 0.008]} />
          </mesh>

          {/* speaker grille */}
          <mesh position={[-0.32, CARD_Y - 0.24, CARD_Z + 0.045]} rotation={[Math.PI / 2, 0, 0]} material={mats.metal}>
            <cylinderGeometry args={[0.088, 0.088, 0.02, 32]} />
          </mesh>
          <mesh position={[-0.32, CARD_Y - 0.24, CARD_Z + 0.056]}>
            <circleGeometry args={[0.078, 32]} />
            <meshStandardMaterial map={grille} roughness={0.85} metalness={0.15} color="#ffffff" />
          </mesh>

          {/* storage pocket */}
          <RoundedBox args={[0.88, 0.15, 0.05]} radius={0.012} smoothness={3} position={[0.05, CARD_Y - 0.41, CARD_Z + 0.018]} material={mats.dark} />

          {/* ——— MUNDA textile light channels (integrated in the trim) ——— */}
          <LightChannel x={0.1} y={CARD_Y + 0.1} w={0.66} grooveMat={mats.groove} stripMat={mats.strip} spillMat={mats.spill} />
          <LightChannel x={0.32} y={CARD_Y - 0.28} w={0.4} grooveMat={mats.groove} stripMat={mats.strip} spillMat={mats.spill} />
        </group>
      </group>
    </group>
  );
}
