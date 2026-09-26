import Image from "next/image";
import { FadeIn } from "@/components/motion/fade-in";
import { DecorativeBlob } from "@/components/ui/decorative-blob";
import { SectionHeading, HighlightMark } from "@/components/ui/section-heading";
import founderPhoto from "@/assets/images/about/founder-photo.webp";

/**
 * Founder-led About hero: Riya's arch portrait beside the headline, so the
 * page opens on the person behind Recap. This is the page's only founder
 * photo — the founder section further down is text and quote only.
 */
export function AboutHeroSection() {
  return (
    <section
      className="relative overflow-hidden px-6 pt-[calc(var(--nav-height)+3rem)] pb-16 md:pt-[calc(var(--nav-height)+4rem)] md:pb-24"
      style={{
        background:
          "radial-gradient(90% 90% at 80% 10%, #fdf1c9 0%, var(--cream) 60%)",
      }}
    >
      <DecorativeBlob
        color="#c9b8da"
        size={380}
        className="top-[-10%] left-[-10%]"
      />

      <div className="relative mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] md:gap-16">
        <FadeIn className="relative mx-auto w-full max-w-[360px]">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-t-full rounded-b-2xl border-[6px] border-white shadow-[0_14px_40px_rgba(42,32,25,0.14)]">
            <Image
              src={founderPhoto}
              alt="Riya Kapoor, founder of Recap"
              fill
              priority
              sizes="(min-width: 768px) 360px, 80vw"
              className="object-cover"
            />
          </div>
          <span className="font-script text-ink bg-pastel-yellow-light absolute bottom-4 left-1/2 -translate-x-1/2 -rotate-3 rounded-md px-4 py-1.5 text-xl whitespace-nowrap shadow-sm">
            meet Riya, our founder
          </span>
        </FadeIn>

        <FadeIn delay={0.1}>
          <span className="font-script text-ink/70 text-2xl md:text-3xl">
            about recap
          </span>
          <SectionHeading as="h1" className="mt-3">
            A space to understand. A space to grow. A space to{" "}
            <HighlightMark>begin again.</HighlightMark>
          </SectionHeading>
          <p className="text-body-gray mt-6 max-w-xl text-base leading-relaxed">
            Recap — Realm of Counselling and Psychological Services — was
            created with a simple belief: people do not always need to be fixed;
            sometimes, they need to be understood differently.
          </p>
          <div className="mt-8">
            <p className="text-ink font-serif text-xl">Riya Kapoor</p>
            <p className="text-body-gray mt-1 text-sm">
              Counselling Psychologist · Special Educator · Researcher ·
              Educator
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
