"use client";

import { CldImage, type CldImageProps } from "next-cloudinary";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface StudioImageProps extends Omit<CldImageProps, "src" | "alt"> {
  publicId?: string | null;
  src?: string;
  alt: string;
  className?: string;
}

/**
 * Single image component for the entire site. Every asset flows through
 * Cloudinary (f_auto + q_auto) for WebP/AVIF + responsive srcset.
 */
export function StudioImage({ publicId, src, alt, className, ...props }: StudioImageProps) {
  const [failed, setFailed] = useState(false);
  const imageSrc = publicId ?? src;
  const cloudConfigured = Boolean(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);

  if (!imageSrc || failed || !cloudConfigured) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn("flex flex-col items-center justify-center gap-2 bg-muted", className)}
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7 text-accent-bright/60" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 8.5A1.5 1.5 0 0 1 4.5 7H7l1.5-2h7L17 7h2.5A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5v-9z"
          />
          <circle cx="12" cy="13" r="3.25" />
        </svg>
        <span className="font-display text-sm text-muted-foreground/70">Khurana Studio</span>
      </div>
    );
  }

  const { fill, width, height, ...rest } = props;

  return (
    <CldImage
      src={imageSrc}
      alt={alt}
      className={cn("object-cover", className)}
      onError={() => setFailed(true)}
      fill={fill}
      {...(fill ? { sizes: rest.sizes } : { width, height, ...rest })}
    />
  );
}