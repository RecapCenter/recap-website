import { wpFetch, WordPressApiError, type Paginated } from "./client";
import { collectionTag } from "./revalidation";
import { htmlToText, toDescription } from "./text";
import type { WPPostRaw } from "./types";

export type BlogPost = {
  id: number;
  slug: string;
  /** WordPress HTML (entities, inline tags) — for rendering. */
  title: string;
  /** Plain-text title — for metadata and structured data. */
  titleText: string;
  excerpt: string;
  /** Plain-text excerpt trimmed to search-result length. */
  description: string;
  contentHtml: string;
  publishedAt: string;
  /** ISO timestamps (UTC), for sitemap and article metadata. */
  publishedAtUtc: string;
  modifiedAtUtc: string;
  featuredImage: { url: string; alt: string } | null;
};

/**
 * The post page's own title is the page's only <h1>; headings written as
 * "Heading 1" in the WordPress editor become <h2> so each page keeps a
 * single top-level heading for search engines and screen readers.
 */
function demoteH1(html: string): string {
  return html.replace(/<(\/?)h1(\s|>)/gi, "<$1h2$2");
}

/** WordPress's *_gmt fields are UTC but carry no zone suffix. */
function toUtcIso(gmt: string): string {
  return gmt ? `${gmt}Z` : "";
}

function mapPost(raw: WPPostRaw): BlogPost {
  const media = raw._embedded?.["wp:featuredmedia"]?.[0];

  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title.rendered,
    titleText: htmlToText(raw.title.rendered),
    excerpt: raw.excerpt.rendered,
    description: toDescription(raw.excerpt.rendered),
    contentHtml: demoteH1(raw.content.rendered),
    publishedAt: raw.date,
    publishedAtUtc: toUtcIso(raw.date_gmt),
    modifiedAtUtc: toUtcIso(raw.modified_gmt),
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
export async function getLatestHomepagePosts(limit = 6): Promise<BlogPost[]> {
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

/** Every post's slug and last-modified time (UTC), for static params and the sitemap. */
export async function getAllPostSlugs(): Promise<
  { slug: string; modifiedAtUtc: string }[]
> {
  try {
    const { data } = await wpFetch<Pick<WPPostRaw, "slug" | "modified_gmt">[]>(
      "/posts",
      {
        params: { per_page: 100, _fields: "slug,modified_gmt" },
        tags: [collectionTag("post")],
      },
    );
    return data.map((post) => ({
      slug: post.slug,
      modifiedAtUtc: toUtcIso(post.modified_gmt),
    }));
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
