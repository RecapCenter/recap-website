import { wpFetch, WordPressApiError, type Paginated } from "./client";
import { collectionTag } from "./revalidation";
import type { WPCategory, WPPostRaw } from "./types";

export type PostCategory = {
  id: number;
  name: string;
  slug: string;
};

export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  publishedAt: string;
  categories: PostCategory[];
  featuredImage: { url: string; alt: string } | null;
};

function mapPost(raw: WPPostRaw): BlogPost {
  const media = raw._embedded?.["wp:featuredmedia"]?.[0];
  const terms = raw._embedded?.["wp:term"]?.flat() ?? [];

  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title.rendered,
    excerpt: raw.excerpt.rendered,
    contentHtml: raw.content.rendered,
    publishedAt: raw.date,
    categories: terms
      .filter((term) => raw.categories.includes(term.id))
      .map((term) => ({ id: term.id, name: term.name, slug: term.slug })),
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

export async function getCategories(): Promise<PostCategory[]> {
  try {
    const { data } = await wpFetch<WPCategory[]>("/categories", {
      params: { per_page: 100 },
      tags: [collectionTag("category")],
    });
    return data.map((term) => ({
      id: term.id,
      name: term.name,
      slug: term.slug,
    }));
  } catch (error) {
    console.error("Failed to fetch WordPress categories", error);
    return [];
  }
}

export async function getPosts({
  search,
  categorySlug,
  page = 1,
  perPage = 9,
}: {
  search?: string;
  categorySlug?: string;
  page?: number;
  perPage?: number;
} = {}): Promise<Paginated<BlogPost[]>> {
  try {
    let categoryId: number | undefined;
    if (categorySlug) {
      const categories = await getCategories();
      categoryId = categories.find((c) => c.slug === categorySlug)?.id;
      if (!categoryId) return EMPTY_PAGINATED;
    }

    const { data, total, totalPages } = await wpFetch<WPPostRaw[]>("/posts", {
      params: {
        search,
        categories: categoryId,
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
