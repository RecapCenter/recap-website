import type { Metadata } from "next";
import { ComingSoonHero } from "@/components/recap-lab/coming-soon-hero";
import { PreviewTiles } from "@/components/recap-lab/preview-tiles";
import { NotifyForm } from "@/components/recap-lab/notify-form";
import { NEWSLETTER_ENABLED } from "@/lib/features";
import { CTABanner } from "@/components/ui/cta-banner";
import { FollowAlong } from "@/components/ui/follow-along";

export const metadata: Metadata = {
  title: "Recap Lab — Recap",
  alternates: { canonical: "/recap-lab" },
  description:
    "Recap Lab is coming soon — assessments, quizzes, and resources to help you understand yourself and the children in your life a little better.",
};

export default function RecapLabPage() {
  return (
    <main>
      <ComingSoonHero />
      <PreviewTiles />
      {NEWSLETTER_ENABLED ? (
        <>
          <NotifyForm />
          <CTABanner
            eyebrow="have a thought?"
            heading="Something you'd like Recap Lab to include?"
            subtext="Tell us what would help — we're building it with you in mind."
            buttonLabel="Get in touch"
            buttonHref="/contact"
          />
        </>
      ) : (
        <CTABanner
          eyebrow="coming soon"
          heading="Get notified when Recap Lab opens."
          subtext="Follow Recap on WhatsApp and we'll let you know the moment it's ready."
          actions={<FollowAlong variant="light" />}
        />
      )}
    </main>
  );
}
