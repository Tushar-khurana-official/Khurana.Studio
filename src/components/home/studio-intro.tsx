import { Section, SectionHeading } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";

const pillars = [
  {
    title: "The Director's Eye",
    body: "Every frame is composed like a still from a film — motivated light, honest emotion and deliberate negative space.",
    icon: "✦",
  },
  {
    title: "Obsessive Post",
    body: "Cinematic colour grading and museum-grade retouching, handled in-house so your images stay unmistakably ours.",
    icon: "◉",
  },
  {
    title: "Relaxed, Directed Posing",
    body: "You won't hear 'say cheese'. We guide gently, shoot candidly and let your real story surface naturally.",
    icon: "◈",
  },
];

export function StudioIntro() {
  return (
    <Section className="py-24">
      <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
        <div>
          <SectionHeading
            eyebrow="The Studio"
            title="Photography as storytelling, not snapshots"
            description="Khurana Studio began with a single borrowed camera and a stubborn belief: that the best photographs are the ones you can feel. Twelve years later, that belief still drives every shoot — from destination weddings to a single product frame."
          />
          <div className="mt-8 space-y-5">
            {pillars.map((p) => (
              <div key={p.title} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold">
                  {p.icon}
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold">{p.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
          <ButtonLink href="/booking" className="mt-9">
            Work with us
          </ButtonLink>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-3xl border border-border shadow-2xl shadow-black/20">
            <div className="aspect-[4/5] w-full bg-muted" aria-hidden>
              <div className="flex h-full items-center justify-center">
                <span className="font-display text-sm italic text-muted-foreground">
                  Signature studio portrait — coming to a screen near you
                </span>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 -left-6 rounded-2xl border border-gold/40 bg-card px-6 py-4 shadow-xl">
            <p className="font-display text-2xl font-semibold gold-gradient-text">Est. 2014</p>
            <p className="text-xs text-muted-foreground">Chandigarh · Available worldwide</p>
          </div>
        </div>
      </div>
    </Section>
  );
}