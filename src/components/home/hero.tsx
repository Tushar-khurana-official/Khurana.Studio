import { Hero3D } from "@/components/three/hero-3d";
import { ButtonLink } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden pt-16">
      {/* backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 75% 40%, color-mix(in srgb, var(--gold) 12%, transparent), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 items-center gap-8 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:gap-4">
        <div className="flex flex-col items-start">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-muted/40 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-gold">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            Premium Photography Studio
          </p>
          <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-6xl lg:text-7xl">
            Stories, framed <span className="gold-gradient-text">in light.</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
            Weddings, portraits, events and products — shot with cinematic obsession by Khurana
            Studio, and delivered as art you'll keep forever.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <ButtonLink href="/booking" size="lg">
              Book a Session
            </ButtonLink>
            <ButtonLink href="/portfolio" variant="outline" size="lg">
              View Portfolio
            </ButtonLink>
          </div>

          <dl className="mt-12 flex flex-wrap gap-x-12 gap-y-6 sm:gap-x-16">
            {[
              { value: "500+", label: "Shoots Delivered" },
              { value: "12", label: "Years of Craft" },
              { value: "300+", label: "Happy Clients" },
            ].map((stat) => (
              <div key={stat.label} className="min-w-[7rem]">
                <dt className="text-2xl font-semibold sm:text-3xl">{stat.value}</dt>
                <dd className="mt-1.5 text-xs uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto h-[320px] w-full max-w-lg sm:h-[420px] lg:h-[560px]">
          <Hero3D />
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-muted-foreground">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7-7-7M19 5l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}