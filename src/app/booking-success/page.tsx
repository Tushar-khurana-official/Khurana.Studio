import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = { title: "Booking Confirmed", robots: { index: false } };

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

  return (
    <Section className="flex min-h-[60vh] flex-col items-center justify-center py-28 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-gold text-gold">
        <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="font-display text-4xl font-semibold">Your session is booked!</h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        {id ? (
          <>
            Booking <span className="font-medium text-foreground">#{id}</span> is confirmed. A
            calendar invite and confirmation are on their way — we'll see you in front of the lens.
          </>
        ) : (
          "Your booking is confirmed. A calendar invite and confirmation are on their way."
        )}
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-4">
        <ButtonLink href="/account">View your bookings</ButtonLink>
        <ButtonLink href="/portfolio" variant="outline">
          Explore the portfolio
        </ButtonLink>
      </div>
    </Section>
  );
}