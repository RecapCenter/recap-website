import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/page-intro";
import { CategoryTabs } from "@/components/ui/category-tabs";
import { CTABanner } from "@/components/ui/cta-banner";
import { RecommendationsGrid } from "@/components/recap-recommends/recommendations-grid";
import { getRecommendations } from "@/lib/wordpress/recommendations";
import recapRecommendsIcon from "@/assets/icons/recap-recommends-logo.svg";

export const metadata: Metadata = {
  title: "Recap Recommends — Recap",
  description:
    "Books, music, and research papers the Recap team keeps coming back to — a running list of what's shaped our thinking.",
};

const CATEGORIES = [
  { label: "All", value: "" },
  { label: "Books", value: "Books" },
  { label: "Music", value: "Music" },
  { label: "Research Papers", value: "Research Papers" },
];

export default async function RecapRecommendsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const recommendations = await getRecommendations();
  const filtered = category
    ? recommendations.filter((item) => item.category === category)
    : recommendations;

  return (
    <main>
      <PageIntro
        icon={recapRecommendsIcon}
        iconBg="var(--pastel-cream-tan)"
        eyebrow="worth your time"
        heading="Things we keep recommending."
        subtext="Books, music, and research papers the Recap team keeps coming back to — a running list of what's shaped our thinking."
        size="compact"
      />
      <div className="px-6 pb-10">
        <CategoryTabs
          basePath="/recap-recommends"
          categories={CATEGORIES}
          activeValue={category ?? ""}
          accentColor="var(--accent-orange)"
        />
      </div>
      <RecommendationsGrid recommendations={filtered} />
      <CTABanner
        eyebrow="have a suggestion?"
        heading="Read, watched, or listened to something great?"
        subtext="Send it our way — we're always looking for the next recommendation."
        buttonLabel="Get in touch"
        buttonHref="/contact"
      />
    </main>
  );
}
