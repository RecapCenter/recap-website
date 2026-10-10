import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/ui/section-heading";
import { FollowAlong } from "@/components/ui/follow-along";

/**
 * Recap Lab "early access" prompt while the newsletter is switched off
 * (lib/features.ts) — same layout as NotifyForm, pointing to WhatsApp and
 * the socials instead of an email signup.
 */
export function FollowSection() {
  return (
    <section className="px-6 pb-12 md:pb-16">
      <FadeIn className="mx-auto max-w-xl text-center">
        <SectionHeading as="h3">Want early access?</SectionHeading>
        <p className="text-body-gray mx-auto mt-3 max-w-md text-base leading-relaxed">
          Follow Recap on WhatsApp and you&apos;ll be the first to hear the
          moment Recap Lab opens up.
        </p>
        <FollowAlong variant="light" className="mt-6" />
      </FadeIn>
    </section>
  );
}
