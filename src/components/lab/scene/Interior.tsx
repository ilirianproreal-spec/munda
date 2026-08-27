import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { getFabric, getBackdrop } from '../../../lib/proceduralTextures';

/**
 * Static automotive environment: body panel, door frame, cabin interior
 * silhouette (seat, dashboard), studio backdrop and the scene lighting.
 * The interior fill light breathes in slightly when the door opens.
 */
export function Interior({ open }: { open: boolean }) {
  const fabric = useMemo(() => {
    const t = getFabric();
    t.repeat.set(2, 2);
    return t;
  }, []);
  const backdrop = useMemo(() => getBackdrop(), []);

  const fill = useRef<THREE.PointLight>(null);
  const fillI = useRef(0);

  const mats = useMemo(() => {
    const body = new THREE.MeshStandardMaterial({ color: '#0b0c12', roughness: 0.85, metalness: 0.1 });
    const fabricMat = new THREE.MeshStandardMaterial({ map: fabric, color: '#9aa0ac', roughness: 0.94, metalness: 0 });
    const dark = new THREE.MeshStandardMaterial({ color: '#06070b', roughness: 0.9, metalness: 0 });
    const chrome = new THREE.MeshStandardMaterial({ color: '#2c313c', roughness: 0.35, metalness: 0.9 });
    const glass = new THREE.MeshStandardMaterial({ color: '#0b131b', roughness: 0.08, metalness: 0.25, transparent: true, opacity: 0.55 });
    return { body, fabricMat, dark, chrome, glass };
  }, [fabric]);

  useFrame((_, dt) => {
    fillI.current = THREE.MathUtils.damp(fillI.current, open ? 1 : 0, 3, dt);
    if (fill.current) fill.current.intensity = fillI.current * 2.4;
  });

  return (
    <group>
      {/* ——— studio void ——— */}
      <mesh position={[0, 2.2, -4]} material={mats.dark}>
        <planeGeometry args={[18, 9]} />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#05060a" roughness={0.95} metalness={0} />
      </mesh>

      {/* ——— body shell + door frame ——— */}
      <mesh position={[-0.1, 0.62, -0.42]} material={mats.body}>
        <boxGeometry args={[2.9, 1.35, 0.14]} />
      </mesh>
      {/* A-pillar (front) */}
      <mesh position={[-0.68, 0.78, -0.1]} material={mats.chrome}>
        <boxGeometry args={[0.09, 1.45, 0.42]} />
      </mesh>
      {/* B-pillar (rear) */}
      <mesh position={[0.56, 0.78, -0.1]} material={mats.body}>
        <boxGeometry args={[0.1, 1.45, 0.42]} />
      </mesh>
      {/* roof header */}
      <mesh position={[-0.06, 1.14, -0.1]} material={mats.body}>
        <boxGeometry args={[1.3, 0.09, 0.42]} />
      </mesh>
      {/* sill */}
      <mesh position={[-0.06, 0.055, -0.1]} material={mats.body}>
        <boxGeometry args={[1.3, 0.1, 0.42]} />
      </mesh>

      {/* ——— cabin interior (revealed when the door opens) ——— */}
      <mesh position={[-0.05, 0.6, -1.7]} material={mats.dark}>
        <boxGeometry args={[2.4, 1.5, 2.6]} />
      </mesh>
      {/* driver seat silhouette */}
      <group position={[0.16, 0, -0.78]}>
        <RoundedBox args={[0.44, 0.6, 0.11]} radius={0.03} smoothness={3} position={[0, 0.55, 0]} material={mats.fabricMat} />
        <RoundedBox args={[0.44, 0.13, 0.46]} radius={0.03} smoothness={3} position={[0, 0.16, -0.02]} material={mats.fabricMat} />
        <RoundedBox args={[0.22, 0.09, 0.1]} radius={0.02} smoothness={3} position={[0.06, 0.92, 0]} material={mats.dark} />
      </group>
      {/* dashboard hint */}
      <mesh position={[-0.95, 0.5, -0.85]} rotation={[0, 0.4, 0]} material={mats.body}>
        <boxGeometry args={[0.5, 0.24, 1.1]} />
      </mesh>
      {/* windshield glass hint */}
      <mesh position={[-0.35, 0.95, -0.55]} rotation={[0.28, 0.18, 0]} material={mats.glass}>
        <boxGeometry args={[0.9, 0.5, 0.02]} />
      </mesh>

      {/* ——— lighting ——— */}
      <ambientLight intensity={0.45} />
      <hemisphereLight args={['#2a3550', '#06070c', 0.55]} />
      <directionalLight position={[2.6, 5.5, 3.4]} intensity={1.7} color="#e8eefc" />
      {/* subtle brand rim */}
      <pointLight position={[2.6, 2.0, -1.6]} intensity={1.5} distance={7} decay={2} color="#00e5ff" />
      {/* interior fill — breathes in when the door opens */}
      <pointLight ref={fill} position={[0.2, 0.9, -1.15]} intensity={0} distance={6} decay={2} color="#dfe9ff" />

      {/* soft spotlight pool on the studio floor */}
      <mesh position={[-0.05, 0.012, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.4, 2.6]} />
        <meshBasicMaterial map={backdrop} transparent opacity={0.55} depthWrite={false} color="#ffffff" />
      </mesh>
    </group>
  );
}
