import { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { FeaturedCarousel } from "@/components/home/featured-carousel";
import { Stats } from "@/components/home/stats";
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

  try {
    const [images, ts] = await Promise.all([
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
    ]);
    featured = images;
    testimonials = ts;
  } catch (err) {
    console.error("[home] data fetch failed (is the DB connected?)", err);
  }

  return (
    <>
      <JsonLd />
      <Hero />
      <FeaturedCarousel images={featured} />
      <Stats />
      <StudioIntro />
      <Testimonials testimonials={testimonials} />
      <Cta />
    </>
  );
}