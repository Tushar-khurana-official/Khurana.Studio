"use client";

import { CldImage } from "next-cloudinary";

interface BackdropImage {
  publicId?: string | null;
}

const SLOTS = [
  { className: "left-[-6%] top-[-8%] h-[46%] w-[38%] rotate-[-6deg]" },
  { className: "right-[2%] top-[-12%] h-[40%] w-[34%] rotate-[5deg]" },
  { className: "left-[8%] top-[28%] h-[48%] w-[40%] rotate-[3deg]" },
  { className: "right-[-8%] bottom-[6%] h-[50%] w-[42%] rotate-[-4deg]" },
  { className: "left-[-10%] bottom-[-6%] h-[42%] w-[36%] rotate-[6deg]" },
];

export function HeroBackdrop({ images }: { images?: BackdropImage[] }) {
  const imgs = (images ?? []).filter((i) => i?.publicId).slice(0, SLOTS.length);
  if (!imgs.length) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {imgs.map((img, i) => (
        <div
          key={img.publicId}
          className={`absolute ${SLOTS[i].className} opacity-25 blur-2xl sm:blur-3xl grayscale-[15%] dark:opacity-30`}
        >
          <CldImage
            src={img.publicId!}
            alt=""
            width={400}
            height={300}
            crop="fill"
            quality="60"
            sizes="40vw"
            className="h-full w-full scale-110 object-cover"
          />
        </div>
      ))}
    </div>
  );
}