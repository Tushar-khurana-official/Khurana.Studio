"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { StudioImage } from "@/components/ui/studio-image";
import type { PortfolioImage } from "@/hooks/use-portfolio";

interface LightboxProps {
  images: PortfolioImage[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function Lightbox({ images, index, onClose, onNavigate }: LightboxProps) {
  const [scale, setScale] = useState(1);
  const image = images[index];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate((index + 1) % images.length);
      if (e.key === "ArrowLeft") onNavigate((index - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, images.length, onClose, onNavigate]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setScale(1), [index]);

  if (!image) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={image.title ?? "Portfolio image"}
    >
      <motion.div
        className="relative max-h-[86vh] max-w-[92vw] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.96 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.96 }}
      >
        <motion.div style={{ scale }} className="cursor-grab active:cursor-grabbing">
          <StudioImage
            publicId={image.publicId}
            alt={image.title ?? "Portfolio image"}
            width={1400}
            height={1000}
            className="max-h-[86vh] max-w-[92vw] rounded-xl"
            style={{ height: "auto", width: "auto" }}
          />
        </motion.div>
      </motion.div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setScale((s) => Math.min(s + 0.5, 3));
        }}
        className="absolute bottom-6 right-24 inline-flex min-h-11 items-center rounded-full border border-white/20 bg-white/10 px-4 text-xs text-white backdrop-blur"
      >
        Zoom +
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setScale(1);
        }}
        className="absolute bottom-6 right-12 inline-flex min-h-11 items-center rounded-full border border-white/20 bg-white/10 px-4 text-xs text-white backdrop-blur"
      >
        100%
      </button>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close lightbox"
        className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((index - 1 + images.length) % images.length);
            }}
            className="absolute left-5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((index + 1) % images.length);
            }}
            className="absolute right-5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs tracking-widest text-white/70">
        {index + 1} / {images.length} · {image.title ?? ""}
      </span>
    </motion.div>
  );
}