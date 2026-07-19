import Image from "next/image";
import { FadeIn } from "@/components/motion/fade-in";
import { IconBadge } from "@/components/ui/icon-badge";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { SectionHeading, HighlightMark } from "@/components/ui/section-heading";
import { DecorativeBlob } from "@/components/ui/decorative-blob";
import recapLabIcon from "@/assets/icons/recap-lab-logo.svg";

export function ComingSoonHero() {
  return (
    <section
      className="relative overflow-hidden px-6 py-24 text-center md:py-32"
      style={{
        background:
          "radial-gradient(120% 100% at 50% 20%, #fde9d3 0%, #f7b98e 55%, #f9c9a0 100%)",
      }}
    >
      <DecorativeBlob
        color="#c9b8da"
        size={360}
        className="top-[-10%] left-[-10%]"
      />
      <DecorativeBlob
        color="#f0c368"
        size={360}
        className="top-[-5%] right-[-10%]"
      />

      <FadeIn className="relative mx-auto max-w-2xl">
        <div className="flex justify-center">
          <IconBadge bg="var(--accent-orange)" size="lg">
            <Image
              src={recapLabIcon}
              alt=""
              width={28}
              height={28}
              className="h-7 w-auto object-contain"
            />
          </IconBadge>
        </div>
        <div className="mt-4">
          <EyebrowLabel withDottedLines>coming soon</EyebrowLabel>
        </div>
        <SectionHeading as="h1" className="mt-3">
          Something thoughtful is <HighlightMark color="orange">brewing</HighlightMark>.
        </SectionHeading>
        <p className="text-body-gray mx-auto mt-6 max-w-xl text-base leading-relaxed">
          Recap Lab is where we&apos;re building assessments, quizzes, and
          resources to help you understand yourself — and the children in
          your life — a little better.
        </p>
      </FadeIn>
    </section>
  );
}
