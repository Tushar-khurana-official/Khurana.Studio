import { env } from "@/lib/env";

export function JsonLd() {
  const base = env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${base}/#business`,
    name: "Khurana Studio",
    description:
      "Premium photography studio crafting cinematic weddings, portraits, events and product photography.",
    url: base,
    image: `${base}/icon.svg`,
    priceRange: "₹₹₹",
    telephone: process.env.WHATSAPP_NUMBER ?? "",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Chandigarh",
      addressCountry: "IN",
    },
    openingHours: "Mo-Sa 10:00-18:00",
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}