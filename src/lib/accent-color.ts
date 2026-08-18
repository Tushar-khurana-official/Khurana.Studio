"use client";

/**
 * Resolve the currently active accent (CSS variable) at runtime.
 * Used for client-only integrations like the Razorpay modal theme and the
 * React Three Fiber scenes, so they follow the active theme instead of a
 * hardcoded hex.
 */
export function getAccentColor() {
  if (typeof document === "undefined") return "#15803d";
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue("--accent")
    .trim();
  return value || "#15803d";
}

export function isDarkTheme() {
  if (typeof document === "undefined") return true;
  return document.documentElement.classList.contains("dark");
}