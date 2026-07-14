import { FadeIn } from "@/components/motion/fade-in";
import { EmptyState } from "@/components/ui/empty-state";
import { FreebieCard } from "./freebie-card";
import type { Freebie } from "@/lib/wordpress/freebies";

export function FreebiesGrid({ freebies }: { freebies: Freebie[] }) {
  if (freebies.length === 0) {
    return (
      <EmptyState
        heading="Nothing to download just yet."
        subtext="We're preparing a few free resources — check back soon."
      />
    );
  }

  return (
    <section className="px-6 pb-20 md:pb-24">
      <FadeIn className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {freebies.map((freebie) => (
          <FreebieCard key={freebie.id} {...freebie} />
        ))}
      </FadeIn>
    </section>
  );
}
