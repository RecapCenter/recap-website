import type { Metadata } from "next";
import { AboutHeroSection } from "@/components/about/hero-section";
import { OurStorySection } from "@/components/about/our-story-section";
import { ValuesSection } from "@/components/about/values-section";
import { Timeline } from "@/components/about/timeline";
import { FounderSection } from "@/components/about/founder-section";
import { CTABanner } from "@/components/ui/cta-banner";

export const metadata: Metadata = {
  title: "About — Recap",
  description:
    "Recap — Realm of Counselling and Psychological Services — was created with a simple belief: people do not always need to be fixed; sometimes, they need to be understood differently.",
};

export default function AboutPage() {
  return (
    <main>
      <AboutHeroSection />
      <OurStorySection />
      <ValuesSection />
      <Timeline />
      <FounderSection />
      <CTABanner
        eyebrow="before you go"
        heading="Say hi. We'll write back like a real human."
        subtext="Whether you're a parent, an educator, or someone quietly wondering — there's a chair here for you."
        buttonLabel="Get in touch"
        buttonHref="/contact"
      />
    </main>
  );
}
