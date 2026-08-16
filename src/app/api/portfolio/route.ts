import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";

const querySchema = z.object({
  category: z.string().optional(),
  featured: z.string().optional(),
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = querySchema.safeParse({
    category: url.searchParams.get("category") ?? undefined,
    featured: url.searchParams.get("featured") ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query" }, { status: 400 });
  }

  try {
    const where = {
      ...(parsed.data.category ? { category: parsed.data.category as never } : {}),
      ...(parsed.data.featured === "true" ? { featured: true } : {}),
    };

    const images = await prisma.portfolioImage.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        publicId: true,
        secureUrl: true,
        width: true,
        height: true,
        title: true,
        category: true,
        featured: true,
      },
    });

    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ error: "Failed to load portfolio" }, { status: 500 });
  }
}