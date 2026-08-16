import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const createSchema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().min(5).max(3000),
  price: z.number().int().positive(),
  compareAt: z.number().int().positive().optional(),
  type: z.enum(["PHYSICAL", "DIGITAL", "SERVICE"]).default("SERVICE"),
  images: z.array(z.string().min(1)).max(20).default([]),
  features: z.array(z.string().max(200)).max(30).default([]),
  stock: z.number().int().min(0).nullable().optional(),
  active: z.boolean().default(true),
});

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limited = rateLimit(`admin:${ip}`, 60, 60_000);
  if (!limited.ok) return NextResponse.json({ error: "Rate limited" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid product data", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const slugBase = parsed.data.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    let slug = slugBase;
    let n = 1;
    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${slugBase}-${n++}`;
    }

    const product = await prisma.product.create({ data: { ...parsed.data, slug } });
    return NextResponse.json({ product }, { status: 201 });
  } catch (err) {
    console.error("[admin product]", err);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}