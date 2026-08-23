import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { StickyCta } from "@/components/layout/sticky-cta";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { ScrollProgress } from "@/components/layout/scroll-progress";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Khurana Studio — Premium Photography & Films",
    template: "%s | Khurana Studio",
  },
  description:
    "Khurana Studio is a premium photography studio crafting cinematic weddings, portraits, events and products. Book your session or shop prints and packages.",
  keywords: [
    "photography studio",
    "wedding photographer",
    "pre-wedding shoot",
    "portrait photography",
    "event photography",
    "product photography",
    "photo prints",
    "Khurana Studio",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Khurana Studio",
  },
  robots: { index: true, follow: true },
  links: [
    {
      rel: "preconnect",
      href: "https://res.cloudinary.com",
    },
    {
      rel: "dns-prefetch",
      href: "https://res.cloudinary.com",
    },
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdfbfb" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0e0c" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const whatsappNumber = process.env.WHATSAPP_NUMBER?.replace(/\D/g, "");
  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi, I'd like to know more about Khurana Studio")}`
    : null;

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <ScrollProgress />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <StickyCta />
          {whatsappHref && <WhatsAppButton href={whatsappHref} />}

          {/* site-wide grain texture overlay */}
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-[55] mix-blend-overlay opacity-[0.04]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
          />
        </Providers>
      </body>
    </html>
  );
}