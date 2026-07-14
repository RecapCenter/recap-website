import { FadeIn } from "@/components/motion/fade-in";
import { EmptyState } from "@/components/ui/empty-state";
import { RecommendationCard } from "./recommendation-card";
import type { Recommendation } from "@/lib/wordpress/recommendations";

export function RecommendationsGrid({
  recommendations,
}: {
  recommendations: Recommendation[];
}) {
  if (recommendations.length === 0) {
    return (
      <EmptyState
        heading="No recommendations here yet."
        subtext="Try a different category, or check back soon — we're always adding to the list."
        actionLabel="View all"
        actionHref="/recap-recommends"
      />
    );
  }

  return (
    <section className="px-6 pb-20 md:pb-24">
      <FadeIn className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {recommendations.map((recommendation) => (
          <RecommendationCard key={recommendation.id} {...recommendation} />
        ))}
      </FadeIn>
    </section>
  );
}
