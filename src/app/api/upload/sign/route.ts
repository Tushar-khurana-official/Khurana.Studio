import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { signedUploadParams } from "@/lib/cloudinary";
import { rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limited = rateLimit(`upload:${ip}`, 30, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Upload rate limit exceeded" }, { status: 429 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const folder = (body.folder as string) || "khurana-studio";
    const params = signedUploadParams(folder);
    return NextResponse.json(params);
  } catch {
    return NextResponse.json({ error: "Failed to sign upload" }, { status: 500 });
  }
}