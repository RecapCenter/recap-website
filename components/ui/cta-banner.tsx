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

export function CTABanner({
  eyebrow,
  heading,
  subtext,
  buttonLabel,
  buttonHref,
}: CTABannerProps) {
  return (
    <section className="bg-cream px-6 py-20 md:py-24">
      <FadeIn
        className="relative mx-auto max-w-[1200px] overflow-hidden rounded-[2.5rem] px-8 py-12 md:px-14 md:py-16"
        style={{
          background: "linear-gradient(135deg, #fde9a0 0%, #f7d15a 100%)",
        }}
      >
        <div
          className="border-accent-orange/50 pointer-events-none absolute right-6 -bottom-10 size-40 rounded-full border-2 md:size-48"
          aria-hidden
        />
        <div
          className="border-accent-orange/40 pointer-events-none absolute right-16 -bottom-16 size-36 rounded-full border-2 border-dashed md:size-44"
          aria-hidden
        />

        <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <span className="font-script text-ink/70 text-lg">{eyebrow}</span>
            <SectionHeading as="h2" className="mt-2">
              {heading}
            </SectionHeading>
            <p className="text-ink/70 mt-3 text-base">{subtext}</p>
          </div>
          <Button
            href={buttonHref}
            icon={<ArrowRight className="size-4" />}
            className="shrink-0"
          >
            {buttonLabel}
          </Button>
        </div>
      </FadeIn>
    </section>
  );
}
