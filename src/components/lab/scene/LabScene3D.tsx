import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Interior } from './Interior';
import { DoorModel } from './DoorModel';
import { CameraRig } from './CameraRig';
import { applyLightLayer } from '../../../lib/lightLayer';

/**
 * Phase 02 — the 3D automotive visualization.
 * Lazy-loaded (default export → React.lazy) so the rest of the website
 * never pays for the three.js bundle. The textile light layer is synced
 * every frame from `lightLayer`, ready for the phase 03 control panel.
 */

/** Pushes the shared lightLayer config into every registered strip. */
function LightSync() {
  useFrame(() => applyLightLayer());
  return null;
}

export default function LabScene3D({ open }: { open: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={wrapRef} className="h-full w-full touch-none select-none">
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        camera={{ position: [0.885, 0.9, 1.983], fov: 38, near: 0.1, far: 30 }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.06;
        }}
      >
        <Suspense fallback={null}>
          <color attach="background" args={['#07070c']} />
          <fog attach="fog" args={['#07070c', 7, 14]} />
          <Interior open={open} />
          <DoorModel open={open} />
          <CameraRig open={open} domEl={wrapRef.current} />
          <LightSync />
        </Suspense>
      </Canvas>
    </div>
  );
}
