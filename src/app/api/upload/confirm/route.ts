import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { z } from "zod";

export const dynamic = "force-dynamic";

const confirmSchema = z.object({
  publicId: z.string().min(1),
  secureUrl: z.string().url(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  title: z.string().max(200).optional(),
  category: z.enum(["WEDDING", "PREWEDDING", "PORTRAIT", "EVENT", "PRODUCT", "OTHER"]).default("OTHER"),
  tags: z.array(z.string().max(40)).max(20).default([]),
  featured: z.boolean().default(false),
});

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = confirmSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const image = await prisma.portfolioImage.create({
      data: parsed.data,
      select: { id: true, publicId: true, title: true, category: true },
    });
    return NextResponse.json({ image }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to save image" }, { status: 500 });
  }
}