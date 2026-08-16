import { prisma } from "@/lib/prisma";
import { BookingsTable } from "@/components/admin/bookings-table";

export default async function AdminBookingsPage() {
  let bookings: Awaited<ReturnType<typeof prisma.booking.findMany>> = [];
  try {
    bookings = await prisma.booking.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  } catch {
    console.error("[admin bookings] DB unavailable");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold">Bookings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage session bookings and deposit status. Sync with Google Calendar from your automation
          project using the booking id shown below.
        </p>
      </div>
      {bookings.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
          No bookings yet.
        </p>
      ) : (
        <BookingsTable bookings={bookings as never} />
      )}
    </div>
  );
}