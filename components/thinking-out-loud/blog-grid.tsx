import Link from "next/link";
import { FadeIn } from "@/components/motion/fade-in";
import { EmptyState } from "@/components/ui/empty-state";
import { BlogCard } from "./blog-card";
import type { BlogPost } from "@/lib/wordpress/posts";

type BlogGridProps = {
  posts: BlogPost[];
  showFeatured: boolean;
  page: number;
  totalPages: number;
  nextPageHref: string;
};

export function BlogGrid({
  posts,
  showFeatured,
  page,
  totalPages,
  nextPageHref,
}: BlogGridProps) {
  if (posts.length === 0) {
    return (
      <EmptyState
        heading="No posts found."
        subtext="Try a different search term or category."
        actionLabel="View all posts"
        actionHref="/thinking-out-loud"
      />
    );
  }

  const [featured, ...rest] = posts;
  const gridPosts = showFeatured ? rest : posts;

  return (
    <section className="px-6 pb-16" aria-live="polite">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <FadeIn className="contents">
          {showFeatured && featured && (
            <BlogCard {...featured} featured />
          )}
          {gridPosts.map((post) => (
            <BlogCard key={post.id} {...post} />
          ))}
        </FadeIn>
      </div>
      {page < totalPages && (
        <div className="mt-10 flex justify-center">
          <Link
            href={nextPageHref}
            className="border-border hover:bg-black/[0.03] inline-flex h-11 items-center justify-center rounded-full border px-6 text-sm font-medium"
          >
            Load more
          </Link>
        </div>
      )}
    </section>
  );
}
