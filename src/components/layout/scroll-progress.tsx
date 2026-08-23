"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { usePathname } from "next/navigation";

const SHOW_ON = ["/", "/portfolio", "/shop", "/booking", "/checkout", "/cart", "/admin"];

export function ScrollProgress() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  const enabled = SHOW_ON.some((route) => pathname === route || pathname.startsWith(`${route}/`));
  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-accent-deep via-accent to-accent-bright"
      style={{ scaleX: reduced ? scrollYProgress : scaleX }}
    />
  );
}