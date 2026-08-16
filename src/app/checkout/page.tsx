import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/ui/section";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default function CheckoutPage() {
  return (
    <section className="pt-28">
      <Section>
        <SectionHeading eyebrow="Checkout" title="Almost yours" />
        <CheckoutForm />
      </Section>
    </section>
  );
}