import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: { allowedOrigins: ["localhost:3000", "aira-blush.vercel.app"] },
  },
  images: {
    unoptimized: true,
  },
  // PWA headers for service worker scope
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control",               value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed",       value: "/" },
          { key: "X-Content-Type-Options",       value: "nosniff" },
        ],
      },
      {
        source: "/manifest.json",
        headers: [
          { key: "Content-Type", value: "application/manifest+json" },
          { key: "Cache-Control", value: "public, max-age=86400" },
        ],
      },
    ];
  },
};

export default nextConfig;
