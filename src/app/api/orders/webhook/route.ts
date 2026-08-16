import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyRazorpaySignature } from "@/lib/razorpay-signature";
import { sendWhatsApp, orderConfirmationMessage } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const text = await req.text();
  const signature = req.headers.get("x-razorpay-signature");
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET ?? "";

  if (!signature || !secret) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const valid = verifyRazorpaySignature(text, signature, secret);
  if (!valid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    const event = JSON.parse(text);
    const payload = event.payload;

    if (event.event === "payment.captured") {
      const paymentId = payload.payment?.entity?.id;
      const rzpOrderId = payload.payment?.entity?.order_id;
      if (paymentId && rzpOrderId) {
        const order = await prisma.order.findFirst({ where: { razorpayOrderId: rzpOrderId } });
        if (order && order.status === "PENDING") {
          await prisma.order.update({
            where: { id: order.id },
            data: { status: "PAID", razorpayPaymentId: paymentId },
          });
          if (order.customerPhone) {
            await sendWhatsApp({ to: order.customerPhone, message: orderConfirmationMessage(order) });
          }
        }
      }
    }

    if (event.event === "payment.failed") {
      const rzpOrderId = payload.payment?.entity?.order_id;
      if (rzpOrderId) {
        await prisma.order.updateMany({
          where: { razorpayOrderId: rzpOrderId, status: "PENDING" },
          data: { status: "CANCELLED" },
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}