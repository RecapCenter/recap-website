import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlobePolaroids } from "./globe-polaroids";

export function GlobeSection() {
  return (
    <section className="bg-white px-6 py-20 md:py-24">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-10 md:flex-row md:justify-between md:gap-6">
        <FadeIn className="max-w-sm text-center md:text-left">
          <SectionHeading as="h2">
            What world psychologists have to say
          </SectionHeading>
        </FadeIn>

        <FadeIn delay={0.1} className="w-full max-w-md md:ml-auto md:mr-0">
          <GlobePolaroids linkHref="/downloads/recap-overview.pdf" />
        </FadeIn>
      </div>
    </section>
  );
}
