"use client";

import { useMemo, useState } from "react";
import { FadeIn } from "@/components/motion/fade-in";
import { EmptyState } from "@/components/ui/empty-state";
import { GalleryItem } from "./gallery-item";
import { VideoModal } from "./video-modal";
import type { GalleryItem as GalleryItemType } from "@/lib/wordpress/gallery";

/**
 * Responsive masonry gallery built on CSS multi-column layout: every tile
 * renders at its own natural aspect ratio (via image-card/video-thumbnail),
 * so columns pack items of varying heights instead of forcing a fixed grid.
 * Column count: 1 (mobile) -> 2 (larger mobile/tablet) -> 3 (desktop) ->
 * 4 (wide desktop) -> 5 (large desktop).
 */
export function GalleryGrid({ items }: { items: GalleryItemType[] }) {
  const [openVideoIndex, setOpenVideoIndex] = useState<number | null>(null);

  const videos = useMemo(() => items.filter((item) => item.type === "video"), [items]);

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
        className="mx-auto max-w-[1600px] columns-1 gap-4 sm:columns-2 md:gap-6 lg:columns-3 xl:columns-4 2xl:columns-5"
        aria-live="polite"
      >
        {items.map((item) => (
          <div key={item.id} className="mb-4 break-inside-avoid md:mb-6">
            <GalleryItem
              {...item}
              onOpen={() => setOpenVideoIndex(videos.findIndex((v) => v.id === item.id))}
            />
          </div>
        ))}
      </FadeIn>
      <VideoModal
        videos={videos}
        openIndex={openVideoIndex}
        onOpenChange={setOpenVideoIndex}
      />
    </section>
  );
}
