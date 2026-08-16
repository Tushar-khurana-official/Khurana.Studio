"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/utils";

const inputClass =
  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-gold";

const types = ["SERVICE", "PHYSICAL", "DIGITAL"];

export function ProductManager({
  products,
}: {
  products: {
    id: string;
    name: string;
    slug: string;
    price: number;
    type: string;
    active: boolean;
    stock?: number | null;
    images: string[];
  }[];
}) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    compareAt: "",
    type: "SERVICE",
    images: "",
    features: "",
    stock: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: Math.round(parseFloat(form.price) * 100),
          compareAt: form.compareAt ? Math.round(parseFloat(form.compareAt) * 100) : undefined,
          type: form.type,
          images: form.images
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          features: form.features.split("\n").filter(Boolean),
          stock: form.stock ? parseInt(form.stock, 10) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create product");
      setShowForm(false);
      setForm({ name: "", description: "", price: "", compareAt: "", type: "SERVICE", images: "", features: "", stock: "" });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const toggleActive = async (id: string, active: boolean) => {
    const res = await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    if (res.ok) router.refresh();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this product permanently?")) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  };

  return (
    <div className="space-y-8">
      {!showForm ? (
        <Button onClick={() => setShowForm(true)}>+ New product</Button>
      ) : (
        <form onSubmit={submit} className="space-y-4 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-xl font-semibold">New product / package</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1.5 block text-muted-foreground">Name *</span>
              <input required value={form.name} onChange={set("name")} className={inputClass} />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block text-muted-foreground">Type *</span>
              <select value={form.type} onChange={set("type")} className={inputClass}>
                {types.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="block text-sm">
            <span className="mb-1.5 block text-muted-foreground">Description *</span>
            <textarea required rows={3} value={form.description} onChange={set("description")} className={inputClass} />
          </label>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block text-sm">
              <span className="mb-1.5 block text-muted-foreground">Price (₹) *</span>
              <input required type="number" min="1" value={form.price} onChange={set("price")} className={inputClass} />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block text-muted-foreground">Compare-at (₹)</span>
              <input type="number" min="1" value={form.compareAt} onChange={set("compareAt")} className={inputClass} />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block text-muted-foreground">Stock (optional)</span>
              <input type="number" min="0" value={form.stock} onChange={set("stock")} className={inputClass} />
            </label>
          </div>
          <label className="block text-sm">
            <span className="mb-1.5 block text-muted-foreground">
              Cloudinary image public_ids <span className="text-muted-foreground/60">(comma-separated)</span>
            </span>
            <input value={form.images} onChange={set("images")} placeholder="khurana-studio/portrait-session" className={inputClass} />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block text-muted-foreground">Features (one per line)</span>
            <textarea rows={3} value={form.features} onChange={set("features")} className={inputClass} />
          </label>
          {error && (
            <p role="alert" className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500">
              {error}
            </p>
          )}
          <div className="flex gap-3">
            <Button type="submit" disabled={busy}>
              {busy ? "Creating…" : "Create product"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3">
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">/{p.slug}</p>
                </td>
                <td className="px-4 py-3">{p.type}</td>
                <td className="px-4 py-3 font-medium">{formatINR(p.price)}</td>
                <td className="px-4 py-3">{p.stock ?? "—"}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => toggleActive(p.id, p.active)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                      p.active ? "bg-emerald-500/15 text-emerald-500" : "bg-muted-foreground/15 text-muted-foreground"
                    }`}
                  >
                    {p.active ? "Active" : "Hidden"}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button type="button" onClick={() => remove(p.id)} className="text-xs text-muted-foreground transition hover:text-red-500">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}