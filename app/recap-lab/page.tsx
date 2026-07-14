import type { Metadata } from "next";
import { ComingSoonHero } from "@/components/recap-lab/coming-soon-hero";
import { PreviewTiles } from "@/components/recap-lab/preview-tiles";
import { NotifyForm } from "@/components/recap-lab/notify-form";
import { CTABanner } from "@/components/ui/cta-banner";

export const metadata: Metadata = {
  title: "Recap Lab — Recap",
  description:
    "Recap Lab is coming soon — assessments, quizzes, and resources to help you understand yourself and the children in your life a little better.",
};

export default function RecapLabPage() {
  return (
    <main>
      <ComingSoonHero />
      <PreviewTiles />
      <NotifyForm />
      <CTABanner
        eyebrow="want early access?"
        heading="Want early access? Tell us."
        subtext="We'll reach out the moment there's something to try."
        buttonLabel="Get in touch"
        buttonHref="/contact"
      />
    </main>
  );
}
