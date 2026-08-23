import { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { FeaturedCarousel } from "@/components/home/featured-carousel";
import { Stats } from "@/components/home/stats";
import { TrustStrip } from "@/components/home/trust-strip";
import { StudioIntro } from "@/components/home/studio-intro";
import { Testimonials } from "@/components/home/testimonials";
import { Cta } from "@/components/home/cta";
import { JsonLd } from "@/components/seo/jsonld";
import { prisma } from "@/lib/prisma";
import type { PortfolioImage } from "@/hooks/use-portfolio";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Premium Photography Studio — Weddings, Portraits & Events",
  description:
    "Khurana Studio crafts cinematic wedding, portrait, event and product photography in India. Book your session or shop prints and packages online.",
};

export default async function HomePage() {
  let featured: PortfolioImage[] = [];
  let testimonials: Awaited<ReturnType<typeof prisma.testimonial.findMany>> = [];
  let studioPortrait: { publicId: string; title: string | null } | null = null;

  try {
    const [images, ts, portrait] = await Promise.all([
      prisma.portfolioImage.findMany({
        where: { featured: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        take: 6,
        select: {
          id: true,
          publicId: true,
          secureUrl: true,
          width: true,
          height: true,
          title: true,
          category: true,
          featured: true,
        },
      }),
      prisma.testimonial.findMany({ where: { active: true }, take: 6 }),
      prisma.portfolioImage.findFirst({
        where: { category: "PORTRAIT", featured: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        select: {
          id: true,
          publicId: true,
          secureUrl: true,
          width: true,
          height: true,
          title: true,
          category: true,
          featured: true,
        },
      }),
    ]);
    featured = images;
    testimonials = ts;
    studioPortrait = portrait;
  } catch (err) {
    console.error("[home] data fetch failed (is the DB connected?)", err);
  }

  return (
    <>
      <JsonLd />
      <Hero images={featured} />
      <FeaturedCarousel images={featured} />
      <Stats />
      <TrustStrip testimonials={testimonials} />
      <StudioIntro portrait={studioPortrait} />
      <Testimonials testimonials={testimonials} />
      <Cta />
    </>
  );
}