import { getVideoThumbnail } from "@/lib/video-thumbnails";
import { wpFetch } from "./client";
import { collectionTag } from "./revalidation";
import type { WPCategory, WPRecommendationRaw } from "./types";

export type RecommendationCategory = {
  id: number;
  name: string;
  slug: string;
};

export type Recommendation = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  /** See VideoThumbnail.letterboxed — the card crops these tighter. */
  imageLetterboxed: boolean;
  externalLink: string;
  category: string;
};

/**
 * When the link is a YouTube/Vimeo video, the card shows that video's own
 * thumbnail; the uploaded Image is only a fallback for those (and the
 * image for every non-video recommendation).
 */
async function mapRecommendation(
  raw: WPRecommendationRaw,
): Promise<Recommendation> {
  const terms = raw._embedded?.["wp:term"]?.flat() ?? [];
  const category = terms.find((term) =>
    raw.recommendation_category.includes(term.id),
  );
  const videoThumbnail = raw.acf.external_link
    ? await getVideoThumbnail(raw.acf.external_link)
    : null;

  return {
    id: raw.id,
    title: raw.title.rendered,
    description: raw.acf.description ?? "",
    imageUrl: videoThumbnail?.url ?? raw.acf.image?.url ?? "",
    imageLetterboxed: videoThumbnail?.letterboxed ?? false,
    externalLink: raw.acf.external_link,
    category: category?.name ?? "",
  };
}

export async function getRecommendationCategories(): Promise<
  RecommendationCategory[]
> {
  try {
    const { data } = await wpFetch<WPCategory[]>("/recommendation_category", {
      params: { per_page: 100 },
      tags: [collectionTag("recommendation")],
    });
    return data.map((term) => ({
      id: term.id,
      name: term.name,
      slug: term.slug,
    }));
  } catch (error) {
    console.error("Failed to fetch WordPress recommendation categories", error);
    return [];
  }
}

export async function getRecommendations(): Promise<Recommendation[]> {
  try {
    const { data } = await wpFetch<WPRecommendationRaw[]>("/recommendations", {
      params: { per_page: 100, _embed: true },
      tags: [collectionTag("recommendation")],
    });
    return await Promise.all(data.map(mapRecommendation));
  } catch (error) {
    console.error("Failed to fetch WordPress recommendations", error);
    return [];
  }
}
