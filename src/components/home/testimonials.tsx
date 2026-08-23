import { Section, SectionHeading } from "@/components/ui/section";
import { initials } from "@/lib/utils";
import { StaggerGroup, StaggerItem } from "@/components/ui/reveal";

export interface Testimonial {
  id: string;
  name: string;
  role?: string | null;
  text: string;
  rating: number;
}

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const items = testimonials.length ? testimonials : [];
  if (!items.length) return null;

  return (
    <Section className="py-24">
      <SectionHeading
        eyebrow="Kind Words"
        title="What our clients say"
        align="center"
        description="We measure success in the moments our clients relive when they look at their photographs."
      />
      <StaggerGroup className="grid gap-6 md:grid-cols-3" stagger={0.1}>
        {items.map((t) => (
          <StaggerItem key={t.id}>
            <figure className="flex h-full flex-col rounded-2xl border border-border bg-card p-7 transition hover:border-gold/40">
            <div className="mb-4 flex gap-1 text-gold" aria-label={`${t.rating} out of 5 stars`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  viewBox="0 0 20 20"
                  className={`h-4 w-4 ${i < t.rating ? "fill-current" : "fill-muted-foreground/30"}`}
                >
                  <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z" />
                </svg>
              ))}
            </div>
            <blockquote className="flex-1 text-sm leading-relaxed text-muted-foreground">
              “{t.text}”
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                {initials(t.name)}
              </span>
              <div>
                <p className="text-sm font-semibold">{t.name}</p>
                {t.role && <p className="text-xs text-muted-foreground">{t.role}</p>}
              </div>
            </figcaption>
          </figure>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </Section>
  );
}