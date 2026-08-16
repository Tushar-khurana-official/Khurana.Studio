import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/ui/section";
import { Gallery } from "@/components/portfolio/gallery";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Explore Khurana Studio's weddings, pre-weddings, portraits, events and product photography.",
};

export default async function PortfolioPage() {
  let images: Awaited<ReturnType<typeof prisma.portfolioImage.findMany>> = [];
  try {
    images = await prisma.portfolioImage.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
  } catch {
    console.error("[portfolio] DB unavailable");
  }

  return (
    <>
      <section className="pt-28">
        <Section>
          <SectionHeading
            eyebrow="Portfolio"
            title="The work speaks softly"
            description="Frames from recent shoots across weddings, pre-weddings, portraits, events and products. Tap any image to view it in full detail."
          />
          <Gallery images={images} />
        </Section>
      </section>
    </>
  );
}