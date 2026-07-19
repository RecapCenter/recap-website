import type { MetadataRoute } from "next";
import { getAllPostSlugs } from "@/lib/wordpress/posts";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

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
  "/contact",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const postSlugs = await getAllPostSlugs();

  const routes = [
    ...STATIC_ROUTES,
    ...postSlugs.map((slug) => `/thinking-out-loud/${slug}`),
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }));
}
