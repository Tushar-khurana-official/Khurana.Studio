import { prisma } from "@/lib/prisma";
import { UploadWidget } from "@/components/admin/upload-widget";
import { PortfolioTable } from "@/components/admin/portfolio-table";

export default async function AdminPortfolioPage() {
  let images: Awaited<ReturnType<typeof prisma.portfolioImage.findMany>> = [];
  try {
    images = await prisma.portfolioImage.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
  } catch {
    console.error("[admin portfolio] DB unavailable");
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-3xl font-semibold">Portfolio</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload new work and manage existing gallery images.
        </p>
      </div>
      <UploadWidget />
      <div>
        <h2 className="mb-4 font-display text-xl font-semibold">Gallery ({images.length})</h2>
        {images.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
            No images yet — upload your first frame above.
          </p>
        ) : (
          <PortfolioTable images={images} />
        )}
      </div>
    </div>
  );
}