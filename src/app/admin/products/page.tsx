import { prisma } from "@/lib/prisma";
import { ProductManager } from "@/components/admin/product-manager";

export default async function AdminProductsPage() {
  let products: Awaited<ReturnType<typeof prisma.product.findMany>> = [];
  try {
    products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    console.error("[admin products] DB unavailable");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold">Products & packages</h1>
        <p className="mt-1 text-sm text-muted-foreground">Create and manage the store catalogue.</p>
      </div>
      <ProductManager products={products} />
    </div>
  );
}