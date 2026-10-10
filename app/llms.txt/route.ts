import { getPosts } from "@/lib/wordpress/posts";
import { SITE_URL } from "@/lib/site-url";

/**
 * /llms.txt — a plain-Markdown summary of the site for AI assistants
 * (llmstxt.org convention): who Recap is, its key pages and its posts.
 * Optional and not used by Google. Built from WordPress so new posts appear
 * automatically. Keep the wording consistent with the site (sessions are
 * online only; Recap is not an emergency service).
 */
export const revalidate = 3600;

export async function GET() {
  const { data: posts } = await getPosts({ perPage: 100 });
  const page = (path: string) => `${SITE_URL}${path}`;

  const body = `# Recap — Realm of Counselling and Psychological Services

> Recap offers counselling, special education support and trainings for children, adolescents, adults, parents, educators and schools. Sessions take place online. Recap is not an emergency or crisis service: in India call 112, or Tele-MANAS on 14416 for urgent emotional support.

## About Recap

- [About](${page("/about")}): why Recap exists and who founded it
- [Services](${page("/services")}): counselling, special education and trainings
- [FAQ](${page("/faq")}): who Recap works with, confidentiality, fees, children, first contact
- [Reviews](${page("/reviews")}): what clients say
- [Contact](${page("/contact")}): how to get in touch (replies usually within 48 hours)

## Resources

- [Thinking Out Loud](${page("/thinking-out-loud")}): reflections on everyday work with children, families and schools
- [Freebies](${page("/freebies")}): free worksheets and guides
- [Recap Recommends](${page("/recap-recommends")}): books, videos and tools worth your time
- [Gallery](${page("/gallery")}): moments from Recap's workshops and sessions

## Thinking Out Loud posts

${posts
  .map(
    (post) =>
      `- [${post.titleText}](${page(`/thinking-out-loud/${post.slug}`)})${post.description ? `: ${post.description}` : ""}`,
  )
  .join("\n")}

## Optional

- [Privacy Policy](${page("/privacy")})
- [Terms of Service](${page("/terms")})
- [RSS feed](${page("/feed.xml")})
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
