import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { z } from "zod";

export const dynamic = "force-dynamic";

const patchSchema = z.object({
  id: z.string().min(1),
  read: z.boolean(),
});

export async function PATCH(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  try {
    const message = await prisma.contactMessage.update({
      where: { id: parsed.data.id },
      data: { read: parsed.data.read },
    });
    return NextResponse.json({ message });
  } catch {
    return NextResponse.json({ error: "Message not found" }, { status: 404 });
  }
}