"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { CartButton } from "@/components/layout/cart-button";
import { SessionStatus } from "@/components/layout/session-status";

const links = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/shop", label: "Shop" },
  { href: "/booking", label: "Book a Session" },
  { href: "/contact", label: "Contact" },
];

const portfolioCategories = [
  { key: "WEDDING", label: "Weddings" },
  { key: "PREWEDDING", label: "Pre-wedding" },
  { key: "PORTRAIT", label: "Portraits" },
  { key: "EVENT", label: "Events" },
  { key: "PRODUCT", label: "Products" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const reduce = useReducedMotion();

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
    setPortfolioOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setPortfolioOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const closeMenu = () => {
    setOpen(false);
    setPortfolioOpen(false);
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "glass border-b border-border" : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="font-display text-xl font-bold tracking-tight">
          Khurana <span className="gold-gradient-text">Studio</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) =>
            link.href === "/portfolio" ? (
              <div key={link.href} className="group relative">
                <Link
                  href="/portfolio"
                  className={cn(
                    "flex min-h-11 items-center gap-1 rounded-full px-4 text-sm font-medium transition-colors duration-200 hover:bg-muted hover:text-accent-bright",
                    pathname === "/portfolio" && "text-accent-bright"
                  )}
                >
                  Portfolio
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3 w-3 transition-transform duration-200 group-hover:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                  </svg>
                </Link>

                <div className="invisible absolute left-0 top-full pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div className="glass min-w-[13rem] rounded-2xl border border-border p-2 shadow-xl">
                    {portfolioCategories.map((cat) => (
                      <Link
                        key={cat.key}
                        href={`/portfolio?category=${cat.key}`}
                        className="flex min-h-11 items-center justify-between rounded-xl px-4 text-sm font-medium transition hover:bg-muted hover:text-accent-bright"
                      >
                        {cat.label}
                        <svg
                          viewBox="0 0 24 24"
                          className="h-3 w-3 text-muted-foreground/60"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex min-h-11 items-center rounded-full px-4 text-sm font-medium transition-colors duration-200 hover:bg-muted hover:text-accent-bright",
                  pathname === link.href && "text-accent-bright"
                )}
              >
                {link.label}
              </Link>
            )
          )}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <CartButton />
          <SessionStatus />
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border md:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              {open ? <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" /> : <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
            className="glass overflow-hidden border-t border-border md:hidden"
          >
            <div className="flex max-h-[calc(100dvh-4rem)] flex-col gap-1 overflow-y-auto px-5 py-4">
              {links.map((link) =>
                link.href === "/portfolio" ? (
                  <div key={link.href} className="flex flex-col">
                    <button
                      type="button"
                      aria-expanded={portfolioOpen}
                      onClick={() => setPortfolioOpen((v) => !v)}
                      className={cn(
                        "flex min-h-11 items-center justify-between gap-2 rounded-lg px-4 text-left text-sm font-medium transition-colors duration-200 hover:bg-muted hover:text-accent-bright",
                        pathname === "/portfolio" && "text-accent-bright"
                      )}
                    >
                      Portfolio
                      <svg
                        viewBox="0 0 24 24"
                        className={cn("h-4 w-4 transition-transform duration-200", portfolioOpen && "rotate-180")}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    <AnimatePresence initial={false}>
                      {portfolioOpen && (
                        <motion.div
                          initial={reduce ? false : { height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={reduce ? undefined : { height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className="overflow-hidden"
                        >
                          <div className="flex flex-col gap-1 pl-4 pt-1">
                            <Link
                              href="/portfolio"
                              onClick={closeMenu}
                              className="flex min-h-11 items-center rounded-lg px-4 text-sm font-medium transition-colors duration-200 hover:bg-muted hover:text-accent-bright"
                            >
                              All Work
                            </Link>
                            {portfolioCategories.map((cat) => (
                              <Link
                                key={cat.key}
                                href={`/portfolio?category=${cat.key}`}
                                onClick={closeMenu}
                                className="flex min-h-11 items-center rounded-lg px-4 text-sm font-medium transition-colors duration-200 hover:bg-muted hover:text-accent-bright"
                              >
                                {cat.label}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className={cn(
                      "flex min-h-11 items-center rounded-lg px-4 text-sm font-medium transition-colors duration-200 hover:bg-muted hover:text-accent-bright",
                      pathname === link.href && "text-accent-bright"
                    )}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}