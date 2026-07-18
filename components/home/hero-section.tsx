import { getImageProps } from "next/image";
import { FadeIn } from "@/components/motion/fade-in";
import heroDesktop from "@/assets/images/home/hero-desktop.webp";
import heroTablet from "@/assets/images/home/hero-tablet.webp";
import heroMobile from "@/assets/images/home/hero-mobile.webp";

/*
 * The hero is three separately art-directed final artworks (desktop,
 * tablet, mobile) rendered via <picture> so the browser downloads only
 * the composition for the active breakpoint. The heading text is baked
 * into the artwork; a visually hidden <h1> carries the semantics.
 */
export function HeroSection() {
  const shared = {
    alt: "",
    sizes: "100vw",
    quality: 90,
    priority: true,
  } as const;
  const { props: desktop } = getImageProps({ ...shared, src: heroDesktop });
  const { props: tablet } = getImageProps({ ...shared, src: heroTablet });
  const { props: mobile } = getImageProps({ ...shared, src: heroMobile });

  return (
    <section className="relative overflow-hidden">
      <h1 className="sr-only">
        Realm of Counselling &amp; Psychological Services
      </h1>
      <p className="sr-only">From managing chaos to developing perspective.</p>

      <FadeIn>
        <picture>
          <source
            media="(max-width: 767px)"
            srcSet={mobile.srcSet}
            width={mobile.width}
            height={mobile.height}
          />
          <source
            media="(max-width: 1023px)"
            srcSet={tablet.srcSet}
            width={tablet.width}
            height={tablet.height}
          />
          {/* eslint-disable-next-line jsx-a11y/alt-text -- alt="" comes via getImageProps */}
          <img {...desktop} aria-hidden className="block h-auto w-full" />
        </picture>
      </FadeIn>
    </section>
  );
}
