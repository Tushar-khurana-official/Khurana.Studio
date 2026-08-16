import { prisma } from "@/lib/prisma";

export const productSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  price: true,
  compareAt: true,
  type: true,
  currency: true,
  images: true,
  features: true,
  stock: true,
  active: true,
} as const;

export function getActiveProducts() {
  return prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
    select: productSelect,
  });
}

export function getPortfolioImages(category?: string, featuredOnly = false) {
  return prisma.portfolioImage.findMany({
    where: {
      ...(category ? { category: category as never } : {}),
      ...(featuredOnly ? { featured: true } : {}),
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      publicId: true,
      secureUrl: true,
      width: true,
      height: true,
      title: true,
      category: true,
      featured: true,
    },
  });
}