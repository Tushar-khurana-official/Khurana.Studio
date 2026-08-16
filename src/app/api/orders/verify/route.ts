import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyRazorpaySignature } from "@/lib/razorpay-signature";
import { z } from "zod";
import { sendWhatsApp, orderConfirmationMessage } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

const verifySchema = z.object({
  orderId: z.string().min(1),
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  signature: z.string().min(1),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = verifySchema.safeParse(body);
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

    const order = await prisma.order.findUnique({ where: { id: parsed.data.orderId } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status === "PENDING") {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: "PAID",
          razorpayPaymentId: parsed.data.razorpayPaymentId,
        },
      });
    }

    // Notification hook — reuse WhatsApp automation infra
    if (order.customerPhone) {
      await sendWhatsApp({ to: order.customerPhone, message: orderConfirmationMessage(order) });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}