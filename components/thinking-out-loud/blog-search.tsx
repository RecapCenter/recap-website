"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ExpandableSearch,
  type SearchSuggestion,
} from "@/components/ui/expandable-search";
import type { BlogPost } from "@/lib/wordpress/posts";

type BlogSearchProps = {
  posts: BlogPost[];
  className?: string;
};

export function BlogSearch({ posts, className }: BlogSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);

  function handleChange(next: string) {
    setValue(next);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (next) {
        params.set("q", next);
      } else {
        params.delete("q");
      }
      params.delete("page");
      const query = params.toString();
      router.push(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
    }, 350);
  }

  const suggestions: SearchSuggestion[] = useMemo(() => {
    const query = value.trim().toLowerCase();
    if (!query) return [];
    return posts
      .filter((post) => post.title.toLowerCase().includes(query))
      .slice(0, 6)
      .map((post) => ({ id: post.id, label: post.title }));
  }, [value, posts]);

  return (
    <ExpandableSearch
      value={value}
      onValueChange={handleChange}
      suggestions={suggestions}
      onSelectSuggestion={(suggestion) => {
        const post = posts.find((p) => p.id === suggestion.id);
        if (post) router.push(`/thinking-out-loud/${post.slug}`);
      }}
      placeholder="Search posts"
      accentColor="var(--pastel-mustard)"
      className={className}
    />
  );
}
