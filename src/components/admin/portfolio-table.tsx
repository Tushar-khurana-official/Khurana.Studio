"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StudioImage } from "@/components/ui/studio-image";

export function PortfolioTable({
  images,
}: {
  images: {
    id: string;
    publicId: string;
    title?: string | null;
    category: string;
    featured: boolean;
  }[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  const remove = async (id: string) => {
    if (!confirm("Delete this image from the portfolio?")) return;
    setBusy(id);
    try {
      const res = await fetch("/api/admin/portfolio", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete");
      router.refresh();
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="px-4 py-3">Preview</th>
            <th className="px-4 py-3">Title / public id</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Featured</th>
            <th className="px-4 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {images.map((img) => (
            <tr key={img.id}>
              <td className="px-4 py-2">
                <div className="relative h-14 w-20 overflow-hidden rounded-lg">
                  <StudioImage publicId={img.publicId} alt={img.title ?? "Portfolio"} width={160} height={112} sizes="80px" className="h-full w-full" fill />
                </div>
              </td>
              <td className="px-4 py-2">
                <p className="font-medium">{img.title || "Untitled"}</p>
                <p className="text-xs text-muted-foreground">{img.publicId}</p>
              </td>
              <td className="px-4 py-2">
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">{img.category}</span>
              </td>
              <td className="px-4 py-2">{img.featured ? "★" : "—"}</td>
              <td className="px-4 py-2 text-right">
                <button
                  type="button"
                  onClick={() => remove(img.id)}
                  disabled={busy === img.id}
                  className="text-xs text-muted-foreground transition hover:text-red-500"
                >
                  {busy === img.id ? "…" : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}