import { getWordPressReviews } from "./wordpress/reviews";
import { getGoogleReviews } from "./google-reviews";

/**
 * The single normalized review shape every source maps into. The frontend
 * only ever sees this — it has no way to tell (and never displays) whether
 * a review came from the WordPress CMS or Google.
 */
export type Review = {
  /** Source-prefixed for uniqueness across sources; used only as a React key. */
  id: string;
  name: string;
  rating: number;
  quote: string;
};

/**
 * The hybrid review list: WordPress testimonials merged with Google
 * Business reviews (already filtered to rating >= 3 at the source — see
 * google-reviews.ts), sorted by rating descending. Ties keep insertion
 * order (CMS first), so curated testimonials lead within each rating
 * band. Each source fails soft to an empty list, so a Google outage just
 * means CMS-only (and vice versa).
 *
 * The homepage marquee passes a limit (top 10); the /reviews page omits
 * it to show everything.
 */
export async function getCombinedReviews(limit?: number): Promise<Review[]> {
  const [wordpressReviews, googleReviews] = await Promise.all([
    getWordPressReviews(),
    getGoogleReviews(),
  ]);

  const merged = [...wordpressReviews, ...googleReviews].sort(
    (a, b) => b.rating - a.rating,
  );

  return limit ? merged.slice(0, limit) : merged;
}
