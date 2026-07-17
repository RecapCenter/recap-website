import { BlogSearch } from "./blog-search";
import type { BlogPost } from "@/lib/wordpress/posts";

type BlogFilterBarProps = {
  allPosts: BlogPost[];
};

export function BlogFilterBar({ allPosts }: BlogFilterBarProps) {
  return (
    <div className="mx-auto flex max-w-[1200px] justify-end px-6 pb-10">
      <BlogSearch posts={allPosts} />
    </div>
  );
}
