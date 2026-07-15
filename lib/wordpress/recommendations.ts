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
  externalLink: string;
  category: string;
};

function mapRecommendation(raw: WPRecommendationRaw): Recommendation {
  const terms = raw._embedded?.["wp:term"]?.flat() ?? [];
  const category = terms.find((term) =>
    raw.recommendation_category.includes(term.id),
  );

  return {
    id: raw.id,
    title: raw.title.rendered,
    description: raw.acf.description ?? "",
    imageUrl: raw.acf.image?.url ?? "",
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
    return data.map(mapRecommendation);
  } catch (error) {
    console.error("Failed to fetch WordPress recommendations", error);
    return [];
  }
}
