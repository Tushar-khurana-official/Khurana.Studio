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

  if (!imageSrc || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn("flex items-center justify-center bg-muted", className)}
      >
        <span className="text-muted-foreground/60 font-display text-sm italic">Khurana Studio</span>
      </div>
    );
  }

  return (
    <CldImage
      src={imageSrc}
      alt={alt}
      className={cn("object-cover", className)}
      onError={() => setFailed(true)}
      {...props}
    />
  );
}