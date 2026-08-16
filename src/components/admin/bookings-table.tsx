"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatINR } from "@/lib/utils";

const statuses = ["PENDING", "DEPOSIT_PAID", "CONFIRMED", "CANCELLED", "COMPLETED"];

export function BookingsTable({
  bookings,
}: {
  bookings: {
    id: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string | null;
    service: string;
    date: string;
    timeSlot: string;
    status: string;
    depositAmount: number;
  }[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  const update = async (id: string, status: string) => {
    setBusy(id);
    const res = await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBusy(null);
    if (res.ok) router.refresh();
  };

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div key={booking.id} className="rounded-2xl border border-border bg-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-medium capitalize">
                {booking.service} · {booking.customerName}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(booking.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })} ·{" "}
                {booking.timeSlot} · {booking.customerEmail}
                {booking.customerPhone ? ` · ${booking.customerPhone}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">{formatINR(booking.depositAmount)}</span>
              <select
                value={booking.status}
                disabled={busy === booking.id}
                onChange={(e) => update(booking.id, e.target.value)}
                className="rounded-full border border-border bg-background px-3 py-1.5 text-xs outline-none focus:border-gold"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}