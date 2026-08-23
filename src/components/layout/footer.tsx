import Link from "next/link";
import { Section } from "@/components/ui/section";

const columns = [
  {
    title: "Explore",
    links: [
      { label: "Portfolio", href: "/portfolio" },
      { label: "Shop Prints & Packages", href: "/shop" },
      { label: "Book a Session", href: "/booking" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign in", href: "/login" },
      { label: "Create account", href: "/register" },
      { label: "Your orders", href: "/account" },
      { label: "Cart", href: "/cart" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-muted/30">
      <Section className="py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="font-display text-2xl font-bold tracking-tight">
              Khurana <span className="gold-gradient-text">Studio</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              A premium photography studio crafting cinematic stories — weddings, portraits, events
              and products, shot with obsession and delivered with love.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                {col.title}
              </h3>
              <ul className="space-y-1">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="inline-flex min-h-11 items-center text-sm transition hover:text-gold">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Khurana Studio. All rights reserved.</p>
          <p>Shot with obsession. Delivered with love.</p>
        </div>
      </Section>
    </footer>
  );
}