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
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
