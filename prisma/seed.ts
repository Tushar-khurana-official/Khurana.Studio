import "dotenv/config";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@khuranastudio.com";
  const passwordHash = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Studio Admin",
      email: adminEmail,
      passwordHash,
      role: "ADMIN",
    },
  });
  console.log(`✔ Admin: ${adminEmail}`);

  // Cloudinary demo public_ids verified to resolve on this account's cloud.
  const products = [
    {
      name: "Wedding Cinematography — Full Day",
      slug: "wedding-full-day",
      description:
        "Complete wedding day coverage with two cinematographers, cinematic edit, drone shots and 4K delivery.",
      price: 150000,
      type: "SERVICE",
      images: ["samples/two-ladies"],
      features: ["Full day coverage", "2 cinematographers", "4K cinematic edit", "Drone aerial shots", "Teaser within 48h"],
    },
    {
      name: "Pre-Wedding Shoot — Destination",
      slug: "pre-wedding-destination",
      description:
        "A curated destination pre-wedding shoot with art direction, styling assistance and 40 retouched photos.",
      price: 80000,
      type: "SERVICE",
      images: ["samples/landscapes/nature-mountains"],
      features: ["Destination travel included", "Art direction", "40 retouched images", "Behind-the-scenes film"],
    },
    {
      name: "Studio Portrait Session",
      slug: "studio-portrait-session",
      description: "One-hour premium studio portrait session with 10 high-resolution retouched images.",
      price: 15000,
      type: "SERVICE",
      images: ["samples/man-portrait"],
      features: ["1 hour session", "Studio + 2 looks", "10 retouched images", "Online gallery"],
    },
    {
      name: "Framed Print — Museum Grade",
      slug: "framed-print-museum-grade",
      description: "Your favourite photograph printed on archival paper and framed in a hand-finished timber frame.",
      price: 6500,
      type: "PHYSICAL",
      images: ["samples/cup-on-a-table"],
      features: ["24×18 archival print", "Hand-finished timber frame", "Glass-front protection", "Free shipping in India"],
      stock: 25,
    },
    {
      name: "Fine Art Photo Book (10×10)",
      slug: "fine-art-photo-book",
      description: "A 40-page lay-flat fine art album of your session, printed on museum-grade paper.",
      price: 12000,
      type: "PHYSICAL",
      images: ["samples/coffee"],
      features: ["40 lay-flat pages", "Museum-grade paper", "Custom cover design", "Free shipping in India"],
      stock: 15,
    },
    {
      name: "Digital Download — Full Gallery",
      slug: "digital-gallery-download",
      description: "All retouched images from your shoot in high resolution with a worldwide commercial license.",
      price: 9000,
      type: "DIGITAL",
      images: ["samples/people/boy-snow-hoodie"],
      features: ["All retouched images", "6000px long edge", "Personal + commercial license", "Instant delivery"],
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: { images: p.images },
      create: p as never,
    });
  }
  console.log(`✔ ${products.length} products`);

  const portfolioImages = [
    { publicId: "samples/man-portrait", title: "Signature Studio Portrait", category: "PORTRAIT", featured: true, sortOrder: -1 },
    { publicId: "samples/woman-on-a-football-field", title: "Field Notes", category: "PORTRAIT", featured: true, sortOrder: 0 },
    { publicId: "samples/balloons", title: "Colour Study", category: "EVENT", featured: true, sortOrder: 1 },
    { publicId: "samples/landscapes/nature-mountains", title: "The Himalayas", category: "PREWEDDING", featured: true, sortOrder: 2 },
    { publicId: "samples/food/spices", title: "Spice Market", category: "EVENT", featured: true, sortOrder: 3 },
    { publicId: "samples/animals/cat", title: "Whiskers", category: "PORTRAIT", featured: true, sortOrder: 4 },
    { publicId: "samples/bike", title: "Vintage Ride", category: "PREWEDDING", featured: true, sortOrder: 5 },
    { publicId: "samples/dessert-on-a-plate", title: "Sugar & Spice", category: "PRODUCT", featured: false, sortOrder: 6 },
    { publicId: "samples/people/smiling-man", title: "Golden Hour", category: "PORTRAIT", featured: false, sortOrder: 7 },
  ];

  for (const img of portfolioImages) {
    await prisma.portfolioImage.upsert({
      where: { publicId: img.publicId },
      update: {},
      create: {
        publicId: img.publicId,
        secureUrl: `https://res.cloudinary.com/tb1nl8kt/image/upload/${img.publicId}`,
        title: img.title,
        category: img.category as "WEDDING" | "PREWEDDING" | "PORTRAIT" | "EVENT" | "PRODUCT" | "OTHER",
        featured: img.featured,
        sortOrder: img.sortOrder,
      },
    });
  }
  console.log(`✔ ${portfolioImages.length} portfolio images`);

  const testimonials = [
    {
      name: "Ananya & Rohit",
      role: "Wedding Clients",
      text: "Khurana Studio captured our wedding like a movie. Every frame is a memory we'll treasure forever.",
      rating: 5,
    },
    {
      name: "Sameer Malhotra",
      role: "Corporate Event",
      text: "Professional, punctual and incredibly talented. The event shots looked better than the film we made.",
      rating: 5,
    },
    {
      name: "Priya Sharma",
      role: "Portrait Client",
      text: "The studio portrait session felt effortless and the retouching is pure art. Highly recommended.",
      rating: 5,
    },
  ];

  for (const t of testimonials) {
    const existing = await prisma.testimonial.findFirst({ where: { name: t.name } });
    if (!existing) {
      await prisma.testimonial.create({ data: t });
    }
  }
  console.log(`✔ ${testimonials.length} testimonials`);

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());