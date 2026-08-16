import { Section } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Section className="flex min-h-[70vh] flex-col items-center justify-center py-28 text-center">
      <p className="font-display text-7xl font-semibold gold-gradient-text">404</p>
      <h1 className="mt-4 font-display text-3xl font-semibold">This frame doesn't exist</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        The page you're looking for may have moved or never existed. Let's get you back to the good
        light.
      </p>
      <div className="mt-8 flex gap-4">
        <ButtonLink href="/">Back home</ButtonLink>
        <ButtonLink href="/portfolio" variant="outline">
          View portfolio
        </ButtonLink>
      </div>
    </Section>
  );
}