import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { PageIntro } from "@/components/ui/page-intro";
import { FadeIn } from "@/components/motion/fade-in";

export const metadata: Metadata = {
  title: "Privacy Policy — Recap",
  description:
    "How Recap collects, uses, and protects your information — in plain language.",
};

const SECTIONS = [
  {
    title: "What we collect",
    body: [
      "When you write to us through the contact form, we collect what you choose to share — your name, email, phone number, and message. If you subscribe to the slow letter, we collect your email address to send it.",
      "We use Google Analytics to understand how people use the site — which pages are visited, roughly where visitors are (country or city, never a street address), and what kind of device they're on. We use this only in aggregate, to see what's working and what to improve; we don't use it to identify you.",
    ],
  },
  {
    title: "How we use it",
    body: [
      "We use what you share to reply to your message, schedule sessions, and send the slow letter if you've asked for it. We don't use your information for anything you haven't agreed to, and we don't run targeted advertising.",
      "Every slow letter includes a link to unsubscribe, and you can also unsubscribe at any time from our unsubscribe page. If you tell us why you're leaving, we keep that note only to help us improve the newsletter.",
    ],
  },
  {
    title: "Who we share it with",
    body: [
      "We don't sell or rent your information, ever. We share it only with the tools that help us run Recap, and only as much as each one needs to do its job: Google Workspace (our email, which receives contact form messages), MailPoet (which stores the slow letter's subscriber list and sends it), and Google Analytics (site traffic, as described above).",
    ],
  },
  {
    title: "Cookies",
    body: [
      "The only cookies on this site are set by Google Analytics, to count visits and tell new visitors from returning ones. We don't use advertising or tracking cookies beyond that. You can block cookies in your browser, or install Google's opt-out add-on (tools.google.com/dlpage/gaoptout), and the site will work exactly the same.",
    ],
  },
  {
    title: "How long we keep it",
    body: [
      "We keep contact form messages and session records for as long as they're useful to your care or our records, and no longer than we're required to. You can ask us to delete your information at any time — see below.",
    ],
  },
  {
    title: "Children's privacy",
    body: [
      "Recap works with children as part of our counselling and special education services, always with a parent or guardian's involvement and consent. We never collect information directly from a child without that involvement.",
    ],
  },
  {
    title: "Your rights",
    body: [
      "You can ask us, at any time, what information we hold about you, to correct it, or to delete it. Write to us at hello@recapcenter.com and we'll take care of it personally — usually within a few days.",
    ],
  },
  {
    title: "Changes to this policy",
    body: [
      "If this policy changes in a meaningful way, we'll update this page and note the date below. We won't make quiet changes that reduce your rights.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main>
      <PageIntro
        icon={<ShieldCheck className="text-ink size-7" />}
        iconBg="var(--pastel-blue)"
        eyebrow="your data, respected"
        heading="Privacy Policy"
        subtext="The short version: we collect only what we need, we never sell it, and you can always ask us to delete it."
        size="full"
      />

      <section className="bg-cream px-6 py-20 md:py-24">
        <FadeIn className="mx-auto flex max-w-3xl flex-col gap-12">
          <p className="text-body-gray text-sm italic">
            Last updated: September 2026
          </p>

          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h2 className="text-ink font-serif text-2xl md:text-3xl">
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
            <h2 className="text-ink font-serif text-2xl md:text-3xl">
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
              — a real person reads every message.
            </p>
          </div>
        </FadeIn>
      </section>
    </main>
  );
}
