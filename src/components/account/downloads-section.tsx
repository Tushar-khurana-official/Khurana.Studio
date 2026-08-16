"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface DigitalProduct {
  id: string;
  name: string;
  images: string[];
}

export function DownloadsSection({ products }: { products: DigitalProduct[] }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  if (!products.length) {
    return (
      <p className="text-sm text-muted-foreground">
        Purchased digital products will appear here for download.
      </p>
    );
  }

  const download = async (product: DigitalProduct) => {
    setBusy(product.id);
    setError("");
    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId: product.images[0] }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not generate download link");
      window.open(data.url, "_blank", "noopener");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div>
      <ul className="space-y-3">
        {products.map((p) => (
          <li key={p.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
            <div>
              <p className="font-medium">{p.name}</p>
              <p className="text-xs text-muted-foreground">High-resolution · signed download link</p>
            </div>
            <Button size="sm" onClick={() => download(p)} disabled={busy === p.id}>
              {busy === p.id ? "Generating…" : "Download"}
            </Button>
          </li>
        ))}
      </ul>
      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
    </div>
  );
}