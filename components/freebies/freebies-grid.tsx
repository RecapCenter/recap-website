"use client";

import { useState } from "react";
import { FadeIn } from "@/components/motion/fade-in";
import { EmptyState } from "@/components/ui/empty-state";
import {
  ExpandableSearch,
  type SearchSuggestion,
} from "@/components/ui/expandable-search";
import { FreebieCard } from "./freebie-card";
import { FreebiePdfModal } from "./freebie-pdf-modal";
import type { Freebie } from "@/lib/wordpress/freebies";

export function FreebiesGrid({ freebies }: { freebies: Freebie[] }) {
  const [openId, setOpenId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  if (freebies.length === 0) {
    return (
      <EmptyState
        heading="Nothing to download just yet."
        subtext="We're preparing a few free resources — check back soon."
      />
    );
  }

  const query = search.trim().toLowerCase();
  const filteredFreebies = query
    ? freebies.filter((freebie) => freebie.title.toLowerCase().includes(query))
    : freebies;
  const suggestions: SearchSuggestion[] = query
    ? filteredFreebies
        .slice(0, 6)
        .map((freebie) => ({ id: freebie.id, label: freebie.title }))
    : [];

  const openFreebie = freebies.find((freebie) => freebie.id === openId) ?? null;

  return (
    <section className="px-6 pb-20 md:pb-24">
      <div className="mx-auto mb-6 flex max-w-[1200px] justify-end">
        <ExpandableSearch
          value={search}
          onValueChange={setSearch}
          suggestions={suggestions}
          onSelectSuggestion={(suggestion) => setSearch(suggestion.label)}
          placeholder="Search freebies"
          accentColor="var(--pastel-blue)"
        />
      </div>
      {filteredFreebies.length === 0 ? (
        <EmptyState
          heading="No freebies match your search."
          subtext="Try a different search term."
        />
      ) : (
        <FadeIn className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 lg:grid-cols-3">
          {filteredFreebies.map((freebie) => (
            <FreebieCard
              key={freebie.id}
              {...freebie}
              onOpen={() => setOpenId(freebie.id)}
            />
          ))}
        </FadeIn>
      )}
      <FreebiePdfModal
        freebie={openFreebie}
        onOpenChange={(open) => !open && setOpenId(null)}
      />
    </section>
  );
}
