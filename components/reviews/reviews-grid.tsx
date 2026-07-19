import { FadeIn } from "@/components/motion/fade-in";
import { EmptyState } from "@/components/ui/empty-state";
import { ReviewCard } from "./review-card";
import type { Review } from "@/lib/reviews";

/**
 * Masonry-style review grid: 3 equal-width columns on desktop (>=1024px),
 * 2 on tablet (768-1023px), 1 on mobile, with 24px gaps. CSS multi-column
 * layout keeps column widths identical while every card keeps its natural
 * height, so short and long reviews flow like a pinboard.
 */
export function ReviewsGrid({ reviews }: { reviews: Review[] }) {
  return (
    <section className="bg-cream px-6 py-16 md:py-20">
      <div className="mx-auto max-w-[1200px]">
        {reviews.length === 0 ? (
          <EmptyState
            heading="No reviews just yet."
            subtext="Kind words from clients will appear here soon."
            actionLabel="Get in touch"
            actionHref="/contact"
          />
        ) : (
          <FadeIn className="columns-1 gap-6 md:columns-2 lg:columns-3">
            {reviews.map((review) => (
              <div key={review.id} className="mb-6 break-inside-avoid">
                <ReviewCard {...review} />
              </div>
            ))}
          </FadeIn>
        )}
      </div>
    </section>
  );
}
