import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/page-intro";
import { UnsubscribeForm } from "@/components/newsletter/unsubscribe-form";

export const metadata: Metadata = {
  title: "Unsubscribe — Recap",
  description: "Unsubscribe from the slow letter, Recap's newsletter.",
  // Reached only from the link in each newsletter; keep it out of search results.
  robots: { index: false, follow: false },
};

/**
 * Newsletter unsubscribe page. Linked from the footer of every MailPoet
 * email as /unsubscribe?email=[subscriber:email], so the address is
 * prefilled; it can also be typed in by hand.
 */
export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

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
          <UnsubscribeForm initialEmail={email?.trim() ?? ""} />
        </div>
      </section>
    </main>
  );
}
