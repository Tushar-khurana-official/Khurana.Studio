import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { productSelect } from "@/lib/query";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
      select: productSelect,
    });
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }
}