import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyRazorpaySignature } from "@/lib/razorpay-signature";
import { z } from "zod";
import { sendWhatsApp, bookingConfirmationMessage } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

const confirmSchema = z.object({
  bookingId: z.string().min(1),
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  signature: z.string().min(1),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = confirmSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    const valid = verifyRazorpaySignature(
      `${parsed.data.razorpayOrderId}|${parsed.data.razorpayPaymentId}`,
      parsed.data.signature,
      process.env.RAZORPAY_KEY_SECRET ?? ""
    );
    if (!valid) {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({ where: { id: parsed.data.bookingId } });
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.status === "PENDING") {
      await prisma.booking.update({
        where: { id: booking.id },
        data: { status: "CONFIRMED", depositPaymentId: parsed.data.razorpayPaymentId },
      });
    }

    if (booking.customerPhone) {
      await sendWhatsApp({
        to: booking.customerPhone,
        message: bookingConfirmationMessage({ ...booking, date: new Date(booking.date) }),
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}