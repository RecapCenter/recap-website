import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    qualities: [75, 90],
    remotePatterns: [
      ...(process.env.WORDPRESS_MEDIA_HOSTNAME
        ? [
            {
              protocol: "https" as const,
              hostname: process.env.WORDPRESS_MEDIA_HOSTNAME,
              pathname: "/wp-content/uploads/**",
            },
          ]
        : []),
      {
        protocol: "https" as const,
        hostname: "img.youtube.com",
        pathname: "/vi/**",
      },
      {
        // Vimeo video thumbnails for Recap Recommends (lib/video-thumbnails.ts)
        protocol: "https" as const,
        hostname: "i.vimeocdn.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
