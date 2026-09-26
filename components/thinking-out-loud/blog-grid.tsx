import Link from "next/link";
import { FadeIn } from "@/components/motion/fade-in";
import { EmptyState } from "@/components/ui/empty-state";
import { BlogCard } from "./blog-card";
import type { BlogPost } from "@/lib/wordpress/posts";

type BlogGridProps = {
  posts: BlogPost[];
  page: number;
  totalPages: number;
  nextPageHref: string;
};

/** Even grid of identical cards — no oversized "featured" first card. */
export function BlogGrid({
  posts,
  page,
  totalPages,
  nextPageHref,
}: BlogGridProps) {
  if (posts.length === 0) {
    return (
      <EmptyState
        heading="No posts found."
        subtext="Try a different search term."
        actionLabel="View all posts"
        actionHref="/thinking-out-loud"
      />
    );
  }

  return (
    <section className="px-6 pb-16" aria-live="polite">
      <FadeIn className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.id} {...post} />
        ))}
      </FadeIn>
      {page < totalPages && (
        <div className="mt-10 flex justify-center">
          <Link
            href={nextPageHref}
            className="border-border inline-flex h-11 items-center justify-center rounded-full border px-6 text-sm font-medium hover:bg-black/[0.03]"
          >
            Load more
          </Link>
        </div>
      )}
    </section>
  );
}
