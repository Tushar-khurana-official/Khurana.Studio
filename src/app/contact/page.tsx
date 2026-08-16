import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/ui/section";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Khurana Studio for bookings, enquiries and collaborations.",
};

export default function ContactPage() {
  return (
    <Section className="pt-28">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow="Contact"
            title="Let's talk about your shoot"
            description="Tell us what you're dreaming of — a wedding, a portrait series, product frames or a film. We reply within 24 hours."
          />
          <div className="mt-8 space-y-5 text-sm">
            <div className="flex items-center gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 text-gold">✦</span>
              <div>
                <p className="font-medium">Studio</p>
                <p className="text-muted-foreground">Sector 42, Chandigarh, India</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 text-gold">◉</span>
              <div>
                <p className="font-medium">Email</p>
                <p className="text-muted-foreground">hello@khuranastudio.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 text-gold">◈</span>
              <div>
                <p className="font-medium">Availability</p>
                <p className="text-muted-foreground">Mon–Sat · 10:00–18:00 IST</p>
              </div>
            </div>
          </div>
        </div>
        <ContactForm />
      </div>
    </Section>
  );
}