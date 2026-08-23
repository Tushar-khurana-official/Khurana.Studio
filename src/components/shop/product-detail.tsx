"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { StudioImage } from "@/components/ui/studio-image";
import { Button } from "@/components/ui/button";
import { formatINR, cn } from "@/lib/utils";
import { useCartStore } from "@/lib/cart-store";
import { useWishlistStore } from "@/lib/wishlist-store";
import type { Product } from "@/hooks/use-products";

const FrameMockup = dynamic(() => import("@/components/three/frame-mockup").then((m) => m.FrameMockup), { ssr: false });

const typeLabels: Record<string, string> = {
  SERVICE: "Service",
  PHYSICAL: "Physical print",
  DIGITAL: "Digital download",
};

export function ProductDetail({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const [view, setView] = useState<"photo" | "3d">("photo");
  const addItem = useCartStore((s) => s.addItem);
  const toggleWish = useWishlistStore((s) => s.toggle);
  const hasWish = useWishlistStore((s) => s.has(product.id));
  const router = useRouter();

  const show3D = product.type === "PHYSICAL" && !!product.images[0];

  const handleAdd = (goToCart = false) => {
    addItem(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        type: product.type,
        image: product.images[0] ?? "",
      },
      qty
    );
    if (goToCart) router.push("/cart");
  };

  const avgRating = product.reviews?.length
    ? Math.round((product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length) * 10) / 10
    : null;

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      {/* Visual */}
      <div>
        <div className="mb-3 flex gap-2">
          {show3D && (
            <>
              <button
                type="button"
                onClick={() => setView("photo")}
                className={cn(
                  "inline-flex min-h-11 items-center rounded-full border px-4 text-xs font-medium transition",
                  view === "photo" ? "border-gold bg-accent text-accent-foreground" : "border-border"
                )}
              >
                Photo
              </button>
              <button
                type="button"
                onClick={() => setView("3d")}
                className={cn(
                  "inline-flex min-h-11 items-center rounded-full border px-4 text-xs font-medium transition",
                  view === "3d" ? "border-gold bg-accent text-accent-foreground" : "border-border"
                )}
              >
                Rotate in 3D
              </button>
            </>
          )}
        </div>

        <motion.div
          key={view}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            "relative overflow-hidden rounded-3xl border border-border bg-card",
            view === "3d" ? "aspect-square" : "aspect-[4/3]"
          )}
        >
          {view === "3d" && show3D ? (
            <FrameMockup publicId={product.images[0]} />
          ) : (
            <StudioImage
              publicId={product.images[0]}
              alt={product.name}
              width={1000}
              height={750}
              sizes="(max-width: 1024px) 100vw, 50vw"
              fill
              className="rounded-none"
            />
          )}
        </motion.div>
      </div>

      {/* Info */}
      <div className="flex flex-col">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
          {typeLabels[product.type]}
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">{product.name}</h1>

        {avgRating !== null && (
          <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="flex gap-0.5 text-gold">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  viewBox="0 0 20 20"
                  className={cn("h-3.5 w-3.5", i < Math.round(avgRating) ? "fill-current" : "fill-muted-foreground/30")}
                >
                  <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z" />
                </svg>
              ))}
            </span>
            {avgRating} · {product.reviews?.length ?? 0} reviews
          </p>
        )}

        <div className="mt-4 flex items-center gap-3">
          <span className="font-display text-3xl font-semibold">{formatINR(product.price)}</span>
          {product.compareAt && product.compareAt > product.price && (
            <span className="text-lg text-muted-foreground line-through">{formatINR(product.compareAt)}</span>
          )}
        </div>

        <p className="mt-6 leading-relaxed text-muted-foreground">{product.description}</p>

        {product.features.length > 0 && (
          <ul className="mt-6 space-y-2">
            {product.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 text-gold">✦</span>
                {feature}
              </li>
            ))}
          </ul>
        )}

        {product.stock != null && product.type === "PHYSICAL" && (
          <p className="mt-4 text-xs text-muted-foreground">
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <div className="flex items-center rounded-full border border-border">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="h-11 w-11 rounded-full transition hover:bg-muted"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-8 text-center text-sm font-semibold">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(10, q + 1))}
              className="h-11 w-11 rounded-full transition hover:bg-muted"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <Button onClick={() => handleAdd(false)}>Add to Cart</Button>
          <Button variant="outline" onClick={() => handleAdd(true)}>
            Buy Now
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="px-3"
            aria-label="Toggle wishlist"
            onClick={() => toggleWish(product.id)}
          >
            <svg
              viewBox="0 0 24 24"
              className={cn("h-5 w-5", hasWish ? "fill-gold text-gold" : "fill-none")}
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
          </Button>
        </div>
      </div>

      {/* Reviews */}
      {product.reviews && product.reviews.length > 0 && (
        <div className="lg:col-span-2">
          <h2 className="mb-6 font-display text-2xl font-semibold">Client reviews</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {product.reviews.map((r) => (
              <div key={r.id} className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-3 flex gap-0.5 text-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} viewBox="0 0 20 20" className={cn("h-4 w-4", i < r.rating ? "fill-current" : "fill-muted-foreground/30")}>
                      <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">“{r.text}”</p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {r.user.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}