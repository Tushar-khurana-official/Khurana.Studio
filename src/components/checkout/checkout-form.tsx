"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/lib/cart-store";
import { loadRazorpay } from "@/lib/razorpay-client";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/utils";

interface CheckoutFormProps {
  prefill?: { name?: string; email?: string; phone?: string } | null;
}

export function CheckoutForm({ prefill }: CheckoutFormProps) {
  const { data: session } = useSession();
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const subtotal = useCartStore((s) => s.subtotal());
  const router = useRouter();

  const [form, setForm] = useState({
    name: prefill?.name ?? session?.user?.name ?? "",
    email: prefill?.email ?? session?.user?.email ?? "",
    phone: prefill?.phone ?? "",
    shippingAddress: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [status, setStatus] = useState<"idle" | "processing" | "error">("idle");
  const [error, setError] = useState("");

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!items.length) return;
    setStatus("processing");
    setError("");

    try {
      const checkoutRes = await fetch("/api/orders/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
          customer: form,
        }),
      });
      const checkoutData = await checkoutRes.json();
      if (!checkoutRes.ok) throw new Error(checkoutData.error ?? "Checkout failed");

      const Razorpay = await loadRazorpay();
      const rzp = new Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: checkoutData.amount,
        currency: checkoutData.currency,
        name: "Khurana Studio",
        description: "Photography order",
        order_id: checkoutData.razorpayOrderId,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: "#c9a227" },
        handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          const verifyRes = await fetch("/api/orders/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: checkoutData.orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          if (!verifyRes.ok) throw new Error(verifyData.error ?? "Could not verify payment");
          clear();
          router.push(`/order-success?order=${checkoutData.orderId}`);
        },
        modal: {
          ondismiss: () => setStatus("idle"),
        },
      });
      rzp.on("payment.failed", () => {
        setStatus("idle");
        setError("Payment failed. You can retry.");
      });
      rzp.open();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  const inputClass =
    "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-gold";

  return (
    <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-[1fr_340px]">
      <div className="space-y-6">
        <fieldset className="rounded-2xl border border-border bg-card p-6">
          <legend className="px-2 font-display text-lg font-semibold">Contact details</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1.5 block text-muted-foreground">Full name *</span>
              <input required value={form.name} onChange={set("name")} className={inputClass} />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block text-muted-foreground">Email *</span>
              <input required type="email" value={form.email} onChange={set("email")} className={inputClass} />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="mb-1.5 block text-muted-foreground">Phone (for WhatsApp confirmation)</span>
              <input type="tel" value={form.phone} onChange={set("phone")} className={inputClass} />
            </label>
          </div>
        </fieldset>

        <fieldset className="rounded-2xl border border-border bg-card p-6">
          <legend className="px-2 font-display text-lg font-semibold">Delivery address</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm sm:col-span-2">
              <span className="mb-1.5 block text-muted-foreground">Address</span>
              <textarea rows={2} value={form.shippingAddress} onChange={set("shippingAddress")} className={inputClass} />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block text-muted-foreground">City</span>
              <input value={form.city} onChange={set("city")} className={inputClass} />
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="block text-sm">
                <span className="mb-1.5 block text-muted-foreground">State</span>
                <input value={form.state} onChange={set("state")} className={inputClass} />
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block text-muted-foreground">Pincode</span>
                <input value={form.pincode} onChange={set("pincode")} className={inputClass} />
              </label>
            </div>
          </div>
        </fieldset>
      </div>

      <aside className="h-fit rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-24">
        <h2 className="font-display text-xl font-semibold">Summary</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {items.map((i) => (
            <li key={i.id} className="flex justify-between gap-3">
              <span className="text-muted-foreground">
                {i.quantity} × {i.name}
              </span>
              <span>{formatINR(i.price * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-border pt-3 font-semibold">
          <span>Total</span>
          <span>{formatINR(subtotal)}</span>
        </div>
        {error && (
          <p role="alert" className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500">
            {error}
          </p>
        )}
        <Button type="submit" size="lg" className="mt-6 w-full" disabled={status === "processing" || !items.length}>
          {status === "processing" ? "Redirecting to payment…" : `Pay ${formatINR(subtotal)}`}
        </Button>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Payments securely processed by <span className="font-medium">Razorpay</span> · UPI, cards & netbanking
        </p>
      </aside>
    </form>
  );
}