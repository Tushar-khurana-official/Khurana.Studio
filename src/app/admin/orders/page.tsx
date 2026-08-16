import { prisma } from "@/lib/prisma";
import { OrdersTable } from "@/components/admin/orders-table";

export default async function AdminOrdersPage() {
  let orders: Awaited<ReturnType<typeof prisma.order.findMany>> = [];
  try {
    orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { items: true },
    });
  } catch {
    console.error("[admin orders] DB unavailable");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold">Orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">Review and update order statuses.</p>
      </div>
      {orders.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
          No orders yet.
        </p>
      ) : (
        <OrdersTable orders={orders as never} />
      )}
    </div>
  );
}