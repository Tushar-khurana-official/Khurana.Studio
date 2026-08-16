"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { StudioImage } from "@/components/ui/studio-image";
import { ImageSkeleton } from "@/components/ui/skeleton";
import { Lightbox } from "@/components/portfolio/lightbox";
import { cn } from "@/lib/utils";
import type { PortfolioImage } from "@/hooks/use-portfolio";

const categories = [
  { key: "", label: "All Work" },
  { key: "WEDDING", label: "Weddings" },
  { key: "PREWEDDING", label: "Pre-wedding" },
  { key: "PORTRAIT", label: "Portraits" },
  { key: "EVENT", label: "Events" },
  { key: "PRODUCT", label: "Products" },
] as const;

export function Gallery({
  images,
  loading,
}: {
  images: PortfolioImage[];
  loading?: boolean;
}) {
  const [active, setActive] = useState<string>("");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = active ? images.filter((img) => img.category === active) : images;
  const visible = loading ? Array.from({ length: 9 }) : filtered;

  return (
    <>
      <div className="mb-10 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => setActive(cat.key)}
            className={cn(
              "rounded-full border px-5 py-2 text-sm font-medium transition",
              active === cat.key
                ? "border-gold bg-accent text-accent-foreground"
                : "border-border hover:border-gold/50"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <motion.div layout className="columns-1 gap-5 sm:columns-2 lg:columns-3">
        <AnimatePresence mode="popLayout">
          {visible.map((img, i) => (
            <motion.button
              key={(img as PortfolioImage)?.id ?? i}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: (i % 6) * 0.04, duration: 0.4 }}
              type="button"
              onClick={() => {
                const realIndex = filtered.findIndex((x) => x.id === (img as PortfolioImage)?.id);
                if (realIndex >= 0) setLightboxIndex(realIndex);
              }}
              className="group relative mb-5 block w-full overflow-hidden rounded-2xl border border-border break-inside-avoid"
            >
              {loading || !(img as PortfolioImage)?.publicId ? (
                <ImageSkeleton className="h-64 w-full rounded-none sm:h-80" />
              ) : (
                <StudioImage
                  publicId={(img as PortfolioImage).publicId}
                  alt={(img as PortfolioImage).title ?? "Khurana Studio portfolio image"}
                  width={800}
                  height={Math.max(600, 700 + ((i * 137) % 5) * 120)}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="rounded-none transition duration-700 group-hover:scale-[1.04]"
                />
              )}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition group-hover:opacity-100">
                <span className="text-sm font-medium text-white">
                  {(img as PortfolioImage)?.title?.replaceAll("-", " ") ?? "Untitled"}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-white/70">
                  {(img as PortfolioImage)?.category ?? ""}
                </span>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {lightboxIndex !== null && filtered[lightboxIndex] && (
          <Lightbox
            images={filtered}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNavigate={setLightboxIndex}
          />
        )}
      </AnimatePresence>
    </>
  );
}