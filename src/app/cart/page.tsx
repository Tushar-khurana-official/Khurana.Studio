import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/ui/section";
import { CartPage } from "@/components/shop/cart-page";

export const metadata: Metadata = { title: "Your Cart", robots: { index: false } };

export default function CartRoute() {
  return (
    <section className="pt-28">
      <Section>
        <SectionHeading eyebrow="Cart" title="Your cart" />
        <CartPage />
      </Section>
    </section>
  );
}