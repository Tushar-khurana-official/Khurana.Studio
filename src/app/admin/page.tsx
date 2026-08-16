import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";

export default async function AdminOverviewPage() {
  let stats = { orders: 0, bookings: 0, revenue: 0, lowStock: 0 };
  let recentOrders: Awaited<ReturnType<typeof prisma.order.findMany>> = [];

  try {
    const [orders, bookings, revenue, recent] = await Promise.all([
      prisma.order.count(),
      prisma.booking.count(),
      prisma.order.aggregate({ where: { status: { in: ["PAID", "COMPLETED"] } }, _sum: { total: true } }),
      prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 6, include: { items: true } }),
    ]);
    const lowStock = await prisma.product.count({ where: { stock: { lt: 5 }, active: true } });
    stats = { orders, bookings, revenue: revenue._sum.total ?? 0, lowStock };
    recentOrders = recent;
  } catch {
    console.error("[admin overview] DB unavailable");
  }

  const cards = [
    { label: "Total orders", value: String(stats.orders) },
    { label: "Bookings", value: String(stats.bookings) },
    { label: "Revenue (paid)", value: formatINR(stats.revenue) },
    { label: "Low stock items", value: String(stats.lowStock) },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Overview</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        A snapshot of orders, bookings and revenue.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-border bg-card p-6">
            <p className="font-display text-2xl font-semibold sm:text-3xl">{card.value}</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Recent orders</h2>
          <ButtonLink href="/admin/orders" variant="ghost" className="text-gold">
            View all →
          </ButtonLink>
        </div>
        {recentOrders.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
            No orders yet.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-3 font-medium">#{order.id.slice(-8)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{order.customerName}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">{order.status}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">{formatINR(order.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}