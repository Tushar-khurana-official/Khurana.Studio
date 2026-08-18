"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { useTheme } from "next-themes";
import * as THREE from "three";
import "@/lib/three-console";

type Palette = {
  body: string;
  topPlate: string;
  leather: string;
  barrel: string;
  glass: string;
  dial: string;
  accent: string;
  accentBright: string;
};

const GRAPHITE_BODY = "#3a3a3d";
const GRAPHITE_PLATE = "#464649";
const GRAPHITE_BARREL = "#3d3d40";
const GRAPHITE_DIAL = "#323235";
const GRAPHITE_LEATHER = "#262628";

const DARK: Palette = {
  body: GRAPHITE_BODY,
  topPlate: GRAPHITE_PLATE,
  leather: GRAPHITE_LEATHER,
  barrel: GRAPHITE_BARREL,
  glass: "#0a0d12",
  dial: GRAPHITE_DIAL,
  accent: "#22c55e",
  accentBright: "#4ade80",
};

const LIGHT: Palette = {
  body: GRAPHITE_BODY,
  topPlate: GRAPHITE_PLATE,
  leather: GRAPHITE_LEATHER,
  barrel: GRAPHITE_BARREL,
  glass: "#0a0d12",
  dial: GRAPHITE_DIAL,
  accent: "#db2777",
  accentBright: "#ec4899",
};

function lensGlass(p: Palette) {
  return (
    <meshStandardMaterial color={p.glass} metalness={0.9} roughness={0.08} envMapIntensity={1.4} />
  );
}

/** Procedural DSLR built from primitives — no external .glb needed. */
export function CameraModel({ quality }: { quality: "high" | "low" }) {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme !== "light";
  const p = dark ? DARK : LIGHT;

  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const timer = useRef<THREE.Timer | null>(null);

  useFrame((state) => {
    if (!group.current || !inner.current) return;
    if (!timer.current) timer.current = new THREE.Timer();
    timer.current.update();
    const t = timer.current.getElapsed();
    const { x, y } = state.pointer;

    // gentle idle float
    group.current.position.y = Math.sin(t * 0.6) * 0.15;
    group.current.rotation.z = Math.sin(t * 0.4) * 0.03;

    // responsive to mouse with easing (throttled naturally by easing)
    inner.current.rotation.y += (x * 0.5 - inner.current.rotation.y) * 0.06;
    inner.current.rotation.x += (-y * 0.3 - inner.current.rotation.x) * 0.06;

    // subtle scroll-linked tilt
    const scroll = window.scrollY / Math.max(window.innerHeight, 1);
    inner.current.rotation.x += scroll * 0.35 * 0.01;
  });

  const segments = quality === "high" ? 48 : 20;

  return (
    <group ref={group}>
      <group ref={inner} rotation={[0.1, 0.4, 0]}>
        {/* Main body — graphite PBR, catches light like camera-body metal */}
        <RoundedBox args={[2.4, 1.4, 1.2]} radius={0.16} smoothness={4} castShadow>
          <meshStandardMaterial color={p.body} metalness={0.65} roughness={0.35} />
        </RoundedBox>

        {/* Top plate */}
        <mesh position={[0, 0.7, 0]}>
          <boxGeometry args={[2.4, 0.12, 1.2]} />
          <meshStandardMaterial color={p.topPlate} metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Grip bulge — right side, rounded secondary box */}
        <RoundedBox
          args={[0.46, 0.86, 0.72]}
          radius={0.16}
          smoothness={4}
          position={[1.18, -0.14, 0.3]}
          rotation={[0, -0.14, -0.05]}
        >
          <meshStandardMaterial color={p.leather} metalness={0.1} roughness={0.95} />
        </RoundedBox>

        {/* Pentaprism / viewfinder hump — top center */}
        <RoundedBox args={[0.8, 0.44, 0.64]} radius={0.12} smoothness={4} position={[-0.35, 0.96, -0.12]}>
          <meshStandardMaterial color={p.body} metalness={0.6} roughness={0.4} />
        </RoundedBox>
        {/* Eyepiece at the back of the hump */}
        <mesh position={[-0.35, 1.2, -0.32]}>
          <boxGeometry args={[0.42, 0.16, 0.26]} />
          <meshStandardMaterial color={p.leather} metalness={0.2} roughness={0.6} />
        </mesh>
        {/* Hot-shoe bump on top of the hump */}
        <mesh position={[-0.35, 1.22, 0.02]}>
          <boxGeometry args={[0.56, 0.1, 0.3]} />
          <meshStandardMaterial color={p.topPlate} metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Accent brand stripe on front face */}
        <mesh position={[0, 0.62, 0.61]}>
          <boxGeometry args={[1.9, 0.04, 0.02]} />
          <meshStandardMaterial color={p.accentBright} metalness={1} roughness={0.25} />
        </mesh>

        {/* Shutter button — top right, forward */}
        <mesh position={[0.82, 0.8, 0.3]}>
          <cylinderGeometry args={[0.13, 0.13, 0.14, 24]} />
          <meshStandardMaterial color={p.topPlate} metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Mode dial — top right */}
        <mesh position={[0.82, 0.8, 0.62]}>
          <cylinderGeometry args={[0.16, 0.16, 0.1, segments]} />
          <meshStandardMaterial color={p.dial} metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Secondary dial — top left, back */}
        <mesh position={[-0.9, 0.8, -0.4]}>
          <cylinderGeometry args={[0.2, 0.2, 0.1, segments]} />
          <meshStandardMaterial color={p.dial} metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Lens assembly — tapers in two sections with thin accent rings */}
        {/* Mount base where the lens meets the body */}
        <mesh position={[0, 0.05, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.56, 0.66, 0.3, segments]} />
          <meshStandardMaterial color={p.barrel} metalness={0.7} roughness={0.35} />
        </mesh>
        {/* Thin precise accent ring at the mount junction */}
        <mesh position={[0, 0.05, 0.77]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.53, 0.57, 0.05, segments]} />
          <meshStandardMaterial color={p.accent} metalness={1} roughness={0.25} />
        </mesh>
        {/* Tapered outer barrel */}
        <mesh position={[0, 0.05, 0.93]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.46, 0.54, 0.46, segments]} />
          <meshStandardMaterial color={p.barrel} metalness={0.75} roughness={0.3} />
        </mesh>
        {/* Narrower front element */}
        <mesh position={[0, 0.05, 1.22]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.38, 0.46, 0.28, segments]} />
          <meshStandardMaterial color={p.topPlate} metalness={0.75} roughness={0.3} />
        </mesh>
        {/* Thin accent ring on the front element */}
        <mesh position={[0, 0.05, 1.38]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.42, 0.04, segments]} />
          <meshStandardMaterial color={p.accent} metalness={1} roughness={0.25} />
        </mesh>
        {/* Filter ring */}
        <mesh position={[0, 0.05, 1.44]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.36, 0.4, 0.07, segments]} />
          <meshStandardMaterial color={p.dial} metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Glass */}
        <mesh position={[0, 0.05, 1.48]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 0.04, segments]} />
          {lensGlass(p)}
        </mesh>
      </group>
    </group>
  );
}