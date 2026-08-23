import { Section } from "@/components/ui/section";
import { StaggerGroup, StaggerItem } from "@/components/ui/reveal";

const stats = [
  { value: "500+", label: "Shoots Delivered", note: "and counting" },
  { value: "12", label: "Years of Craft", note: "since 2014" },
  { value: "98%", label: "Client Referrals", note: "from happy clients" },
  { value: "4.9★", label: "Average Rating", note: "across 300+ reviews" },
];

export function Stats() {
  return (
    <Section className="py-24">
      <StaggerGroup className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-border lg:grid-cols-4" stagger={0.08}>
        {stats.map((stat) => (
          <StaggerItem key={stat.label} className="bg-card p-8 text-center">
            <p className="font-display text-4xl font-semibold gold-gradient-text sm:text-5xl">
              {stat.value}
            </p>
            <p className="mt-2 text-sm font-medium">{stat.label}</p>
            <p className="mt-1 text-xs text-muted-foreground">{stat.note}</p>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </Section>
  );
}