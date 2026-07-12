import { FadeIn } from "@/components/motion/fade-in";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { DecorativeBlob } from "@/components/ui/decorative-blob";
import { ContactForm } from "./contact-form";

export function NoteAndFormSection() {
  return (
    <section className="relative overflow-hidden bg-contact-bg px-6 py-16 md:py-20">
      <DecorativeBlob color="#c9b8da" size={320} className="left-[6%] top-[10%]" />

      <div className="relative mx-auto grid max-w-3xl grid-cols-1 gap-12 md:max-w-5xl md:grid-cols-2 md:gap-10">
        <FadeIn className="flex flex-col gap-4">
          <EyebrowLabel color="orange">a note from us</EyebrowLabel>
          <h2 className="font-serif text-3xl leading-tight text-contact-ink md:text-4xl">
            Tell us what&rsquo;s on
            <br />
            <em>your mind.</em>
          </h2>
          <p className="text-base leading-relaxed text-contact-body">
            There is no wrong way to begin. A sentence is enough. A paragraph
            is welcome. Write like you would to a friend who happens to
            listen for a living.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <span className="h-px w-10 border-t border-dashed border-contact-border" />
            <span className="text-sm italic text-contact-body">
              every note gets read
            </span>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <ContactForm />
        </FadeIn>
      </div>
    </section>
  );
}
