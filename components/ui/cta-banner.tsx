import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";

type CTABannerProps = {
  eyebrow: string;
  heading: string;
  subtext: string;
  buttonLabel: string;
  buttonHref: string;
};

/**
 * Site-wide closing banner ("Set sail"): an open, full-width close with no
 * card. Watercolour waves, the gold line and the paper boat from the
 * homepage hero artwork run along the bottom, so every page ends on the
 * same imagery the homepage opens with, then flows into the dark footer.
 */
export function CTABanner({
  eyebrow,
  heading,
  subtext,
  buttonLabel,
  buttonHref,
}: CTABannerProps) {
  return (
    <section className="from-cream relative overflow-hidden bg-gradient-to-b to-[#f3ecdf] px-6 pt-20 pb-40 text-center md:pt-24 md:pb-44">
      <FadeIn className="relative mx-auto flex max-w-2xl flex-col items-center">
        <span className="font-script text-gold text-2xl md:text-3xl">
          {eyebrow}
        </span>
        <SectionHeading as="h2" className="mt-3">
          {heading}
        </SectionHeading>
        <p className="text-body-gray mt-4 max-w-xl text-base leading-relaxed">
          {subtext}
        </p>
        <Button
          href={buttonHref}
          icon={<ArrowRight className="size-4" />}
          className="mt-8"
        >
          {buttonLabel}
        </Button>
      </FadeIn>

      {/* Decorative sea: layered watercolour waves with the hero's gold line. */}
      <svg
        aria-hidden
        viewBox="0 0 1200 170"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[150px] w-full md:h-[170px]"
      >
        <path
          d="M0 70 C 200 30, 380 110, 600 70 S 1000 30, 1200 80 L1200 170 L0 170 Z"
          fill="var(--pastel-blue)"
          opacity="0.75"
        />
        <path
          d="M0 100 C 220 70, 420 140, 640 105 S 1020 70, 1200 110 L1200 170 L0 170 Z"
          fill="var(--pastel-peach)"
          opacity="0.45"
        />
        <path
          d="M0 128 C 240 104, 460 160, 700 132 S 1040 110, 1200 138 L1200 170 L0 170 Z"
          fill="#c9d9e8"
          opacity="0.9"
        />
        <path
          d="M0 96 C 260 60, 470 150, 720 100 S 1040 60, 1200 96"
          fill="none"
          stroke="var(--gold)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Paper boat riding the waves; holds still for reduced-motion users. */}
      <svg
        aria-hidden
        viewBox="0 0 80 56"
        className="animate-bob pointer-events-none absolute bottom-[70px] left-[8%] w-14 motion-reduce:animate-none md:bottom-[78px] md:left-[14%] md:w-[74px]"
      >
        <path
          d="M6 36 L74 36 L62 50 L18 50 Z"
          fill="none"
          stroke="var(--gold)"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M22 36 L40 6 L58 36 M40 6 L40 36 M31 21 L40 36 L49 21"
          fill="none"
          stroke="var(--gold)"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    </section>
  );
}
