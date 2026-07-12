import { FadeIn } from "@/components/motion/fade-in";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { DecorativeBlob } from "@/components/ui/decorative-blob";

function SproutIcon() {
  return (
    <svg viewBox="0 0 32 32" className="mx-auto size-8 text-[#9cae8e]" fill="none" aria-hidden>
      <path d="M16 28V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M16 14C16 9 12 7 8 7C8 12 11 14 16 14Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M16 14C16 10 19.5 8 23 8C23 13 20 14 16 14Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ContactHero() {
  return (
    <section className="relative overflow-hidden bg-contact-bg px-6 py-24 text-center md:py-32">
      <DecorativeBlob color="#f0c368" size={420} className="left-[-10%] top-[-10%]" />
      <DecorativeBlob color="#f0a98c" size={420} className="right-[-10%] top-[-5%]" />
      <DecorativeBlob color="#c9b8da" size={380} className="bottom-[-15%] left-1/2 -translate-x-1/2" />

      <FadeIn className="relative mx-auto max-w-3xl">
        <EyebrowLabel withDottedLines color="orange">
          let&rsquo;s talk
        </EyebrowLabel>
        <h1 className="mt-6 font-serif text-3xl leading-tight text-contact-ink md:text-5xl">
          from a <em className="text-contact-accent">quiet thought</em>
          <br />
          to a real conversation
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-contact-body">
          Whether it&rsquo;s a session for yourself, a workshop for your team,
          or a message you&rsquo;ve been meaning to send for a while — this is
          where it begins. Take your time. We&rsquo;re listening.
        </p>
        <div className="mt-8">
          <SproutIcon />
        </div>
      </FadeIn>
    </section>
  );
}
