"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatINR } from "@/lib/utils";

const statuses = ["PENDING", "PAID", "COMPLETED", "CANCELLED", "REFUNDED"];

export function OrdersTable({
  orders,
}: {
  orders: {
    id: string;
    customerName: string;
    customerEmail: string;
    status: string;
    total: number;
    createdAt: string;
    razorpayPaymentId?: string | null;
    items: { id: string; productName: string; quantity: number; price: number }[];
  }[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  const update = async (id: string, status: string) => {
    setBusy(id);
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBusy(null);
    if (res.ok) router.refresh();
  };

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="rounded-2xl border border-border bg-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-medium">
                #{order.id.slice(-8)} · {order.customerName}
              </p>
              <p className="text-xs text-muted-foreground">
                {order.customerEmail} ·{" "}
                {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold">{formatINR(order.total)}</span>
              <select
                value={order.status}
                disabled={busy === order.id}
                onChange={(e) => update(order.id, e.target.value)}
                className="min-h-11 rounded-full border border-border bg-background px-3 text-xs outline-none focus:border-gold"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <ul className="mt-3 space-y-1 border-t border-border pt-3 text-xs text-muted-foreground">
            {order.items.map((item) => (
              <li key={item.id}>
                {item.quantity} × {item.productName} — {formatINR(item.price * item.quantity)}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}