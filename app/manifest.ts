import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/utils/seoConfig";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kalam Library - Islamic Naats & Kalams",
    short_name: "Kalam Library",
    description: SITE_CONFIG.description,
    start_url: "/",
    display: "standalone",
    background_color: "#020806",
    theme_color: "#020806",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/favicon.webp",
        sizes: "1600x1600",
        type: "image/webp",
      },
    ],
  };
}
