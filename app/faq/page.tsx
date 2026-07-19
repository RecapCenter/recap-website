import type { Metadata } from "next";
import { HelpCircle } from "lucide-react";
import { PageIntro } from "@/components/ui/page-intro";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { SectionHeading } from "@/components/ui/section-heading";
import { FAQAccordion } from "@/components/ui/faq-accordion";
import { CTABanner } from "@/components/ui/cta-banner";
import { FadeIn } from "@/components/motion/fade-in";

export const metadata: Metadata = {
  title: "FAQ — Recap",
  description:
    "Answers to the questions we hear most often about sessions, privacy, and working with Recap.",
};

type FAQGroup = {
  label: string;
  heading: string;
  items: { question: string; answer: string }[];
};

const GROUPS: FAQGroup[] = [
  {
    label: "getting started",
    heading: "Getting started",
    items: [
      {
        question: "How do I know which service is right for me?",
        answer:
          "You don't have to know before you write in — tell us what's going on and we'll point you the right way. Most families start with a quick chat, not a decision.",
      },
      {
        question: "Are sessions online, in-person, or both?",
        answer:
          "Both — whatever fits your life better. Most families start online and decide from there.",
      },
      {
        question: "How soon will I hear back after I reach out?",
        answer:
          "Usually within 48 hours. If it's urgent, say so in your message and we'll try to move faster.",
      },
      {
        question: "Do you work directly with schools?",
        answer:
          "Yes — both through special education support and trainings for staff. We're used to working alongside teachers and IEP teams.",
      },
    ],
  },
  {
    label: "sessions & support",
    heading: "Sessions & support",
    items: [
      {
        question: "Are sessions covered by insurance?",
        answer:
          "It depends on your provider. Write in and we'll help you figure out what's possible.",
      },
      {
        question: "How long does support usually last?",
        answer:
          "There's no fixed timeline. Some families come for a few sessions, others for longer — we go at your pace.",
      },
      {
        question: "What if I'm not sure what I need yet?",
        answer:
          "That's completely fine — most people who write in start exactly there. We'll figure it out together.",
      },
    ],
  },
  {
    label: "privacy & trust",
    heading: "Privacy & trust",
    items: [
      {
        question: "Is my message confidential?",
        answer: "Yes. Whatever you share with us stays between us, always.",
      },
      {
        question: "How do you handle my personal data?",
        answer:
          "Carefully, and only for what it's needed for. See our Privacy Policy for the full details, or write in if you'd rather just ask.",
      },
    ],
  },
];

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
        <div className="mx-auto flex max-w-3xl flex-col gap-14">
          {GROUPS.map((group) => (
            <div key={group.label}>
              <FadeIn>
                <EyebrowLabel color="orange">{group.label}</EyebrowLabel>
                <SectionHeading as="h3" className="mt-2">
                  {group.heading}
                </SectionHeading>
              </FadeIn>
              <FadeIn delay={0.1} className="mt-6">
                <FAQAccordion items={group.items} />
              </FadeIn>
            </div>
          ))}
        </div>
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
