import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
  poweredByHeader: false,
  async rewrites() {
    return [
      {
        source: "/uploads/:filename",
        destination: "/api/media/:filename",
      },
    ];
  },
};

export default withNextIntl(nextConfig);
