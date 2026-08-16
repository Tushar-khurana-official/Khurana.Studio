"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { StudioImage } from "@/components/ui/studio-image";
import { Section, SectionHeading } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";
import { ImageSkeleton } from "@/components/ui/skeleton";
import type { PortfolioImage } from "@/hooks/use-portfolio";

const HEIGHTS = ["h-72 sm:h-80", "h-96 sm:h-[26rem]", "h-80 sm:h-96", "h-72 sm:h-80", "h-[26rem] sm:h-[28rem]"];

export function FeaturedCarousel({
  images,
  loading,
}: {
  images: PortfolioImage[];
  loading?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);

  return (
    <Section className="overflow-hidden py-24">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          eyebrow="Selected Work"
          title="A glimpse of what we craft"
          description="A curated reel of our favourite frames — drag, or let the light guide you."
        />
        <ButtonLink href="/portfolio" variant="outline">
          Explore full portfolio →
        </ButtonLink>
      </div>

      <div ref={ref} className="relative">
        <motion.div style={{ x }} className="flex gap-6 will-change-transform">
          {(loading ? Array.from({ length: 5 }) : images.length ? images : Array.from({ length: 5 })).map(
            (img, i) => (
              <div
                key={(img as PortfolioImage)?.id ?? i}
                className={`relative shrink-0 overflow-hidden rounded-2xl border border-border ${HEIGHTS[i % HEIGHTS.length]} w-64 sm:w-80 md:w-96`}
              >
                {loading || !(img as PortfolioImage)?.publicId ? (
                  <ImageSkeleton className="h-full w-full rounded-none" />
                ) : (
                  <StudioImage
                    publicId={(img as PortfolioImage).publicId}
                    alt={(img as PortfolioImage).title ?? `Khurana Studio work ${i + 1}`}
                    width={800}
                    height={1000}
                    sizes="(max-width: 768px) 75vw, 30vw"
                    fill
                    className="rounded-none transition duration-700 hover:scale-105"
                  />
                )}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-4 left-4 text-sm font-medium text-white/90">
                  {(img as PortfolioImage)?.title?.replaceAll("-", " ") ??
                    `Frame ${String(i + 1).padStart(2, "0")}`}
                </span>
              </div>
            )
          )}
        </motion.div>

        {/* edge fade */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
      </div>
    </Section>
  );
}