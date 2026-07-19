import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import SocialCards from "@/components/gallery/social-cards";
import { getGalleryItems } from "@/lib/wordpress/gallery";

/**
 * Homepage teaser for the full /gallery page — image-only preview of the
 * fan-of-cards SocialCards component (see components/gallery/social-cards.tsx),
 * auto-rotating instead of manually paginated.
 */
export async function GallerySection() {
  const items = await getGalleryItems();
  const photos = items.filter((item) => item.type === "photo");
  if (photos.length === 0) return null;

  const cards = photos.map((photo) => ({
    imgUrl: photo.imageUrl,
    alt: photo.title,
    linkUrl: "/gallery",
    width: photo.width,
    height: photo.height,
  }));

  return (
    <section className="bg-cream px-6 py-20 md:py-24">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10 md:flex-row md:items-center md:gap-8">
        <FadeIn className="text-center md:w-1/3 md:shrink-0 md:text-left">
          <span className="font-script text-ink/70 text-lg">a glimpse into recap</span>
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

        <FadeIn delay={0.1} className="min-w-0 md:w-2/3">
          <SocialCards
            cards={cards}
            showControls={false}
            autoRotate
            enableWheelNavigation
          />
        </FadeIn>
      </div>
    </section>
  );
}
