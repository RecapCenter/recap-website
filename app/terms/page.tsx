import type { Metadata } from "next";
import { Scale } from "lucide-react";
import { PageIntro } from "@/components/ui/page-intro";
import { FadeIn } from "@/components/motion/fade-in";

export const metadata: Metadata = {
  title: "Terms of Service — Recap",
  description:
    "The terms that govern using the Recap website and working with us.",
};

const SECTIONS = [
  {
    title: "Accepting these terms",
    body: [
      "By using this website, you're agreeing to these terms. If something here doesn't sit right with you, write to us before you continue — we're happy to talk it through.",
    ],
  },
  {
    title: "Using this site",
    body: [
      "This website is here to help you learn about Recap and get in touch. Please don't use it in a way that could disrupt the site, misrepresent who you are, or copy our content for your own commercial use.",
    ],
  },
  {
    title: "Not a substitute for emergency care",
    body: [
      "Recap offers counselling, special education support, and training — not crisis intervention. If you or someone you know is in immediate danger, please contact local emergency services or a crisis helpline right away rather than writing to us.",
    ],
  },
  {
    title: "Booking sessions",
    body: [
      "Details about scheduling, fees, and cancellations for actual sessions are agreed directly with your therapist or coordinator once you get in touch — this website only covers the terms of browsing and contacting us.",
    ],
  },
  {
    title: "Intellectual property",
    body: [
      "The words, illustrations, and design on this site belong to Recap unless otherwise noted. You're welcome to share a link to a page, but please don't reproduce our content elsewhere without asking first.",
    ],
  },
  {
    title: "Links to other sites",
    body: [
      "Where we link out to something we think is useful, we can't take responsibility for that site's content or how it handles your information — its own terms and privacy policy apply.",
    ],
  },
  {
    title: "Limitation of liability",
    body: [
      "We do our best to keep this site accurate and running smoothly, but we can't guarantee it will always be error-free or uninterrupted, and we're not liable for issues arising from its use beyond what the law requires.",
    ],
  },
  {
    title: "Changes to these terms",
    body: [
      "We may update these terms from time to time as Recap grows. If we do, we'll update the date below — continuing to use the site after that means you accept the changes.",
    ],
  },
];

export default function TermsPage() {
  return (
    <main>
      <PageIntro
        icon={<Scale className="text-ink size-7" />}
        iconBg="var(--pastel-lavender)"
        eyebrow="the fine print"
        heading="Terms of Service"
        subtext="Written as plainly as we can manage. It covers using this website — sessions themselves are agreed separately, person to person."
        size="full"
      />

      <section className="bg-cream px-6 py-20 md:py-24">
        <FadeIn className="mx-auto flex max-w-3xl flex-col gap-12">
          <p className="text-body-gray text-sm italic">Last updated: July 2026</p>

          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h2 className="font-serif text-ink text-2xl md:text-3xl">
                {section.title}
              </h2>
              <div className="text-body-gray mt-3 flex flex-col gap-3 text-base leading-relaxed">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          ))}

          <div>
            <h2 className="font-serif text-ink text-2xl md:text-3xl">
              Questions?
            </h2>
            <p className="text-body-gray mt-3 text-base leading-relaxed">
              Write to us at{" "}
              <a
                href="mailto:hello@recapcenter.com"
                className="text-accent-orange underline underline-offset-2"
              >
                hello@recapcenter.com
              </a>{" "}
              and we&rsquo;ll help however we can.
            </p>
          </div>
        </FadeIn>
      </section>
    </main>
  );
}
