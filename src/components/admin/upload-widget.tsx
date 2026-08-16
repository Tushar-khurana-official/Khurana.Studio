"use client";

import { CldUploadWidget, type CloudinaryUploadWidgetResults } from "next-cloudinary";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const categories = ["WEDDING", "PREWEDDING", "PORTRAIT", "EVENT", "PRODUCT", "OTHER"];

export function UploadWidget() {
  const router = useRouter();
  const [category, setCategory] = useState("PORTRAIT");
  const [title, setTitle] = useState("");
  const [featured, setFeatured] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (results: CloudinaryUploadWidgetResults) => {
    const info = results.info;
    if (!info || typeof info === "string") return;
    const publicId = info.public_id;

    try {
      const res = await fetch("/api/upload/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicId,
          secureUrl: info.secure_url,
          width: info.width,
          height: info.height,
          title: title || undefined,
          category,
          featured,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not save image");
      setTitle("");
      setError("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save image");
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h2 className="font-display text-xl font-semibold">Upload to portfolio</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Uploads go straight to Cloudinary — the app server never stores the file.
      </p>

      <div className="mt-5 space-y-4">
        <label className="block text-sm">
          <span className="mb-1.5 block text-muted-foreground">Title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Meera & Arjun · Wedding"
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-gold"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block text-muted-foreground">Category</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-gold"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="h-4 w-4 accent-[var(--gold)]"
          />
          Feature on home page
        </label>

        {error && (
          <p role="alert" className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500">
            {error}
          </p>
        )}

        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
          options={{ folder: "khurana-studio", sources: ["local", "url", "camera"] }}
          onSuccess={handleUpload}
        >
          {({ open }) => (
            <Button type="button" onClick={() => open()} size="lg">
              Upload images
            </Button>
          )}
        </CldUploadWidget>
        <p className="text-xs text-muted-foreground">
          Need a signed upload? Use{" "}
          <code className="rounded bg-muted px-1.5 py-0.5">POST /api/upload/sign</code> and the
          direct-to-Cloudinary API from a custom admin flow.
        </p>
      </div>
    </div>
  );
}