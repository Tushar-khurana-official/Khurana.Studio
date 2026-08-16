import { Section } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";

export function Cta() {
  return (
    <Section className="py-24">
      <div className="relative overflow-hidden rounded-[2rem] border border-gold/30 bg-card px-8 py-16 text-center sm:px-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(70% 90% at 50% 0%, color-mix(in srgb, var(--gold) 14%, transparent), transparent 70%)",
          }}
        />
        <div className="relative">
          <h2 className="mx-auto max-w-2xl font-display text-4xl font-semibold text-balance sm:text-5xl">
            Your story deserves to be <span className="gold-gradient-text">remembered</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
            Dates fill fast — especially in wedding season. Reserve your session today and let's
            craft frames you'll never stop looking at.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <ButtonLink href="/booking" size="lg">
              Book a Session
            </ButtonLink>
            <ButtonLink href="/shop" variant="outline" size="lg">
              Shop Prints & Packages
            </ButtonLink>
          </div>
        </div>
      </div>
    </Section>
  );
}