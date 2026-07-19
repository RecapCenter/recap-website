import type { Review } from "./reviews";

/**
 * Google reviews change slowly and the Places API is quota-billed, so
 * cache for 6 hours rather than refetching per request.
 */
const REVALIDATE_SECONDS = 6 * 60 * 60;

const FETCH_TIMEOUT_MS = 8000;

/** Google reviews below this rating are dropped server-side and never reach the frontend. */
const MIN_RATING = 3;

type GooglePlaceReview = {
  rating?: number;
  text?: { text?: string };
  authorAttribution?: { displayName?: string };
};

function normalizeGoogleReview(
  raw: GooglePlaceReview,
  index: number,
): Review | null {
  const name = raw.authorAttribution?.displayName?.trim();
  const quote = raw.text?.text?.trim();
  const rating = raw.rating;

  // Rating-only reviews (no text) render as an empty card, so skip them.
  if (!name || !quote || typeof rating !== "number") return null;

  return { id: `google-${index}`, name, rating: Math.round(rating), quote };
}

/**
 * Latest reviews from the Google Business Profile via the Places API
 * (New), reduced to the shared normalized shape — reviewer name, rating,
 * and text only; profile photos, badges, timestamps, and URLs are
 * deliberately not requested. Requires GOOGLE_PLACES_API_KEY and
 * GOOGLE_PLACE_ID (see .env.example). Any failure — missing config, HTTP
 * error, timeout, quota — returns an empty list so the page falls back to
 * CMS testimonials alone.
 */
export async function getGoogleReviews(): Promise<Review[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!apiKey || !placeId) return [];

  try {
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}`,
      {
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "reviews.rating,reviews.text,reviews.authorAttribution",
        },
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        next: { revalidate: REVALIDATE_SECONDS, tags: ["google:reviews"] },
      },
    );

    if (!response.ok) {
      throw new Error(`Google Places API responded with ${response.status}`);
    }

    const data = (await response.json()) as { reviews?: GooglePlaceReview[] };

    return (data.reviews ?? [])
      .map(normalizeGoogleReview)
      .filter((review): review is Review => review !== null)
      .filter((review) => review.rating >= MIN_RATING);
  } catch (error) {
    console.error("Failed to fetch Google reviews", error);
    return [];
  }
}
