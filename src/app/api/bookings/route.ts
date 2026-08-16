import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRazorpay } from "@/lib/razorpay";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";
import { addDays, format } from "date-fns";

export const dynamic = "force-dynamic";

export const SERVICE_HOURS = Array.from({ length: 9 }, (_, i) => `${String(9 + i).padStart(2, "0")}:00`);
const SLOTS_PER_DAY = 4;

/** Deposit (INR paise) required per service type to lock the date. */
export const SERVICE_DEPOSITS: Record<string, number> = {
  wedding: 50000,
  prewedding: 25000,
  portrait: 5000,
  event: 25000,
  product: 5000,
};

const getSlotsSchema = z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) });

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = getSlotsSchema.safeParse({ date: url.searchParams.get("date") ?? "" });
  if (!parsed.success) return NextResponse.json({ error: "Invalid date" }, { status: 400 });

  const date = new Date(parsed.data.date + "T00:00:00");
  if (Number.isNaN(date.getTime())) return NextResponse.json({ error: "Invalid date" }, { status: 400 });

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        date,
        status: { not: "CANCELLED" },
      },
      select: { timeSlot: true },
    });
    const taken = new Set(bookings.map((b) => b.timeSlot));
    const start = new Date(date);
    const end = addDays(date, SLOTS_PER_DAY);
    const slots = SERVICE_HOURS.filter((slot) => !taken.has(slot)).map((slot) => ({
      time: slot,
      available: true,
      date: format(date, "yyyy-MM-dd"),
    }));
    return NextResponse.json({ date: parsed.data.date, from: format(start, "yyyy-MM-dd"), to: format(end, "yyyy-MM-dd"), slots });
  } catch {
    return NextResponse.json({ error: "Failed to load slots" }, { status: 500 });
  }
}

const bookingSchema = z.object({
  service: z.enum(["wedding", "prewedding", "portrait", "event", "product"]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  timeSlot: z.enum(SERVICE_HOURS as [string, ...string[]]),
  customerName: z.string().min(2).max(80),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(7).max(20),
  notes: z.string().max(1000).optional(),
});

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limited = rateLimit(`booking:${ip}`, 5, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many booking attempts" }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid booking data", details: parsed.error.flatten() }, { status: 400 });
  }

  const date = new Date(parsed.data.date + "T00:00:00");
  const deposit = SERVICE_DEPOSITS[parsed.data.service] ?? 5000;

  try {
    const existing = await prisma.booking.findFirst({
      where: { date, timeSlot: parsed.data.timeSlot, status: { not: "CANCELLED" } },
    });
    if (existing) {
      return NextResponse.json({ error: "That slot was just booked. Please pick another." }, { status: 409 });
    }

    const session = await getServerSession(authOptions);
    const rzpOrder = await getRazorpay().orders.create({
      amount: deposit,
      currency: "INR",
      receipt: `booking_${Date.now()}`,
      notes: { service: parsed.data.service, date: parsed.data.date, timeSlot: parsed.data.timeSlot },
    });

    const booking = await prisma.booking.create({
      data: {
        userId: session?.user?.id ?? null,
        customerName: parsed.data.customerName,
        customerEmail: parsed.data.customerEmail,
        customerPhone: parsed.data.customerPhone,
        service: parsed.data.service,
        date,
        timeSlot: parsed.data.timeSlot,
        notes: parsed.data.notes,
        status: "PENDING",
        depositAmount: deposit,
        depositOrderId: rzpOrder.id,
      },
    });

    return NextResponse.json({
      bookingId: booking.id,
      razorpayOrderId: rzpOrder.id,
      amount: deposit,
      currency: "INR",
    });
  } catch (err) {
    console.error("[booking]", err);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}