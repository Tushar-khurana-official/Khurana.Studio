import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ProductDetail } from "@/components/shop/product-detail";
import { prisma } from "@/lib/prisma";
import { productSelect } from "@/lib/query";
import type { Product } from "@/hooks/use-products";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  let product: { name: string; description: string; images: string[] } | null = null;
  try {
    product = await prisma.product.findUnique({
      where: { slug },
      select: { name: true, description: true, images: true },
    });
  } catch {
    return { title: "Product" };
  }
  if (!product) return { title: "Not found" };
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      images: product.images[0]
        ? [{ url: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto/${product.images[0]}` }]
        : [],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let product: Product | null = null;
  try {
    product = (await prisma.product.findUnique({
      where: { slug },
      select: {
        ...productSelect,
        reviews: {
          select: { id: true, rating: true, text: true, createdAt: true, user: { select: { name: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    })) as unknown as Product | null;
  } catch {
    notFound();
  }

  if (!product || !product.active) notFound();

  return (
    <section className="pt-28">
      <Section>
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/shop" },
            { label: product.name },
          ]}
        />
        <ProductDetail product={product} />
      </Section>
    </section>
  );
}