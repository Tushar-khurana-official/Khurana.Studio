"use client";

import { Canvas } from "@react-three/fiber";
import { useTexture, OrbitControls, ContactShadows } from "@react-three/drei";
import { optimizedUrl } from "@/lib/cloudinary-url";

function FramedPrint({ publicId }: { publicId: string }) {
  const texture = useTexture(optimizedUrl(publicId, { w: 1200, h: 900, c: "fill" }));

  const frameMaterial = (
    <meshStandardMaterial color="#8a6d14" metalness={0.85} roughness={0.35} />
  );

  return (
    <group rotation={[0.1, 0.3, 0]}>
      {/* Outer frame */}
      <mesh castShadow>
        <boxGeometry args={[2.6, 2.0, 0.12]} />
        {frameMaterial}
      </mesh>
      {/* Mat */}
      <mesh position={[0, 0, 0.06]}>
        <boxGeometry args={[2.3, 1.7, 0.02]} />
        <meshStandardMaterial color="#f5f1e8" roughness={0.9} />
      </mesh>
      {/* Photo */}
      <mesh position={[0, 0, 0.09]}>
        <planeGeometry args={[2.1, 1.5]} />
        <meshStandardMaterial map={texture} roughness={0.5} />
      </mesh>
      {/* Glass */}
      <mesh position={[0, 0, 0.11]}>
        <planeGeometry args={[2.36, 1.76]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.08}
          roughness={0.05}
          metalness={0.1}
          envMapIntensity={1}
        />
      </mesh>
      {/* Gold corner accents */}
      {[
        [1.18, 0.88],
        [-1.18, 0.88],
        [1.18, -0.88],
        [-1.18, -0.88],
      ].map(([x, y]) => (
        <mesh key={`${x}${y}`} position={[x, y, 0.08]}>
          <boxGeometry args={[0.08, 0.08, 0.14]} />
          <meshStandardMaterial color="#e6c665" metalness={1} roughness={0.25} />
        </mesh>
      ))}
    </group>
  );
}

export function FrameMockup({ publicId }: { publicId: string }) {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0.2, 4.6], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 5, 3]} intensity={1.3} castShadow />
      <pointLight position={[-3, 2, 2]} intensity={0.5} color="#c9a227" />

      <FramedPrint publicId={publicId} />

      <ContactShadows position={[0, -1.3, 0]} opacity={0.4} scale={7} blur={2.5} far={3} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={1.6}
        maxPolarAngle={Math.PI / 2.2}
        minPolarAngle={Math.PI / 4}
      />
    </Canvas>
  );
}