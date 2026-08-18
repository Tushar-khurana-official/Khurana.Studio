import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Khurana Studio — Premium Photography",
    short_name: "Khurana Studio",
    description: "Premium photography studio crafting cinematic weddings, portraits, events and products.",
    start_url: "/",
    display: "standalone",
    background_color: "#0c0e0c",
    theme_color: "#0c0e0c",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}