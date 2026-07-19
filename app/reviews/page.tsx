import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/page-intro";
import { CTABanner } from "@/components/ui/cta-banner";
import { ReviewsGrid } from "@/components/reviews/reviews-grid";
import { getCombinedReviews } from "@/lib/reviews";

export const metadata: Metadata = {
  title: "Reviews — Recap",
  description:
    "What clients say about working with Recap — real reviews from families, schools, and teams we've supported.",
};

export default async function ReviewsPage() {
  const reviews = await getCombinedReviews();

  return (
    <main>
      <PageIntro
        eyebrow="kind words"
        heading={
          <>
            Straight from <span className="text-accent-orange">clients</span>
          </>
        }
        subtext="Real experiences from the families, schools, and teams we've worked with."
        size="compact"
      />
      <ReviewsGrid reviews={reviews} />
      <CTABanner
        eyebrow="your turn"
        heading="Ready to start your own story?"
        subtext="Reach out — the first conversation is the easiest step."
        buttonLabel="Get in touch"
        buttonHref="/contact"
      />
    </main>
  );
}
