import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { signedUrl } from "@/lib/cloudinary";
import { z } from "zod";

export const dynamic = "force-dynamic";

const downloadSchema = z.object({
  publicId: z.string().min(1),
});

/** Issue a signed, expiring Cloudinary URL only if the user purchased this digital product. */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = downloadSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  try {
    const product = await prisma.product.findFirst({
      where: {
        type: "DIGITAL",
        images: { has: parsed.data.publicId },
      },
    });
    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const paid = await prisma.order.findFirst({
      where: {
        userId: session.user.id,
        status: "PAID",
        items: { some: { productId: product.id } },
      },
    });
    if (!paid) {
      return NextResponse.json({ error: "Purchase required" }, { status: 403 });
    }

    const url = signedUrl(parsed.data.publicId, 10, { fl_attachment: "" });
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ error: "Failed to generate link" }, { status: 500 });
  }
}