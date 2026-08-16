import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/ui/section";
import { BookingForm } from "@/components/booking/booking-form";

export const metadata: Metadata = {
  title: "Book a Session",
  description:
    "Reserve your wedding, pre-wedding, portrait, event or product shoot with Khurana Studio. Pick a date, choose a slot and secure it with a small deposit.",
};

export default function BookingPage() {
  return (
    <section className="pt-28">
      <Section>
        <SectionHeading
          eyebrow="Book a Session"
          title="Let's lock in a date"
          description="Choose your service, pick an available slot and secure it instantly with a small deposit. The rest is up to the light."
          align="center"
        />
        <BookingForm />
      </Section>
    </section>
  );
}