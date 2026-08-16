"use client";

import { useQuery } from "@tanstack/react-query";
import type { ProductType } from "@/generated/prisma/enums";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAt?: number | null;
  type: ProductType;
  currency: string;
  images: string[];
  features: string[];
  stock?: number | null;
  active: boolean;
  reviews?: {
    id: string;
    rating: number;
    text?: string | null;
    createdAt: string;
    user: { name: string };
  }[];
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to load products");
      const data = (await res.json()) as { products: Product[] };
      return data.products;
    },
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const res = await fetch(`/api/products/${slug}`);
      if (!res.ok) throw new Error("Failed to load product");
      const data = (await res.json()) as { product: Product };
      return data.product;
    },
    enabled: !!slug,
  });
}