import { wpFetch } from "./client";
import { collectionTag } from "./revalidation";
import type { WPReviewRaw } from "./types";
import type { Review } from "@/lib/reviews";

function mapReview(raw: WPReviewRaw): Review {
  return {
    id: `wp-${raw.id}`,
    name: raw.title.rendered,
    rating: raw.acf.rating,
    quote: raw.acf.quote,
  };
}

/**
 * CMS testimonials, newest first, already in the shared normalized Review
 * shape. One source of the hybrid list assembled by lib/reviews.ts's
 * getCombinedReviews() — consumers should call that, not this directly.
 */
export async function getWordPressReviews(limit = 100): Promise<Review[]> {
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
