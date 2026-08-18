"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { StudioImage } from "@/components/ui/studio-image";
import { formatINR, cn } from "@/lib/utils";
import { useCartStore } from "@/lib/cart-store";
import { useWishlistStore } from "@/lib/wishlist-store";
import { useMounted } from "@/hooks/use-mounted";
import type { Product } from "@/hooks/use-products";

const typeLabels: Record<string, string> = {
  SERVICE: "Service",
  PHYSICAL: "Physical",
  DIGITAL: "Digital",
};

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const addItem = useCartStore((s) => s.addItem);
  const wishlistIds = useWishlistStore((s) => s.ids);
  const wishlistToggle = useWishlistStore((s) => s.toggle);
  const mounted = useMounted();
  const wished = mounted && wishlistIds.includes(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: (index % 4) * 0.06, duration: 0.5 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:border-gold/40 hover:shadow-xl hover:shadow-gold/5"
    >
      <Link href={`/shop/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden">
        <StudioImage
          publicId={product.images[0]}
          alt={product.name}
          width={640}
          height={480}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="rounded-none transition duration-700 group-hover:scale-105"
          fill
        />
        <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-accent-foreground shadow-sm">
          {typeLabels[product.type]}
        </span>
        <button
          type="button"
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          onClick={(e) => {
            e.preventDefault();
            wishlistToggle(product.id);
          }}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70"
        >
          <svg
            viewBox="0 0 24 24"
            className={cn("h-4 w-4", wished ? "fill-gold text-gold" : "fill-none")}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.5c0-2.5-2-4.5-4.5-4.5-1.5 0-2.9.8-4.5 2.3-1.6-1.5-3-2.3-4.5-2.3C5 4 3 6 3 8.5c0 5 6 9.5 9 11 3-1.5 9-6 9-11z"
            />
          </svg>
        </button>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-1 flex items-center justify-between gap-2">
          <Link
            href={`/shop/${product.slug}`}
            className="font-display text-lg font-semibold leading-snug transition hover:text-gold"
          >
            {product.name}
          </Link>
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">{product.description}</p>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <div>
            {product.compareAt && product.compareAt > product.price ? (
              <span className="mr-2 text-xs text-muted-foreground line-through">
                {formatINR(product.compareAt)}
              </span>
            ) : null}
            <span className="text-lg font-semibold">{formatINR(product.price)}</span>
          </div>
          <button
            type="button"
            onClick={() =>
              addItem({
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                type: product.type,
                image: product.images[0] ?? "",
              })
            }
            className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground transition hover:brightness-110 active:scale-95"
            aria-label={`Add ${product.name} to cart`}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
}