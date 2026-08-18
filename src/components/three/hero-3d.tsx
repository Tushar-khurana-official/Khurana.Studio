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
          {/* body */}
          <div className="absolute inset-0 rounded-2xl border-2 border-accent/40 bg-card shadow-2xl shadow-accent/10" />
          {/* grip */}
          <div className="absolute bottom-6 right-2 top-9 w-7 rounded-l-xl bg-muted" />
          {/* viewfinder hump */}
          <div className="absolute left-7 top-4 h-10 w-16 rounded-lg border border-accent/40 bg-card">
            <div className="absolute inset-x-2 bottom-1 top-2 rounded-sm bg-foreground/10" />
          </div>
          {/* lens */}
          <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-accent/60 bg-foreground/5">
            <div className="absolute inset-2 rounded-full bg-accent/15" />
            <div className="absolute inset-6 rounded-full border-2 border-accent/40" />
            <div className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/20" />
          </div>
          {/* shutter / accent dot */}
          <div className="absolute right-8 top-5 h-2.5 w-2.5 rounded-full bg-accent" />
          {quality === "low" ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-full w-full animate-[spin_12s_linear_infinite] rounded-2xl border border-dashed border-accent/40" />
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