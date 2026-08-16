"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { ImageSkeleton } from "@/components/ui/skeleton";

const HeroScene = dynamic(() => import("@/components/three/hero-scene").then((m) => m.HeroScene), {
  ssr: false,
  loading: () => <ImageSkeleton className="h-full w-full" />,
});

type Quality = "high" | "low" | "off";

function detectQuality(): Quality {
  if (typeof window === "undefined") return "high";
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { effectiveType?: string; saveData?: boolean };
  };
  const memory = nav.deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency ?? 8;
  const conn = nav.connection;
  const slowNet = conn?.effectiveType === "slow-2g" || conn?.effectiveType === "2g";
  const saveData = conn?.saveData === true;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reducedMotion || saveData || slowNet || memory <= 2 || cores <= 2) return "off";
  if (memory <= 4 || cores <= 4) return "low";
  return "high";
}

function CameraFallback({ quality }: { quality: "low" | "off" }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-full" aria-hidden>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-44 w-60 sm:h-56 sm:w-72">
          <div className="absolute inset-0 rounded-2xl border border-gold/30 bg-card shadow-2xl shadow-gold/10" />
          <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-gold/60 bg-foreground/5" />
          <div className="absolute right-4 top-4 h-10 w-14 rounded-lg border border-border bg-foreground/10" />
          {quality === "low" ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-full w-full animate-[spin_12s_linear_infinite] rounded-2xl border border-dashed border-gold/40" />
            </div>
          ) : null}
        </div>
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_40%,var(--background)_100%)]" />
    </div>
  );
}

export function Hero3D() {
  const [quality, setQuality] = useState<Quality | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuality(detectQuality());
  }, []);

  if (quality === null) {
    return <ImageSkeleton className="h-full w-full rounded-full" />;
  }

  if (quality === "off") {
    return <CameraFallback quality="off" />;
  }

  return <HeroScene quality={quality} />;
}