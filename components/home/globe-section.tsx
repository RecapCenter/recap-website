import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/ui/section-heading";
import { getCountries } from "@/lib/wordpress/around-the-world";
import { GlobePolaroids, type PolaroidMarker } from "./globe-polaroids";

/** Slight alternating tilts so neighbouring polaroids don't look stamped. */
const TILTS = [-5, 4, -3, 6, -4, 3];

export async function GlobeSection() {
  const countries = await getCountries();
  const markers: PolaroidMarker[] = countries.map((country, i) => ({
    id: `country-${country.id}`,
    location: country.location,
    image: country.coverImageUrl,
    caption: country.name,
    rotate: TILTS[i % TILTS.length],
    href: `/around-the-world/${country.slug}`,
  }));

  return (
    <section className="bg-cream px-6 py-20 md:py-24">
      {/* Desktop: heading in the left third, globe centred in the right two-thirds */}
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center justify-items-center gap-10 md:grid-cols-3 md:gap-6">
        <FadeIn className="max-w-sm text-center md:justify-self-start md:text-left">
          <span className="font-script text-ink/70 text-lg">
            a global perspective
          </span>
          <SectionHeading as="h2" className="mt-2">
            What psychologists{" "}
            <span className="text-accent-orange">around the world</span> have to
            say
          </SectionHeading>
        </FadeIn>

        {/* Mobile top margin reserves room for polaroids that rise above the
            globe's top edge, so they don't cover the heading while it spins. */}
        <FadeIn
          delay={0.1}
          className="mt-28 w-full max-w-sm md:col-span-2 md:mt-0"
        >
          <GlobePolaroids markers={markers} />
        </FadeIn>
      </div>
    </section>
  );
}
