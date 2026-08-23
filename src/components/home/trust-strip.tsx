"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Section } from "@/components/ui/section";
import { initials } from "@/lib/utils";

interface TrustTestimonial {
  id: string;
  name: string;
  role?: string | null;
  text: string;
  rating: number;
}

const ROTATE_MS = 5000;

export function TrustStrip({ testimonials }: { testimonials: TrustTestimonial[] }) {
  const items = testimonials.length ? testimonials : [];
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (items.length < 2 || reduce) return;
    timer.current = setInterval(() => setIndex((i) => (i + 1) % items.length), ROTATE_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [items.length, reduce]);

  if (!items.length) return null;

  const t = items[index % items.length];

  return (
    <Section className="py-8 sm:py-10">
      <div className="relative mx-auto max-w-2xl">
        <div className="relative flex min-h-[12rem] items-center overflow-hidden rounded-2xl border border-border bg-card px-6 py-8 text-center sm:min-h-[10rem] sm:px-10">
          <AnimatePresence mode="wait" initial={false}>
            <motion.figure
              key={t.id}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -14 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full"
            >
              <div className="mb-3 flex justify-center gap-1 text-gold" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} viewBox="0 0 20 20" className={`h-4 w-4 ${i < t.rating ? "fill-current" : "fill-muted-foreground/30"}`}>
                    <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z" />
                  </svg>
                ))}
              </div>
              <blockquote className="mx-auto max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                “{t.text}”
              </blockquote>
              <figcaption className="mt-5 flex items-center justify-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                  {initials(t.name)}
                </span>
                <div className="text-left">
                  <p className="text-sm font-semibold">{t.name}</p>
                  {t.role && <p className="text-xs text-muted-foreground">{t.role}</p>}
                </div>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        {items.length > 1 && (
          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              type="button"
              aria-label="Previous testimonial"
              onClick={() => setIndex((index - 1 + items.length) % items.length)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-gold/50 hover:text-accent-bright"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex gap-1.5">
              {items.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`Show testimonial ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? "w-5 bg-gold" : "w-1.5 bg-muted-foreground/40 hover:bg-muted-foreground/70"}`}
                />
              ))}
            </div>
            <button
              type="button"
              aria-label="Next testimonial"
              onClick={() => setIndex((index + 1) % items.length)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-gold/50 hover:text-accent-bright"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </Section>
  );
}