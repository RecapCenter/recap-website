import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/ui/section-heading";
import { BlogCard } from "./blog-card";
import type { BlogPost } from "@/lib/wordpress/posts";

export function RelatedPosts({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="bg-cream px-6 py-16 md:py-20">
      <FadeIn className="mx-auto max-w-[1200px]">
        <SectionHeading as="h3" className="mb-6">
          More like this
        </SectionHeading>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.id} {...post} />
          ))}
        </div>
      </FadeIn>
    </section>
  );
}
