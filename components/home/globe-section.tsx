import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlobePolaroids } from "./globe-polaroids";

export function GlobeSection() {
  return (
    <section className="bg-cream px-6 py-20 md:py-24">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-10 md:flex-row md:items-start md:justify-between md:gap-6">
        <FadeIn className="max-w-sm text-center md:text-left">
          <span className="font-script text-ink/70 text-lg">
            a global perspective
          </span>
          <SectionHeading as="h2" className="mt-2">
            What psychologists <span className="text-accent-orange">around the world</span> have to say
          </SectionHeading>
        </FadeIn>

        <FadeIn delay={0.1} className="w-full max-w-sm md:mr-0 md:ml-auto">
          <GlobePolaroids linkHref="/downloads/recap-overview.pdf" />
        </FadeIn>
      </div>
    </section>
  );
}
