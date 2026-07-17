"use client";

import { useState } from "react";
import { FadeIn } from "@/components/motion/fade-in";
import { EmptyState } from "@/components/ui/empty-state";
import {
  ExpandableSearch,
  type SearchSuggestion,
} from "@/components/ui/expandable-search";
import { RecommendationCard } from "./recommendation-card";
import type { Recommendation } from "@/lib/wordpress/recommendations";

export function RecommendationsGrid({
  recommendations,
}: {
  recommendations: Recommendation[];
}) {
  const [search, setSearch] = useState("");

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

  const query = search.trim().toLowerCase();
  const filtered = query
    ? recommendations.filter((item) => item.title.toLowerCase().includes(query))
    : recommendations;
  const suggestions: SearchSuggestion[] = query
    ? filtered.slice(0, 6).map((item) => ({ id: item.id, label: item.title }))
    : [];

  return (
    <section className="px-6 pb-20 md:pb-24">
      <div className="mx-auto mb-6 flex max-w-[1200px] justify-end">
        <ExpandableSearch
          value={search}
          onValueChange={setSearch}
          suggestions={suggestions}
          onSelectSuggestion={(suggestion) => setSearch(suggestion.label)}
          placeholder="Search recommendations"
          accentColor="var(--accent-orange)"
        />
      </div>
      {filtered.length === 0 ? (
        <EmptyState
          heading="No recommendations match your search."
          subtext="Try a different search term, or clear the search to see everything."
        />
      ) : (
        <FadeIn className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((recommendation) => (
            <RecommendationCard key={recommendation.id} {...recommendation} />
          ))}
        </FadeIn>
      )}
    </section>
  );
}
