import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { PageIntro } from "@/components/ui/page-intro";
import { FadeIn } from "@/components/motion/fade-in";
import { NEWSLETTER_ENABLED } from "@/lib/features";

export const metadata: Metadata = {
  title: "Privacy Policy — Recap",
  alternates: { canonical: "/privacy" },
  description:
    "How Recap collects, uses, and protects your information — in plain language.",
};

const SECTIONS = [
  {
    title: "Who we are",
    body: [
      'Recap (Realm of Counselling and Psychological Services) runs this website at recapcenter.com. When this policy says "we" or "us", it means Recap. If you have any question about your information, write to us at hello@recapcenter.com.',
    ],
  },
  {
    title: "What we collect",
    body: [
      "Contact form: your name, email address, phone number, what you're reaching out about, your message, and your confirmation that we may reply to you.",
      ...(NEWSLETTER_ENABLED
        ? [
            "The slow letter: your email address, when you signed up, and whether you're subscribed. Our newsletter tool may also record whether a letter was opened and which links were clicked, so we know what's useful.",
            "Unsubscribing: if you use our unsubscribe page, your email address, the reason you chose and any note you add.",
          ]
        : []),
      "Visiting the site: like every website, our hosting and security providers automatically process technical information such as your IP address, browser type and the pages requested, to deliver the site and protect it from abuse. If Google Analytics is switched on, it also records which pages are visited, your approximate location (country or city) and the type of device you use.",
      "We don't ask for, and you don't need to share, medical details, a diagnosis or information about anyone else to contact us. If you choose to include something sensitive, we treat it with the same care as everything shared in a session.",
    ],
  },
  {
    title: "How we use it",
    body: [
      `We use your information only to reply to you and arrange support you've asked about, ${NEWSLETTER_ENABLED ? "to send the slow letter if you've subscribed, " : ""}to understand and improve how the site is used, and to keep the site secure and free of spam.`,
      "We don't sell or rent your information, we don't use it for advertising, and we don't make automated decisions about you.",
    ],
  },
  {
    title: "Who handles it on our behalf",
    body: [
      "We use a small number of trusted services to run Recap. Each one handles only what it needs to do its job:",
      NEWSLETTER_ENABLED
        ? "Google Workspace receives contact form messages in our email and may send the slow letter. Vercel hosts this website and processes your requests to it. GoDaddy hosts the system where we manage our content, newsletter subscribers and unsubscribe notes, and Cloudflare protects it. MailPoet manages the slow letter's subscriber list and sends it. Google Analytics, if switched on, measures site traffic."
        : "Google Workspace receives contact form messages in our email. Vercel hosts this website and processes your requests to it. GoDaddy hosts the system where we manage our content, and Cloudflare protects it. Google Analytics, if switched on, measures site traffic.",
      "These services may store or process information on servers outside India, under their own security and privacy commitments. We'll only share your information beyond them if the law requires it, or to protect someone's safety.",
    ],
  },
  {
    title: "Cookies",
    body: [
      "This site doesn't use advertising cookies. If Google Analytics is switched on, it sets cookies to count visits and tell new visitors from returning ones. You can block cookies in your browser, or install Google's opt-out add-on (tools.google.com/dlpage/gaoptout), and the site will work exactly the same.",
      "Videos in our gallery play through YouTube's privacy-enhanced mode or Vimeo with tracking turned off, and they only load once you press play.",
    ],
  },
  {
    title: "Other websites",
    body: [
      "We show reviews published on Google, along with the reviewer's public name. We also link to other sites, such as books and videos we recommend, and our Instagram, LinkedIn and WhatsApp pages. When you visit them, their own privacy policies apply.",
    ],
  },
  {
    title: "How long we keep it",
    body: [
      `${NEWSLETTER_ENABLED ? "Contact messages and unsubscribe notes" : "Contact messages"}: we keep these in our records so we can follow up and look back on our conversations, and we don't delete them on a fixed schedule. You can ask us to delete yours at any time, and we will. If you become a client, your information is kept as part of your client record, as we'll explain when we begin working together.`,
      ...(NEWSLETTER_ENABLED
        ? [
            "The slow letter: until you unsubscribe. After that we keep just your email address on a do-not-send list, so you're never emailed again by mistake.",
          ]
        : []),
      "Analytics data: deleted automatically after the period set in Google Analytics. Technical logs: kept briefly by our hosting providers for security.",
    ],
  },
  {
    title: "Keeping it safe",
    body: [
      "The site and our content system are served only over encrypted (https) connections. Access to messages and subscriber information is limited to the Recap team, and the accounts that hold it are protected with strong, unique passwords and two-step verification.",
    ],
  },
  {
    title: "Children and young people",
    body: [
      `Recap works with children and young people as part of our counselling and special education services, always with a parent or guardian's involvement and consent. The contact form${NEWSLETTER_ENABLED ? " and newsletter are" : " is"} meant for adults; if you're under 18, please ask a parent, guardian or teacher to get in touch with us for you. If we learn that a child has sent us information without that involvement, we'll delete it or reach out to the adults responsible for them.`,
    ],
  },
  {
    title: "Your rights",
    body: [
      `You can ask us, at any time, what information we hold about you, to correct it, or to delete it, and you can withdraw your consent${NEWSLETTER_ENABLED ? ", for example by unsubscribing from the slow letter" : ""}. Write to us at hello@recapcenter.com. We'll reply personally, usually within a few days and always within 30 days.`,
      "If you're unhappy with how we've handled your information, tell us at the same address and we'll do our best to put it right.",
    ],
  },
  {
    title: "Changes to this policy",
    body: [
      "If this policy changes in a meaningful way, we'll update this page and the date at the top. We won't make quiet changes that reduce your rights.",
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
            Last updated: October 2026
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
