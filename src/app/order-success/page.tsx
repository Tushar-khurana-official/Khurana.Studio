import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = { title: "Order Confirmed", robots: { index: false } };

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;

  return (
    <Section className="flex min-h-[60vh] flex-col items-center justify-center py-28 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-gold text-gold">
        <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="font-display text-4xl font-semibold">Thank you, it's on its way!</h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        {order ? (
          <>
            Your order <span className="font-medium text-foreground">#{order}</span> is confirmed. A
            confirmation has been sent to your email and WhatsApp.
          </>
        ) : (
          "Your order is confirmed. A confirmation has been sent to your email and WhatsApp."
        )}
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-4">
        <ButtonLink href="/account">Track your orders</ButtonLink>
        <ButtonLink href="/portfolio" variant="outline">
          Explore the portfolio
        </ButtonLink>
      </div>
    </Section>
  );
}