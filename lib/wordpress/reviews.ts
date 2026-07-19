import { wpFetch } from "./client";
import { collectionTag } from "./revalidation";
import type { WPReviewRaw } from "./types";

export type Review = {
  id: number;
  name: string;
  rating: number;
  quote: string;
};

function mapReview(raw: WPReviewRaw): Review {
  return {
    id: raw.id,
    name: raw.title.rendered,
    rating: raw.acf.rating,
    quote: raw.acf.quote,
  };
}

/** Latest reviews, newest first — used by the homepage's "Straight from clients" section. */
export async function getReviews(limit = 3): Promise<Review[]> {
  try {
    const { data } = await wpFetch<WPReviewRaw[]>("/reviews", {
      params: { per_page: limit },
      tags: [collectionTag("review")],
    });
    return data.map(mapReview);
  } catch (error) {
    console.error("Failed to fetch WordPress reviews", error);
    return [];
  }
}
