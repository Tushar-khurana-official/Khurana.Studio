import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/ui/section";
import { ProductGrid } from "@/components/shop/product-grid";
import { prisma } from "@/lib/prisma";
import { productSelect } from "@/lib/query";
import type { Product } from "@/hooks/use-products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop — Packages, Prints & Albums",
  description:
    "Book Khurana Studio packages, order museum-grade framed prints, fine-art albums and digital downloads.",
};

export default async function ShopPage() {
  let products: Product[] = [];
  try {
    products = (await prisma.product.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
      select: productSelect,
    })) as unknown as Product[];
  } catch {
    console.error("[shop] DB unavailable");
  }

  return (
    <section className="pt-28">
      <Section>
        <SectionHeading
          eyebrow="The Store"
          title="Packages, prints & keepsakes"
          description="Book a shoot package, or take your favourite frame home as a museum-grade print, fine-art album or digital download."
        />
        <ProductGrid products={products} />
      </Section>
    </section>
  );
}