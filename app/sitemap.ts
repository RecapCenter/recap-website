import type { MetadataRoute } from "next";
import { getAllPostSlugs } from "@/lib/wordpress/posts";
import { SITE_URL as siteUrl } from "@/lib/site-url";

const STATIC_ROUTES = [
  "",
  "/about",
  "/services",
  "/thinking-out-loud",
  "/gallery",
  "/freebies",
  "/recap-lab",
  "/recap-recommends",
  "/reviews",
  "/faq",
  "/contact",
  "/privacy",
  "/terms",
];

/**
 * Blog posts carry their real last-modified date from WordPress. Static
 * pages carry none: stamping them with the build time on every deploy
 * teaches search engines to ignore the field altogether.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPostSlugs();

  return [
    ...STATIC_ROUTES.map((route) => ({ url: `${siteUrl}${route}` })),
    ...posts.map(({ slug, modifiedAtUtc }) => ({
      url: `${siteUrl}/thinking-out-loud/${slug}`,
      ...(modifiedAtUtc ? { lastModified: new Date(modifiedAtUtc) } : {}),
    })),
  ];
}
