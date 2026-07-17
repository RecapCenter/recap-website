"use client";

import { useState } from "react";
import { FadeIn } from "@/components/motion/fade-in";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";
import { GalleryCard } from "./gallery-card";
import { Lightbox } from "./lightbox";
import type { GalleryItem } from "@/lib/wordpress/gallery";

const COLUMN_OPTIONS = [3, 4, 5] as const;
type ColumnCount = (typeof COLUMN_OPTIONS)[number];

const GRID_COLUMN_CLASSES: Record<ColumnCount, string> = {
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
  5: "sm:grid-cols-5",
};

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [columns, setColumns] = useState<ColumnCount>(3);

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
      <div className="mx-auto mb-6 flex max-w-[1200px] justify-end">
        <div
          role="group"
          aria-label="Grid columns"
          className="border-border inline-flex items-center gap-1 rounded-full border bg-white p-1"
        >
          {COLUMN_OPTIONS.map((count) => (
            <button
              key={count}
              type="button"
              onClick={() => setColumns(count)}
              aria-pressed={columns === count}
              aria-label={`${count} columns`}
              className={cn(
                "flex size-9 items-center justify-center rounded-full text-sm font-medium transition-colors",
                columns === count
                  ? "text-white"
                  : "text-ink/70 hover:bg-black/[0.03]",
              )}
              style={
                columns === count
                  ? { backgroundColor: "var(--accent-orange)" }
                  : undefined
              }
            >
              {count}
            </button>
          ))}
        </div>
      </div>
      <FadeIn
        className={cn(
          "mx-auto grid max-w-[1200px] grid-cols-1 gap-4 md:gap-6",
          GRID_COLUMN_CLASSES[columns],
        )}
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
