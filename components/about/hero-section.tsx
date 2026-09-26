import { FadeIn } from "@/components/motion/fade-in";
import { DecorativeBlob } from "@/components/ui/decorative-blob";
import {
  SectionHeading,
  HighlightMark,
  DashedArrow,
} from "@/components/ui/section-heading";

export function AboutHeroSection() {
  return (
    <section
      className="relative overflow-hidden px-6 pt-[calc(var(--nav-height)+6rem)] pb-24 text-center md:pt-[calc(var(--nav-height)+8rem)] md:pb-32"
      style={{
        background:
          "radial-gradient(120% 100% at 50% 20%, #fdf6d8 0%, #f7de8e 55%, #f9e9a0 100%)",
      }}
    >
      <DecorativeBlob
        color="#c9b8da"
        size={380}
        className="top-[-10%] left-[-10%]"
      />
      <DecorativeBlob
        color="#f0a98c"
        size={380}
        className="top-[-5%] right-[-10%]"
      />

      <FadeIn className="relative mx-auto max-w-3xl">
        <span className="font-script text-ink/70 text-xl">about recap</span>
        <SectionHeading as="h1" className="mt-3">
          A space to understand. A space to grow. A space to{" "}
          <HighlightMark>begin again.</HighlightMark>
        </SectionHeading>
        <p className="text-body-gray mx-auto mt-6 max-w-2xl text-base leading-relaxed">
          Recap — Realm of Counselling and Psychological Services — was created
          with a simple belief: people do not always need to be fixed;
          sometimes, they need to be understood differently.
        </p>
        <div className="mt-10 flex items-center justify-center gap-2">
          <span className="font-script text-ink/70 text-base">
            keep scrolling
          </span>
          <DashedArrow className="h-6 w-12" />
        </div>
      </FadeIn>
    </section>
  );
}
