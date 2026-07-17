"use client";

import { useState } from "react";
import { FadeIn } from "@/components/motion/fade-in";
import { EmptyState } from "@/components/ui/empty-state";
import { GalleryCard } from "./gallery-card";
import { Lightbox } from "./lightbox";
import type { GalleryItem } from "@/lib/wordpress/gallery";

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (items.length === 0) {
    return (
      <EmptyState
        heading="No photos or videos in this view yet."
        subtext="Try a different filter, or check back soon."
        actionLabel="View all"
        actionHref="/gallery"
      />
    );
  }

  return (
    <section className="px-6 pb-20 md:pb-24">
      <FadeIn
        className="mx-auto grid max-w-[1200px] grid-cols-1 gap-4 md:gap-6 lg:grid-cols-4"
        aria-live="polite"
      >
        {items.map((item, index) => (
          <GalleryCard key={item.id} {...item} onOpen={() => setOpenIndex(index)} />
        ))}
      </FadeIn>
      <Lightbox items={items} openIndex={openIndex} onOpenChange={setOpenIndex} />
    </section>
  );
}
