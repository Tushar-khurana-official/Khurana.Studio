import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRazorpay } from "@/lib/razorpay";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1).max(10),
      })
    )
    .min(1)
    .max(50),
  customer: z.object({
    name: z.string().min(2).max(80),
    email: z.string().email(),
    phone: z.string().min(7).max(20).optional(),
    shippingAddress: z.string().max(500).optional(),
    city: z.string().max(80).optional(),
    state: z.string().max(80).optional(),
    pincode: z.string().max(10).optional(),
  }),
});

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limited = rateLimit(`checkout:${ip}`, 10, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid checkout data", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const productIds = parsed.data.items.map((i) => i.productId);
    const products = await prisma.product.findMany({ where: { id: { in: productIds }, active: true } });
    const byId = new Map(products.map((p) => [p.id, p]));

    let total = 0;
    for (const item of parsed.data.items) {
      const product = byId.get(item.productId);
      if (!product) return NextResponse.json({ error: `Product unavailable: ${item.productId}` }, { status: 400 });
      if (product.stock != null && item.quantity > product.stock) {
        return NextResponse.json({ error: `Not enough stock for ${product.name}` }, { status: 400 });
      }
      total += product.price * item.quantity;
    }

    const session = await getServerSession(authOptions);
    const receipt = `order_${Date.now()}`;
    const rzpOrder = await getRazorpay().orders.create({
      amount: total,
      currency: "INR",
      receipt,
      notes: { source: "khurana-studio" },
    });

    const order = await prisma.order.create({
      data: {
        userId: session?.user?.id ?? null,
        status: "PENDING",
        total,
        razorpayOrderId: rzpOrder.id,
        customerName: parsed.data.customer.name,
        customerEmail: parsed.data.customer.email,
        customerPhone: parsed.data.customer.phone,
        shippingAddress: parsed.data.customer.shippingAddress,
        city: parsed.data.customer.city,
        state: parsed.data.customer.state,
        pincode: parsed.data.customer.pincode,
        items: {
          create: parsed.data.items.map((item) => {
            const product = byId.get(item.productId)!;
            return {
              productId: product.id,
              productName: product.name,
              price: product.price,
              quantity: item.quantity,
              type: product.type,
            };
          }),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({
      orderId: order.id,
      razorpayOrderId: rzpOrder.id,
      amount: total,
      currency: "INR",
    });
  } catch (err) {
    console.error("[checkout]", err);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}