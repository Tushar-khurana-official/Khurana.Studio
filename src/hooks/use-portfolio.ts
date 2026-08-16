"use client";

import { useQuery } from "@tanstack/react-query";
import type { PortfolioCategory } from "@/generated/prisma/enums";

export interface PortfolioImage {
  id: string;
  publicId: string;
  secureUrl: string;
  width?: number | null;
  height?: number | null;
  title?: string | null;
  category: PortfolioCategory;
  featured: boolean;
}

export function usePortfolio(category?: string, featured?: boolean) {
  const query = new URLSearchParams();
  if (category) query.set("category", category);
  if (featured) query.set("featured", "true");
  const qs = query.toString();

  return useQuery({
    queryKey: ["portfolio", category ?? "all", featured ?? false],
    queryFn: async () => {
      const res = await fetch(`/api/portfolio${qs ? `?${qs}` : ""}`);
      if (!res.ok) throw new Error("Failed to load portfolio");
      const data = (await res.json()) as { images: PortfolioImage[] };
      return data.images;
    },
  });
}