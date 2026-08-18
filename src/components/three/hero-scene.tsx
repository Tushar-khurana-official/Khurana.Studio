"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { useTheme } from "next-themes";
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

function Particles({ count = 140, color }: { count?: number; color: string }) {
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
      <pointsMaterial size={0.035} color={color} transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

export function HeroScene({ quality }: { quality: "high" | "low" }) {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme !== "light";
  const accent = dark ? "#22c55e" : "#db2777";
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
      <spotLight position={[-4, 3, -2]} angle={0.5} penumbra={1} intensity={0.8} color={accent} />
      <pointLight position={[0, -2, 3]} intensity={0.4} color={accent} />

      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.6}>
        <CameraModel quality={quality} />
      </Float>

      {quality === "high" && <Particles color={accent} />}

      {quality === "high" && (
        <Environment resolution={64}>
          <Lightformer intensity={1.2} position={[4, 5, 2]} scale={[8, 8, 1]} />
          <Lightformer intensity={0.6} position={[-6, 3, -4]} scale={[6, 6, 1]} color={accent} />
          <Lightformer intensity={0.5} position={[0, -4, 3]} scale={[6, 6, 1]} color={accent} />
        </Environment>
      )}

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