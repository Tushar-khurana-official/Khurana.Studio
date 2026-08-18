"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isBefore, startOfToday } from "date-fns";
import { cn, formatINR } from "@/lib/utils";
import { useMounted } from "@/hooks/use-mounted";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { loadRazorpay } from "@/lib/razorpay-client";
import { getAccentColor } from "@/lib/accent-color";

const services = [
  { key: "wedding", label: "Wedding", deposit: 50000, hint: "Full day coverage" },
  { key: "prewedding", label: "Pre-wedding", deposit: 25000, hint: "Destination or local" },
  { key: "portrait", label: "Portrait", deposit: 5000, hint: "Studio or outdoor" },
  { key: "event", label: "Event", deposit: 25000, hint: "Corporate & social" },
  { key: "product", label: "Product", deposit: 5000, hint: "E-commerce & brands" },
];

const inputClass =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-gold";

export function BookingForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [service, setService] = useState("wedding");
  const [month, setMonth] = useState<Date | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [timeSlot, setTimeSlot] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [status, setStatus] = useState<"idle" | "processing" | "error">("idle");
  const [error, setError] = useState("");
  const mounted = useMounted();
  const today = startOfToday();
  const currentMonth = month ?? today;

  const serviceMeta = services.find((s) => s.key === service)!;

  const { data: slots, isLoading: slotsLoading, isError: slotsError, refetch: refetchSlots } = useQuery({
    queryKey: ["slots", date],
    queryFn: async () => {
      const res = await fetch(`/api/bookings?date=${date}`);
      if (!res.ok) throw new Error("Failed to load slots");
      const data = (await res.json()) as { slots: { time: string; available: boolean }[] };
      return data.slots;
    },
    enabled: !!date,
  });

  const days = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !timeSlot) return;
    setStatus("processing");
    setError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service,
          date,
          timeSlot,
          customerName: form.name,
          customerEmail: form.email,
          customerPhone: form.phone,
          notes: form.notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not create booking");

      const Razorpay = await loadRazorpay();
      const rzp = new Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Khurana Studio",
        description: `${serviceMeta.label} deposit`,
        order_id: data.razorpayOrderId,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: getAccentColor() },
        handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          const confirmRes = await fetch("/api/bookings/confirm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              bookingId: data.bookingId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            }),
          });
          if (!confirmRes.ok) throw new Error("Could not confirm booking");
          router.push(`/booking-success?id=${data.bookingId}`);
        },
        modal: { ondismiss: () => setStatus("idle") },
      });
      rzp.on("payment.failed", () => {
        setStatus("idle");
        setError("Deposit payment failed. Your slot is reserved until you retry.");
      });
      rzp.open();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl">
      {/* Stepper */}
      <ol className="mb-10 flex items-center gap-2 text-sm">
        {["Service", "Date & Time", "Your details"].map((label, i) => {
          const n = i + 1;
          const done = step > n;
          const active = step === n;
          return (
            <li key={label} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => n < step && setStep(n)}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-3 py-1.5 transition",
                  active ? "border-gold bg-accent text-accent-foreground" : done ? "border-gold/50 text-gold" : "border-border"
                )}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-current/20 text-xs font-bold">
                  {done ? "✓" : n}
                </span>
                {label}
              </button>
              {n < 3 && <span className="h-px w-6 bg-border" />}
            </li>
          );
        })}
      </ol>

      {step === 1 && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">What are we creating together?</p>
          {services.map((s) => (
            <label
              key={s.key}
              className={cn(
                "flex cursor-pointer items-center justify-between rounded-2xl border p-5 transition",
                service === s.key ? "border-gold bg-accent/5" : "border-border hover:border-gold/40"
              )}
            >
              <span>
                <input
                  type="radio"
                  name="service"
                  value={s.key}
                  checked={service === s.key}
                  onChange={() => setService(s.key)}
                  className="sr-only"
                />
                <span className="font-display text-lg font-semibold">{s.label}</span>
                <span className="block text-sm text-muted-foreground">{s.hint}</span>
              </span>
              <span className="text-sm font-medium">{formatINR(s.deposit)} deposit</span>
            </label>
          ))}
          <Button type="button" size="lg" className="mt-6 w-full" onClick={() => setStep(2)}>
            Continue
          </Button>
        </div>
      )}

      {step === 2 && (
        <div>
          {!mounted ? (
            <Skeleton className="h-80 w-full rounded-2xl" />
          ) : (
            <>
              <div className="mb-5 flex items-center justify-between">
                <button
                  type="button"
                  aria-label="Previous month"
                  onClick={() => setMonth(subMonths(currentMonth, 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border hover:border-gold/50"
                >
                  ←
                </button>
                <p className="font-display text-lg font-semibold">{format(currentMonth, "MMMM yyyy")}</p>
                <button
                  type="button"
                  aria-label="Next month"
                  onClick={() => setMonth(addMonths(currentMonth, 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border hover:border-gold/50"
                >
                  →
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                  <div key={d} className="py-1">
                    {d}
                  </div>
                ))}
                {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, i) => (
                  <div key={`pad-${i}`} />
                ))}
                {days.map((day) => {
                  const key = format(day, "yyyy-MM-dd");
                  const disabled = isBefore(day, today);
                  const selected = date === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      disabled={disabled}
                      onClick={() => {
                        setDate(key);
                        setTimeSlot(null);
                      }}
                      className={cn(
                        "aspect-square rounded-lg text-sm transition",
                        disabled
                          ? "cursor-not-allowed text-muted-foreground/30"
                          : selected
                            ? "bg-accent font-semibold text-accent-foreground"
                            : "hover:bg-muted hover:border-gold/40"
                      )}
                    >
                      {format(day, "d")}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {date && (
            <div className="mt-6">
              <p className="mb-3 text-sm font-medium">Available slots for {date}</p>
              {slotsLoading ? (
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-20 rounded-full" />
                  ))}
                </div>
              ) : slotsError ? (
                <div className="rounded-xl border border-dashed border-red-500/40 bg-red-500/5 px-4 py-4 text-center">
                  <p className="text-sm text-red-500">Couldn&apos;t load available slots right now.</p>
                  <button
                    type="button"
                    onClick={() => refetchSlots()}
                    className="mt-2 text-sm font-medium text-gold underline underline-offset-2"
                  >
                    Try again
                  </button>
                </div>
              ) : slots && slots.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {slots.map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      onClick={() => setTimeSlot(slot.time)}
                      className={cn(
                        "rounded-full border px-5 py-2 text-sm transition",
                        timeSlot === slot.time ? "border-gold bg-accent text-accent-foreground" : "border-border hover:border-gold/50"
                      )}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border px-4 py-4 text-center text-sm text-muted-foreground">
                  No slots available for this date, try another day.
                </div>
              )}
              {date && timeSlot && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Selected time: <span className="font-medium text-foreground">{timeSlot}</span>
                </p>
              )}
            </div>
          )}

          <div className="mt-8 flex gap-3">
            <Button type="button" variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button type="button" disabled={!date || !timeSlot} onClick={() => setStep(3)}>
              Continue
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1.5 block text-muted-foreground">Full name *</span>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className={inputClass}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block text-muted-foreground">Email *</span>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className={inputClass}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block text-muted-foreground">Phone (WhatsApp) *</span>
              <input
                required
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className={inputClass}
              />
            </label>
          </div>
          <label className="block text-sm">
            <span className="mb-1.5 block text-muted-foreground">Notes for the shoot</span>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              className={inputClass}
            />
          </label>

          <div className="rounded-2xl border border-border bg-card p-5 text-sm">
            <p className="font-display text-lg font-semibold">Booking summary</p>
            <dl className="mt-3 space-y-2">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Service</dt>
                <dd className="font-medium">{serviceMeta.label}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Date</dt>
                <dd className="font-medium">{date}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Time</dt>
                <dd className="font-medium">{timeSlot}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-2">
                <dt className="text-muted-foreground">Deposit to secure</dt>
                <dd className="font-semibold text-gold">{formatINR(serviceMeta.deposit)}</dd>
              </div>
            </dl>
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500">
              {error}
            </p>
          )}

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button type="submit" size="lg" disabled={status === "processing"}>
              {status === "processing" ? "Processing deposit…" : `Pay deposit ${formatINR(serviceMeta.deposit)}`}
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}