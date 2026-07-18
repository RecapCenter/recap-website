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
 * Posts to show in the homepage "Thinking Out Loud" section — simply the
 * most recently published posts, newest first (WordPress's default
 * `/posts` ordering), with no manual curation step required in WP admin.
 */
export async function getLatestHomepagePosts(
  limit = 6,
): Promise<BlogPost[]> {
  try {
    const { data } = await wpFetch<WPPostRaw[]>("/posts", {
      params: { per_page: limit, _embed: true },
      tags: [collectionTag("post")],
    });

    return data.map(mapPost);
  } catch (error) {
    console.error("Failed to fetch WordPress latest homepage posts", error);
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
