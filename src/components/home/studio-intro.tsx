import { Section, SectionHeading } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";
import { StudioImage } from "@/components/ui/studio-image";
import { StaggerGroup, StaggerItem } from "@/components/ui/reveal";

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

interface StudioPortrait {
  publicId?: string | null;
  title?: string | null;
}

export function StudioIntro({ portrait }: { portrait?: StudioPortrait | null }) {
  const hasPortrait = Boolean(portrait?.publicId);

  return (
    <Section className="py-24">
      <StaggerGroup className="grid gap-14 lg:grid-cols-2 lg:items-center" stagger={0.12}>
        <StaggerItem>
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
        </StaggerItem>

        <StaggerItem>
          <div className="relative">
          <div className="overflow-hidden rounded-3xl border border-border shadow-2xl shadow-black/20 dark:shadow-black/40">
            <div className="relative aspect-[4/5] w-full bg-muted">
              {hasPortrait ? (
                <StudioImage
                  publicId={portrait?.publicId}
                  alt={portrait?.title ?? "Signature studio portrait"}
                  width={800}
                  height={1000}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  fill
                  className="rounded-none"
                />
              ) : (
                <div
                  role="img"
                  aria-label="Signature studio portrait"
                  className="flex h-full w-full flex-col items-center justify-center gap-4 px-8 text-center"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border border-accent/40 bg-accent/5 text-accent-bright">
                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 8.5A1.5 1.5 0 0 1 4.5 7H7l1.5-2h7L17 7h2.5A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5v-9z"
                      />
                      <circle cx="12" cy="13" r="3.25" />
                    </svg>
                  </span>
                  <p className="font-display text-sm text-muted-foreground">
                    A signature studio portrait will live here — upload one from the admin portfolio.
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="absolute -bottom-6 -left-6 rounded-2xl border border-gold/40 bg-card px-6 py-4 shadow-xl">
            <p className="font-display text-2xl font-semibold gold-gradient-text">Est. 2014</p>
            <p className="text-xs text-muted-foreground">Chandigarh · Available worldwide</p>
          </div>
        </div>
        </StaggerItem>
      </StaggerGroup>
    </Section>
  );
}