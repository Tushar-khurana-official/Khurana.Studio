"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/button";

export function StickyCta() {
  const [show] = useState(
    () => typeof window !== "undefined" && window.scrollY > window.innerHeight * 0.7
  );
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.7);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-5 right-5 z-40 sm:bottom-7 sm:right-7"
        >
          <ButtonLink href="/booking" size="lg" className="shadow-2xl shadow-accent/30">
            Book a Session
          </ButtonLink>
        </motion.div>
      )}
    </AnimatePresence>
  );
}