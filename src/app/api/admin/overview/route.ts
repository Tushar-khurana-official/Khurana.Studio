import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const [orders, bookings, revenue, recentOrders, lowStock] = await Promise.all([
      prisma.order.count(),
      prisma.booking.count(),
      prisma.order.aggregate({ where: { status: { in: ["PAID", "COMPLETED"] } }, _sum: { total: true } }),
      prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 8, include: { items: true } }),
      prisma.product.count({ where: { stock: { lt: 5 }, active: true } }),
    ]);

    return NextResponse.json({
      stats: {
        orders,
        bookings,
        revenue: revenue._sum.total ?? 0,
        lowStock,
      },
      recentOrders,
    });
  } catch {
    return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 });
  }
}