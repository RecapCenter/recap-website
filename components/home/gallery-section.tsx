import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { getGalleryItems } from "@/lib/wordpress/gallery";
import { cn } from "@/lib/utils";
import { PhotoColumn, type ColumnPhoto } from "./photo-column";

/** Background columns: 2 on mobile, 4 on tablet, 5 on desktop. */
const COLUMNS = [
  { duration: 38, className: "" },
  { duration: 46, className: "" },
  { duration: 42, className: "hidden md:block" },
  { duration: 50, className: "hidden md:block" },
  { duration: 40, className: "hidden lg:block" },
] as const;

/** Enough tiles per column that one copy of it is taller than the section. */
const MIN_PHOTOS_PER_COLUMN = 4;

/**
 * Spreads the photos across the columns round-robin, cycling through the
 * list again when there are too few photos to fill every column.
 */
function toColumns(photos: ColumnPhoto[]): ColumnPhoto[][] {
  const perColumn = Math.max(
    MIN_PHOTOS_PER_COLUMN,
    Math.ceil(photos.length / COLUMNS.length),
  );
  return COLUMNS.map((_, column) =>
    Array.from(
      { length: perColumn },
      (_, row) => photos[(column + row * COLUMNS.length) % photos.length],
    ),
  );
}

/**
 * Homepage teaser for the full /gallery page: gallery photos scroll
 * endlessly in columns behind the section, with the copy overlaid on a
 * cream gradient that keeps it readable.
 */
export async function GallerySection() {
  const items = await getGalleryItems();
  const photos: ColumnPhoto[] = items
    .filter((item) => item.type === "photo" && item.imageUrl)
    .map(({ id, imageUrl, width, height }) => ({
      id,
      imageUrl,
      width,
      height,
    }));
  if (photos.length === 0) return null;

  const columns = toColumns(photos);

  return (
    <section className="bg-cream relative h-[640px] overflow-hidden md:h-[720px]">
      {/* Background: scrolling photo columns, faded out at top and bottom */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex gap-4 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] px-4"
      >
        {COLUMNS.map((column, i) => (
          <PhotoColumn
            key={i}
            photos={columns[i]}
            duration={column.duration}
            className={cn("min-w-0 flex-1", column.className)}
          />
        ))}
      </div>

      {/* Gradient behind the copy: a centred band on mobile, solid on the
          left fading out to the right from tablet up */}
      <div
        aria-hidden
        className="from-cream/50 via-cream/90 to-cream/50 md:from-cream md:via-cream/75 md:to-cream/0 pointer-events-none absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r md:from-30% md:via-50% md:to-80%"
      />

      <div className="relative mx-auto flex h-full max-w-[1200px] items-center px-6">
        <FadeIn className="mx-auto max-w-md text-center md:mx-0 md:w-1/3 md:max-w-none md:text-left">
          <span className="font-script text-ink/70 text-lg">
            a glimpse into recap
          </span>
          <SectionHeading as="h2" className="mt-2">
            Our Gallery
          </SectionHeading>
          <p className="text-ink mt-4 font-serif text-lg leading-snug">
            A glimpse into the spaces, conversations, workshops, events and
            moments that define Recap.
          </p>
          <p className="text-body-gray mt-4 text-base leading-relaxed">
            Explore moments from counselling sessions, workshops, awareness
            programs, community initiatives and everyday experiences that
            reflect the warmth and purpose of Recap.
          </p>
          <div className="mt-8 flex justify-center md:justify-start">
            <Button href="/gallery" icon={<ArrowRight className="size-4" />}>
              View Full Gallery
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
