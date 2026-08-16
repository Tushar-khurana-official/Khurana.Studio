"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function lensGlass() {
  return (
    <meshStandardMaterial
      color="#0b1014"
      metalness={0.9}
      roughness={0.08}
      envMapIntensity={1.4}
    />
  );
}

/** Low-poly procedural camera built from primitives — no external .glb needed. */
export function CameraModel({ quality }: { quality: "high" | "low" }) {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current || !inner.current) return;
    const t = state.clock.elapsedTime;
    const { x, y } = state.pointer;

    // gentle idle float
    group.current.position.y = Math.sin(t * 0.6) * 0.15;
    group.current.rotation.z = Math.sin(t * 0.4) * 0.03;

    // responsive to mouse with easing (throttled naturally by easing)
    inner.current.rotation.y += (x * 0.5 - inner.current.rotation.y) * 0.06;
    inner.current.rotation.x += (-y * 0.3 - inner.current.rotation.x) * 0.06;

    // subtle scroll-linked tilt
    const scroll = window.scrollY / Math.max(window.innerHeight, 1);
    inner.current.rotation.x += (scroll * 0.35) * 0.01;
  });

  const segments = quality === "high" ? 48 : 16;

  return (
    <group ref={group}>
      <group ref={inner} rotation={[0.1, 0.4, 0]}>
        {/* Body */}
        <mesh castShadow>
          <boxGeometry args={[2.2, 1.5, 1.3]} />
          <meshStandardMaterial color="#1d1a16" roughness={0.6} metalness={0.25} />
        </mesh>

        {/* Leather top strip */}
        <mesh position={[0, 0.77, 0]}>
          <boxGeometry args={[2.3, 0.06, 1.36]} />
          <meshStandardMaterial color="#2b2118" roughness={0.95} />
        </mesh>

        {/* Gold trim */}
        <mesh position={[0, -0.76, 0]}>
          <boxGeometry args={[2.28, 0.05, 1.34]} />
          <meshStandardMaterial color="#c9a227" metalness={1} roughness={0.35} />
        </mesh>

        {/* Lens barrel base */}
        <mesh position={[0, 0.05, 0.72]}>
          <cylinderGeometry args={[0.52, 0.6, 0.5, segments]} />
          <meshStandardMaterial color="#0f0d0b" roughness={0.5} metalness={0.6} />
        </mesh>
        {/* Lens barrel mid */}
        <mesh position={[0, 0.05, 1.02]}>
          <cylinderGeometry args={[0.44, 0.52, 0.35, segments]} />
          <meshStandardMaterial color="#c9a227" metalness={1} roughness={0.3} />
        </mesh>
        {/* Lens front ring */}
        <mesh position={[0, 0.05, 1.24]}>
          <cylinderGeometry args={[0.38, 0.44, 0.12, segments]} />
          <meshStandardMaterial color="#2b2118" roughness={0.5} />
        </mesh>
        {/* Glass */}
        <mesh position={[0, 0.05, 1.3]}>
          <cylinderGeometry args={[0.34, 0.34, 0.05, segments]} />
          {lensGlass()}
        </mesh>

        {/* Viewfinder */}
        <mesh position={[0.55, 0.95, 0.1]}>
          <boxGeometry args={[0.65, 0.5, 0.55]} />
          <meshStandardMaterial color="#14110e" roughness={0.7} metalness={0.4} />
        </mesh>
        <mesh position={[0.55, 1.22, 0.05]}>
          <boxGeometry args={[0.4, 0.06, 0.3]} />
          <meshStandardMaterial color="#1a1713" roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Shutter dial */}
        <mesh position={[-0.75, 0.8, 0.4]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.18, segments]} />
          <meshStandardMaterial color="#c9a227" metalness={1} roughness={0.3} />
        </mesh>
        {/* Shutter button */}
        <mesh position={[-0.28, 0.78, 0.68]}>
          <cylinderGeometry args={[0.1, 0.1, 0.14, 24]} />
          <meshStandardMaterial color="#e6c665" metalness={1} roughness={0.25} />
        </mesh>

        {/* Film advance knob */}
        <mesh position={[0.82, 0.8, -0.55]}>
          <cylinderGeometry args={[0.14, 0.14, 0.16, segments]} />
          <meshStandardMaterial color="#14110e" roughness={0.5} metalness={0.6} />
        </mesh>
      </group>
    </group>
  );
}