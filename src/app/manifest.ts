import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dev Nour — Nour Mohamed",
    short_name: "Dev Nour",
    description:
      "Portfolio of Nour Mohamed, founder of Mudiri Digi — web, apps, stores, SEO.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0b",
    theme_color: "#ff2d55",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
