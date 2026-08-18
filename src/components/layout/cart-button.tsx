"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import { useMounted } from "@/hooks/use-mounted";

export function CartButton() {
  const count = useCartStore((s) => s.count());
  const mounted = useMounted();

  return (
    <Link
      href="/cart"
      aria-label={mounted ? `Cart with ${count} items` : "Cart"}
      className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-muted/50 transition hover:border-accent/50"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 4.6a1 1 0 0 0 .9 1.4H19M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm7 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
      </svg>
      {mounted && count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
          {count}
        </span>
      )}
    </Link>
  );
}