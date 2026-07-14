import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/page-intro";
import { CTABanner } from "@/components/ui/cta-banner";
import { FreebiesGrid } from "@/components/freebies/freebies-grid";
import { getFreebies } from "@/lib/wordpress/freebies";
import freebieIcon from "@/assets/icons/freebie-logo.svg";

export const metadata: Metadata = {
  title: "Freebies — Recap",
  description:
    "Free, downloadable resources from Recap — worksheets, guides, and printables for parents, educators, and anyone raising or supporting a child.",
};

export default async function FreebiesPage() {
  const freebies = await getFreebies();

  return (
    <main>
      <PageIntro
        icon={freebieIcon}
        iconBg="var(--pastel-blue)"
        eyebrow="on the house"
        heading="A few things, free."
        subtext="Worksheets, guides, and printables we've put together along the way — yours to keep, no strings attached."
        size="compact"
      />
      <FreebiesGrid freebies={freebies} />
      <CTABanner
        eyebrow="want more?"
        heading="Want more resources like this?"
        subtext="Tell us what would help — we're always adding to this shelf."
        buttonLabel="Get in touch"
        buttonHref="/contact"
      />
    </main>
  );
}
