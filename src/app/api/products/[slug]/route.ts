import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { productSelect } from "@/lib/query";
import { z } from "zod";

export const dynamic = "force-dynamic";

const paramsSchema = z.object({ slug: z.string().min(1) });

export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = paramsSchema.parse(await ctx.params);
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      select: { ...productSelect, reviews: { select: { id: true, rating: true, text: true, createdAt: true, user: { select: { name: true } } }, orderBy: { createdAt: "desc" } } },
    });
    if (!product || !product.active) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ product });
  } catch {
    return NextResponse.json({ error: "Failed to load product" }, { status: 500 });
  }
}