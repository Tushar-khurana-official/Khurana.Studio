"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import { StudioImage } from "@/components/ui/studio-image";
import { ButtonLink } from "@/components/ui/button";
import { formatINR } from "@/lib/utils";

export function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) => s.subtotal());

  if (!items.length) {
    return (
      <div className="flex flex-col items-center py-24 text-center">
        <p className="font-display text-3xl font-semibold">Your cart is empty</p>
        <p className="mt-3 text-muted-foreground">Beautiful packages and prints are waiting.</p>
        <ButtonLink href="/shop" className="mt-8">
          Browse the store
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
      <ul className="space-y-4">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex gap-4 rounded-2xl border border-border bg-card p-4"
          >
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl">
              <StudioImage
                publicId={item.image}
                alt={item.name}
                width={192}
                height={192}
                className="h-full w-full"
                fill
              />
            </div>
            <div className="flex flex-1 flex-col">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link href={`/shop/${item.slug}`} className="font-display font-semibold transition hover:text-gold">
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm text-muted-foreground">{formatINR(item.price)} each</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  aria-label={`Remove ${item.name}`}
                  className="text-muted-foreground transition hover:text-red-500"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>
              <div className="mt-auto flex items-center justify-between pt-2">
                <div className="flex items-center rounded-full border border-border">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="h-9 w-9 rounded-full hover:bg-muted"
                    aria-label="Decrease"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="h-9 w-9 rounded-full hover:bg-muted"
                    aria-label="Increase"
                  >
                    +
                  </button>
                </div>
                <p className="font-semibold">{formatINR(item.price * item.quantity)}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <aside className="h-fit rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-24">
        <h2 className="font-display text-xl font-semibold">Order summary</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Subtotal</dt>
            <dd>{formatINR(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Shipping</dt>
            <dd className="text-gold">Calculated at checkout</dd>
          </div>
          <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
            <dt>Total</dt>
            <dd>{formatINR(subtotal)}</dd>
          </div>
        </dl>
        <ButtonLink href="/checkout" size="lg" className="mt-6 w-full">
          Proceed to checkout
        </ButtonLink>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Secured payments powered by <span className="font-medium">Razorpay</span>
        </p>
      </aside>
    </div>
  );
}