import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/page-intro";
import { HighlightMark } from "@/components/ui/section-heading";
import { CTABanner } from "@/components/ui/cta-banner";
import { BlogFilterBar } from "@/components/thinking-out-loud/blog-filter-bar";
import { BlogGrid } from "@/components/thinking-out-loud/blog-grid";
import { getPosts } from "@/lib/wordpress/posts";
import thinkingOutLoudIcon from "@/assets/icons/thinking-out-loud-logo.svg";

export const metadata: Metadata = {
  title: "Thinking Out Loud — Recap",
  description:
    "Stories and reflections from everyday work with children, families, and schools — thinking out loud, one post at a time.",
};

const PER_PAGE = 9;

export default async function ThinkingOutLoudPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const [{ data: posts, totalPages }, { data: allPosts }] = await Promise.all([
    getPosts({ search: q, page, perPage: PER_PAGE }),
    getPosts({ perPage: 100 }),
  ]);

  const params = new URLSearchParams();
  if (q) params.set("q", q);
  params.set("page", String(page + 1));

  return (
    <main>
      <PageIntro
        icon={thinkingOutLoudIcon}
        iconBg="var(--pastel-mustard)"
        eyebrow="thinking out loud"
        heading={
          <>
            Stories worth <HighlightMark>sitting with</HighlightMark>.
          </>
        }
        subtext="Reflections from everyday work with children, families, and schools — written the way we'd say it out loud."
        size="full"
      />
      <BlogFilterBar allPosts={allPosts} />
      <BlogGrid
        posts={posts}
        showFeatured={page === 1 && !q}
        page={page}
        totalPages={totalPages}
        nextPageHref={`/thinking-out-loud?${params.toString()}`}
      />
      <CTABanner
        eyebrow="stay in the loop"
        heading="Get new posts in your inbox."
        subtext="No spam, just the occasional thing worth reading."
        buttonLabel="Get in touch"
        buttonHref="/contact"
      />
    </main>
  );
}
