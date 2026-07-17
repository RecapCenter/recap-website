import { wpFetch, WordPressApiError, type Paginated } from "./client";
import { collectionTag } from "./revalidation";
import type { WPPostRaw } from "./types";

export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  publishedAt: string;
  featuredImage: { url: string; alt: string } | null;
  featuredOnHomepage: boolean;
  homepageDisplayOrder: number | null;
};

function mapPost(raw: WPPostRaw): BlogPost {
  const media = raw._embedded?.["wp:featuredmedia"]?.[0];

  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title.rendered,
    excerpt: raw.excerpt.rendered,
    contentHtml: raw.content.rendered,
    publishedAt: raw.date,
    featuredImage: media
      ? { url: media.source_url, alt: media.alt_text }
      : null,
    featuredOnHomepage: raw.acf?.featured_on_homepage ?? false,
    homepageDisplayOrder: raw.acf?.homepage_display_order ?? null,
  };
}

const EMPTY_PAGINATED: Paginated<BlogPost[]> = {
  data: [],
  total: 0,
  totalPages: 0,
};

export async function getPosts({
  search,
  page = 1,
  perPage = 9,
}: {
  search?: string;
  page?: number;
  perPage?: number;
} = {}): Promise<Paginated<BlogPost[]>> {
  try {
    const { data, total, totalPages } = await wpFetch<WPPostRaw[]>("/posts", {
      params: {
        search,
        page,
        per_page: perPage,
        _embed: true,
      },
      tags: [collectionTag("post")],
    });

    return { data: data.map(mapPost), total, totalPages };
  } catch (error) {
    console.error("Failed to fetch WordPress posts", error);
    return EMPTY_PAGINATED;
  }
}

/**
 * Posts to feature in the homepage "Thinking Out Loud" section — i.e.
 * `featured_on_homepage = true` in WordPress, never just the latest
 * posts. Sorted by `homepage_display_order` ascending (posts without an
 * explicit order sort last), then by publish date descending as a
 * tiebreaker. Sorting happens here rather than in the WordPress query
 * since `homepage_display_order` is optional/nullable per post.
 */
export async function getFeaturedHomepagePosts(
  limit = 6,
): Promise<BlogPost[]> {
  try {
    const { data } = await wpFetch<WPPostRaw[]>("/posts", {
      params: { featured_on_homepage: true, per_page: 20, _embed: true },
      tags: [collectionTag("post")],
    });

    const byDateDesc = (a: BlogPost, b: BlogPost) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();

    return data
      .map(mapPost)
      .sort((a, b) => {
        const { homepageDisplayOrder: aOrder } = a;
        const { homepageDisplayOrder: bOrder } = b;
        if (aOrder === null && bOrder === null) return byDateDesc(a, b);
        if (aOrder === null) return 1;
        if (bOrder === null) return -1;
        return aOrder !== bOrder ? aOrder - bOrder : byDateDesc(a, b);
      })
      .slice(0, limit);
  } catch (error) {
    console.error("Failed to fetch WordPress featured homepage posts", error);
    return [];
  }
}

export async function getAllPostSlugs(): Promise<string[]> {
  try {
    const { data } = await wpFetch<Pick<WPPostRaw, "slug">[]>("/posts", {
      params: { per_page: 100, _fields: "slug" },
      tags: [collectionTag("post")],
    });
    return data.map((post) => post.slug);
  } catch (error) {
    console.error("Failed to fetch WordPress post slugs", error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const { data } = await wpFetch<WPPostRaw[]>("/posts", {
      params: { slug, _embed: true },
      tags: [collectionTag("post"), `wp:posts:${slug}`],
    });
    const post = data[0];
    return post ? mapPost(post) : null;
  } catch (error) {
    if (error instanceof WordPressApiError) {
      console.error(`Failed to fetch WordPress post "${slug}"`, error);
    }
    return null;
  }
}
