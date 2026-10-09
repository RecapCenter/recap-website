import type { Metadata } from "next";
import { Scale } from "lucide-react";
import { PageIntro } from "@/components/ui/page-intro";
import { FadeIn } from "@/components/motion/fade-in";

export const metadata: Metadata = {
  title: "Terms of Service — Recap",
  alternates: { canonical: "/terms" },
  description:
    "The terms that govern using the Recap website and working with us.",
};

const SECTIONS = [
  {
    title: "Who we are",
    body: [
      "This website, recapcenter.com, is run by Recap (Realm of Counselling and Psychological Services). You can reach us at hello@recapcenter.com.",
    ],
  },
  {
    title: "Accepting these terms",
    body: [
      "By using this website, you're agreeing to these terms and to our Privacy Policy, which explains how we handle your information. If something here doesn't sit right with you, write to us before you continue — we're happy to talk it through.",
      "If you're under 18, please use the site with a parent, guardian or teacher.",
    ],
  },
  {
    title: "Not a substitute for emergency care",
    body: [
      "Recap offers counselling, special education support, and training — not crisis intervention, and our inbox isn't monitored around the clock. If you or someone you know is in immediate danger, call 112 (India) or your local emergency number. For urgent emotional support in India, call Tele-MANAS on 14416, free and available 24/7.",
    ],
  },
  {
    title: "General information, not professional advice",
    body: [
      "Our blog posts, free resources, recommendations and other content are for general information and reflection. They aren't a diagnosis, treatment or professional advice for your particular situation, and reading them doesn't make you a client. For support that fits your circumstances, please get in touch so we can talk it through properly.",
      "Reviews and stories on this site describe individual experiences. Everyone's path is different, so they aren't a promise of any particular outcome.",
    ],
  },
  {
    title: "Using this site",
    body: [
      "This website is here to help you learn about Recap and get in touch. Please don't use it in a way that could harm or disrupt the site or its visitors — for example by sending spam or automated submissions through our forms, trying to access parts of the site you aren't meant to, or pretending to be someone else.",
    ],
  },
  {
    title: "Free resources",
    body: [
      "You're welcome to download our free resources and use them for yourself, your family, your classroom or your own practice. Please don't sell them, or republish them as your own, without asking us first.",
    ],
  },
  {
    title: "Booking sessions",
    body: [
      "Details about scheduling, fees, rescheduling and cancellations for sessions are agreed directly with you before any work begins — this website only covers browsing and contacting us. Getting in touch doesn't commit you to anything.",
    ],
  },
  {
    title: "Intellectual property",
    body: [
      "The words, illustrations, photographs and design on this site belong to Recap unless otherwise noted. You're welcome to share a link to any page, but please don't reproduce our content elsewhere without asking first.",
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
    title: "Governing law",
    body: [
      "These terms are governed by the laws of India.",
    ],
  },
  {
    title: "Changes to these terms",
    body: [
      "We may update these terms from time to time as Recap grows. If we do, we'll update the date at the top — continuing to use the site after that means you accept the changes.",
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
          <p className="text-body-gray text-sm italic">Last updated: October 2026</p>

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
