import { FadeIn } from "@/components/motion/fade-in";
import {
  SectionHeading,
  HighlightMark,
  CircleAnnotation,
  DashedArrow,
} from "@/components/ui/section-heading";

export function AboutHeroSection() {
  return (
    <section
      className="px-6 py-24 text-center md:py-32"
      style={{
        background:
          "radial-gradient(120% 100% at 50% 20%, #fdf6d8 0%, #f7de8e 55%, #f9e9a0 100%)",
      }}
    >
      <FadeIn className="mx-auto max-w-3xl">
        <span className="font-script text-xl text-ink/70">hello, we are</span>
        <SectionHeading as="h1" className="mt-3">
          <CircleAnnotation>Recap</CircleAnnotation> — a space for{" "}
          <HighlightMark>honest</HighlightMark> conversations.
        </SectionHeading>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-body-gray">
          A counselling &amp; learning practice built around one small,
          stubborn idea: that children, families, and educators deserve
          support that feels less like a waiting room and more like a warm
          kitchen table.
        </p>
        <div className="mt-10 flex items-center justify-center gap-2">
          <span className="font-script text-base text-ink/70">
            keep scrolling
          </span>
          <DashedArrow className="h-6 w-12" />
        </div>
      </FadeIn>
    </section>
  );
}
