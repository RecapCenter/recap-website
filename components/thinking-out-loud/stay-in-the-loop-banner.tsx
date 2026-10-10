import { CTABanner } from "@/components/ui/cta-banner";
import { NEWSLETTER_ENABLED } from "@/lib/features";
import { WHATSAPP_CHANNEL_URL } from "@/lib/social";

/**
 * Closing banner on the blog pages. While the newsletter is switched off
 * (lib/features.ts) it points to the WhatsApp channel instead of promising
 * new posts by email.
 */
export function StayInTheLoopBanner() {
  return NEWSLETTER_ENABLED ? (
    <CTABanner
      eyebrow="stay in the loop"
      heading="Get new posts in your inbox."
      subtext="No spam, just the occasional thing worth reading."
      buttonLabel="Get in touch"
      buttonHref="/contact"
    />
  ) : (
    <CTABanner
      eyebrow="stay in the loop"
      heading="Get new posts on your phone."
      subtext="Follow Recap on WhatsApp for a short note whenever something new is up."
      buttonLabel="Follow on WhatsApp"
      buttonHref={WHATSAPP_CHANNEL_URL}
    />
  );
}
