"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, ContactShadows } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import { CameraModel } from "@/components/three/camera-model";

function makeParticlePositions(count: number) {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    arr[i * 3] = (Math.random() - 0.5) * 12;
    arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
    arr[i * 3 + 2] = (Math.random() - 0.5) * 8;
  }
  return arr;
}

const PARTICLE_POSITIONS = makeParticlePositions(140);

function Particles({ count = 140 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = count === 140 ? PARTICLE_POSITIONS : makeParticlePositions(count);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#c9a227" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

export function HeroScene({ quality }: { quality: "high" | "low" }) {
  const dpr: [number, number] | number = quality === "high" ? [1, 1.8] : 1;

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [3.4, 1.6, 5.5], fov: 42 }}
      gl={{ antialias: quality === "high", powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
      frameloop={quality === "high" ? "always" : "demand"}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 6, 4]} intensity={1.4} castShadow={quality === "high"} />
      <spotLight position={[-4, 3, -2]} angle={0.5} penumbra={1} intensity={0.8} color="#c9a227" />
      <pointLight position={[0, -2, 3]} intensity={0.4} color="#fff6df" />

      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.6}>
        <CameraModel quality={quality} />
      </Float>

      {quality === "high" && <Particles />}

      <ContactShadows
        position={[0, -1.35, 0]}
        opacity={0.45}
        scale={8}
        blur={2.6}
        far={3}
        color="#000000"
      />
    </Canvas>
  );
}