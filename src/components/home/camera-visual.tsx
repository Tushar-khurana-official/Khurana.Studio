"use client";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useState } from "react";

const MAX_ROTATE = 5;
const MAX_SHIFT = 10;
const CURSOR_SIZE = 32;
const CURSOR_SPRING = { stiffness: 380, damping: 30, mass: 0.5 };

type VisualMode = "tilt" | "float" | "static";

export function CameraVisual() {
  const [mode, setMode] = useState<VisualMode>("static");
  const [hovered, setHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMode(reduced ? "static" : fine ? "tilt" : "float");
  }, []);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const spring = { stiffness: 110, damping: 18, mass: 0.6 };
  const springCursorX = useSpring(cursorX, CURSOR_SPRING);
  const springCursorY = useSpring(cursorY, CURSOR_SPRING);

  const rotateX = useSpring(useTransform(my, [0, 1], [MAX_ROTATE, -MAX_ROTATE]), spring);
  const rotateY = useSpring(useTransform(mx, [0, 1], [-MAX_ROTATE, MAX_ROTATE]), spring);
  const x = useSpring(useTransform(mx, [0, 1], [-MAX_SHIFT, MAX_SHIFT]), spring);
  const y = useSpring(useTransform(my, [0, 1], [-MAX_SHIFT, MAX_SHIFT]), spring);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    cursorX.set(px - CURSOR_SIZE / 2);
    cursorY.set(py - CURSOR_SIZE / 2);
    if (mode !== "tilt") return;
    mx.set(px / rect.width);
    my.set(py / rect.height);
  };

  const handleMouseLeave = () => {
    mx.set(0.5);
    my.set(0.5);
    setHovered(false);
  };

  const followX = prefersReducedMotion ? cursorX : springCursorX;
  const followY = prefersReducedMotion ? cursorY : springCursorY;

  return (
    <div
      className="group relative h-full w-full cursor-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setHovered(true)}
    >
      {/* theme-reactive accent glow behind the camera */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 55% at 50% 52%, color-mix(in srgb, var(--accent-bright) 24%, transparent), transparent 72%)",
        }}
      />

      {/* intensified glow on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(55% 55% at 50% 52%, color-mix(in srgb, var(--accent-bright) 45%, transparent), transparent 72%)",
        }}
      />

      <motion.div
        className="relative flex h-full w-full items-center justify-center will-change-transform"
        animate={mode === "float" ? { y: [0, -12, 0] } : undefined}
        transition={mode === "float" ? { duration: 5, repeat: Infinity, ease: "easeInOut" } : undefined}
        style={mode === "tilt" ? { rotateX, rotateY, x, y, transformPerspective: 900 } : undefined}
      >
        <Image
          src="/images/camera-hero.png"
          alt="Khurana Studio DSLR camera"
          width={677}
          height={369}
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 60vw, 42vw"
          preload
          className="h-auto w-full transition-transform duration-500 ease-out group-hover:scale-[1.03] drop-shadow-[0_32px_60px_rgba(0,0,0,0.35)] dark:drop-shadow-[0_32px_70px_rgba(0,0,0,0.55)]"
          style={{ objectFit: "contain" }}
        />
      </motion.div>

      {/* custom crosshair cursor, visible only while hovering the camera area */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-10 flex h-8 w-8 items-center justify-center"
        style={{ x: followX, y: followY }}
        animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.6 }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6 text-gold"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <circle cx="12" cy="12" r="6.5" />
          <path d="M12 2.5v4M12 17.5v4M2.5 12h4M17.5 12h4" />
        </svg>
        <span className="absolute h-1 w-1 rounded-full bg-gold" />
      </motion.div>
    </div>
  );
}