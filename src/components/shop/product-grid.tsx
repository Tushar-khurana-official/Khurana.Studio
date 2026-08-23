"use client";

import { useState } from "react";
import { ProductCard } from "@/components/shop/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { StaggerGroup, StaggerItem } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";
import type { Product } from "@/hooks/use-products";

export function ProductGrid({
  products,
  loading,
}: {
  products: Product[];
  loading?: boolean;
}) {
  const [filter, setFilter] = useState<string>("ALL");
  const filters = [
    { key: "ALL", label: "All" },
    { key: "SERVICE", label: "Packages" },
    { key: "PHYSICAL", label: "Prints & Albums" },
    { key: "DIGITAL", label: "Digital" },
  ];

  const filtered = filter === "ALL" ? products : products.filter((p) => p.type === filter);
  const visible = loading ? Array.from({ length: 6 }) : filtered;

  return (
    <>
      <div className="mb-10 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={cn(
              "inline-flex min-h-11 items-center rounded-full border px-5 text-sm font-medium transition",
              filter === f.key
                ? "border-gold bg-accent text-accent-foreground"
                : "border-border hover:border-gold/50"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {!loading && !filtered.length ? (
        <div className="rounded-2xl border border-dashed border-border py-20 text-center text-muted-foreground">
          No products in this category yet — check back soon.
        </div>
      ) : (
        <StaggerGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" stagger={0.07}>
          {visible.map((p, i) =>
            loading || !(p as Product)?.id ? (
              <StaggerItem key={i}>
                <div className="overflow-hidden rounded-2xl border border-border bg-card">
                  <Skeleton className="aspect-[4/3] w-full rounded-none" />
                  <div className="space-y-3 p-5">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-6 w-1/3" />
                  </div>
                </div>
              </StaggerItem>
            ) : (
              <StaggerItem key={(p as Product).id}>
                <ProductCard product={p as Product} />
              </StaggerItem>
            )
          )}
        </StaggerGroup>
      )}
    </>
  );
}