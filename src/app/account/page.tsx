import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Section } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";
import { DownloadsSection } from "@/components/account/downloads-section";
import { SignOutButton } from "@/components/account/sign-out-button";
import { formatINR, initials } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "My Account", robots: { index: false } };

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-500/15 text-amber-500",
  PAID: "bg-emerald-500/15 text-emerald-500",
  COMPLETED: "bg-emerald-500/15 text-emerald-500",
  CANCELLED: "bg-red-500/15 text-red-500",
  REFUNDED: "bg-muted-foreground/15 text-muted-foreground",
  DEPOSIT_PAID: "bg-amber-500/15 text-amber-500",
  CONFIRMED: "bg-emerald-500/15 text-emerald-500",
};

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const [orders, bookings, digitalProducts] = await Promise.all([
    prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: { items: true },
    }),
    prisma.booking.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.findMany({
      where: {
        userId: session.user.id,
        status: "PAID",
        items: { some: { type: "DIGITAL" } },
      },
      select: {
        items: { where: { type: "DIGITAL" }, select: { productId: true } },
      },
    }),
  ]);

  const digitalIds = [...new Set(digitalProducts.flatMap((o) => o.items.map((i) => i.productId)))]
    .filter(Boolean) as string[];
  const purchased = digitalIds.length
    ? await prisma.product.findMany({
        where: { id: { in: digitalIds }, type: "DIGITAL", active: true },
        select: { id: true, name: true, images: true },
      })
    : [];

  return (
    <Section className="pt-28">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-muted font-display text-lg font-semibold">
            {session.user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={session.user.image} alt="" className="h-full w-full rounded-full object-cover" />
            ) : (
              initials(session.user.name ?? "U")
            )}
          </span>
          <div>
            <h1 className="font-display text-3xl font-semibold">{session.user.name}</h1>
            <p className="text-sm text-muted-foreground">{session.user.email}</p>
          </div>
        </div>
        <div className="flex gap-3">
          {session.user.role === "ADMIN" && (
            <ButtonLink href="/admin" variant="outline">
              Admin dashboard
            </ButtonLink>
          )}
          <SignOutButton className="self-center" />
        </div>
      </div>

      {/* Downloads */}
      <section className="mb-12">
        <h2 className="mb-4 font-display text-2xl font-semibold">Digital downloads</h2>
        <DownloadsSection products={purchased} />
      </section>

      {/* Orders */}
      <section className="mb-12">
        <h2 className="mb-4 font-display text-2xl font-semibold">Orders</h2>
        {orders.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
            No orders yet.{" "}
            <ButtonLink href="/shop" variant="ghost" className="px-0 text-gold">
              Browse the store →
            </ButtonLink>
          </p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">Order #{order.id.slice(-8)}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[order.status]}`}>
                      {order.status}
                    </span>
                    <span className="font-semibold">{formatINR(order.total)}</span>
                  </div>
                </div>
                <ul className="mt-4 space-y-1 border-t border-border pt-3 text-sm text-muted-foreground">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex justify-between">
                      <span>
                        {item.quantity} × {item.productName}
                      </span>
                      <span>{formatINR(item.price * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Bookings */}
      <section>
        <h2 className="mb-4 font-display text-2xl font-semibold">Bookings</h2>
        {bookings.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
            No bookings yet.{" "}
            <ButtonLink href="/booking" variant="ghost" className="px-0 text-gold">
              Book a session →
            </ButtonLink>
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {bookings.map((booking) => (
              <div key={booking.id} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium capitalize">{booking.service} session</p>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[booking.status]}`}>
                    {booking.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {new Date(booking.date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}{" "}
                  · {booking.timeSlot}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Deposit: {formatINR(booking.depositAmount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </Section>
  );
}