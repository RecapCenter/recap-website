import type { NextConfig } from "next";

/**
 * Pages the old WordPress front end served at recapcenter.com, mapped to
 * their equivalents here so existing links and search results don't 404
 * after the domain moves to this site.
 */
const LEGACY_PAGE_REDIRECTS: Record<string, string> = {
  "/home": "/",
  "/coming-soon": "/",
  "/blog": "/thinking-out-loud",
  "/case-stories": "/thinking-out-loud",
  "/resources": "/freebies",
};

/**
 * WordPress served posts at the site root (/%postname%/); here they live
 * under /thinking-out-loud/. This is a frozen snapshot of the posts that
 * existed on the old front end — posts published after launch never had a
 * root URL, so the list doesn't need to grow. Re-check it against
 * /wp-json/wp/v2/posts right before the DNS cutover.
 */
const LEGACY_POST_SLUGS = [
  "polite-disempowerment-sounds-like-empathy-but-feels-like-a-dead-end",
  "affirmations",
  "parenting",
  "weaponizing-hope",
  "co-regulation",
  "chance-favours-the-prepared-mind",
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      ...Object.entries(LEGACY_PAGE_REDIRECTS).map(
        ([source, destination]) => ({ source, destination, permanent: true }),
      ),
      ...LEGACY_POST_SLUGS.map((slug) => ({
        source: `/${slug}`,
        destination: `/thinking-out-loud/${slug}`,
        permanent: true,
      })),
    ];
  },
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
