import type { Metadata } from "next";
import { HelpCircle } from "lucide-react";
import { PageIntro } from "@/components/ui/page-intro";
import { FAQAccordion } from "@/components/ui/faq-accordion";
import { CTABanner } from "@/components/ui/cta-banner";
import { FadeIn } from "@/components/motion/fade-in";
import { FAQS, PRACTICAL_FAQS } from "@/lib/faqs";

export const metadata: Metadata = {
  title: "FAQ — Recap",
  alternates: { canonical: "/faq" },
  description:
    "Answers to the questions we hear most often about Recap's services, who we work with, and what happens when you first get in touch.",
};

export default function FAQPage() {
  return (
    <main>
      <PageIntro
        icon={<HelpCircle className="text-ink size-7" />}
        iconBg="var(--pastel-blue)"
        eyebrow="still curious?"
        heading="Frequently asked questions"
        subtext="Answers to what we hear most often. Can't find yours here? Just write in — we read every message."
        size="full"
      />

      <section className="bg-cream px-6 py-20 md:py-24">
        <FadeIn className="mx-auto max-w-3xl">
          <FAQAccordion items={[...FAQS, ...PRACTICAL_FAQS]} />
        </FadeIn>
      </section>

      <CTABanner
        eyebrow="still have questions?"
        heading="Write in. We read every message."
        subtext="No forms, no diagnosis needed — just a real conversation about what would actually help."
        buttonLabel="Get in touch"
        buttonHref="/contact"
      />
    </main>
  );
}
