import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/page-intro";
import { Card } from "@/components/ui/card";
import { UnsubscribeForm } from "@/components/newsletter/unsubscribe-form";
import { EMAIL_RE, UNSUBSCRIBE_TOKEN_RE } from "@/lib/validation/contact";

export const metadata: Metadata = {
  title: "Unsubscribe — Recap",
  description: "Unsubscribe from the slow letter, Recap's newsletter.",
  // Reached only from the link in each newsletter; keep it out of search results.
  robots: { index: false, follow: false },
};

/**
 * Newsletter unsubscribe page. Every slow letter links here through the
 * MailPoet shortcode [custom:recap_unsubscribe_url] as
 * /unsubscribe?email=…&token=…, where the token is a signature WordPress
 * makes for that address. Without a valid-looking pair there's nothing to
 * submit: the address can't be typed in by hand, so nobody can unsubscribe
 * someone else.
 */
export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; token?: string }>;
}) {
  const { email = "", token = "" } = await searchParams;
  const hasLink =
    EMAIL_RE.test(email.trim()) && UNSUBSCRIBE_TOKEN_RE.test(token.trim());

  return (
    <main>
      <PageIntro
        eyebrow="the slow letter"
        heading="Unsubscribe"
        subtext="We're sorry to see you go. Tell us why, confirm below, and we'll take you off the list straight away."
        size="compact"
      />
      <section className="bg-cream px-6 pb-20 md:pb-24">
        <div className="mx-auto max-w-2xl">
          {hasLink ? (
            <UnsubscribeForm email={email.trim()} token={token.trim()} />
          ) : (
            <Card className="bg-contact-card border-contact-border p-8 text-center md:p-10">
              <p className="text-contact-body text-base leading-relaxed">
                To unsubscribe, please use the <strong>Unsubscribe</strong> link
                at the bottom of any slow letter. Or write to{" "}
                <a
                  href="mailto:hello@recapcenter.com"
                  className="text-contact-accent underline underline-offset-4"
                >
                  hello@recapcenter.com
                </a>{" "}
                and we&rsquo;ll take you off the list ourselves.
              </p>
            </Card>
          )}
        </div>
      </section>
    </main>
  );
}
