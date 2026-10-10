import { getPosts } from "@/lib/wordpress/posts";
import { SITE_URL } from "@/lib/site-url";

/**
 * RSS 2.0 feed of Thinking Out Loud posts at /feed.xml, so feed readers,
 * aggregators and content pipelines can pick up new posts automatically.
 * Announced to browsers and crawlers by <link rel="alternate"> on the blog
 * pages (see their metadata). Refreshes with the rest of the WordPress
 * data (tag-based revalidation plus the 60-second fallback).
 */
export const revalidate = 60;

const FEED_SIZE = 20;

function xml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const { data: posts } = await getPosts({ perPage: FEED_SIZE });
  const blogUrl = `${SITE_URL}/thinking-out-loud`;
  const newest = posts[0]?.modifiedAtUtc || posts[0]?.publishedAtUtc;

  const items = posts
    .map((post) => {
      const url = `${blogUrl}/${post.slug}`;
      const date = post.publishedAtUtc
        ? `\n      <pubDate>${new Date(post.publishedAtUtc).toUTCString()}</pubDate>`
        : "";
      return `    <item>
      <title>${xml(post.titleText)}</title>
      <link>${xml(url)}</link>
      <guid isPermaLink="true">${xml(url)}</guid>${date}
      <description>${xml(post.description)}</description>
    </item>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Thinking Out Loud — Recap</title>
    <link>${xml(blogUrl)}</link>
    <atom:link href="${xml(`${SITE_URL}/feed.xml`)}" rel="self" type="application/rss+xml" />
    <description>Stories and reflections from everyday work with children, families, and schools.</description>
    <language>en</language>${newest ? `\n    <lastBuildDate>${new Date(newest).toUTCString()}</lastBuildDate>` : ""}
${items}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
