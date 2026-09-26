import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/ui/section-heading";
import { PullQuoteCard } from "./pull-quote-card";

const CREDENTIALS = [
  "M.A. Counselling Psychology",
  "B.Ed. Special Education (RCI Recognized)",
  "Certified Play Therapist",
  "Social Emotion Learning Coach",
  "Researcher",
];

const BIO = [
  "Recap was born in 2022 and was founded by Riya Kapoor, a counselling psychologist, special educator, researcher and educator who works at the intersection of psychology, education, emotional wellbeing and human relationships.",
  "Her work has grown from a simple observation: meaningful change rarely happens in isolation.",
  "A child's wellbeing is connected to the people around them. A student's learning is connected to how safe and understood they feel. A parent's confidence is connected to the relationship they share with their child. And the way we understand behaviour can change the way we respond to it.",
  "With a background spanning counselling psychology, special education, social-emotional learning, inclusive education and family-centred interventions, Riya's approach brings together professional knowledge with the realities of everyday life.",
  "As a researcher, she is particularly interested in parent–child relationships, neurodevelopment, emotional development and interventions that place families at the centre of change. As an educator, she works towards making psychological understanding practical—not something that belongs only inside a therapy room or a textbook.",
  "Recap is an extension of that philosophy.",
  "It is built on the belief that psychological support should be human before it is clinical, evidence-informed without becoming impersonal, and empowering without taking away a person's agency.",
];

/**
 * Closing founder chapter: full bio and credentials beside her quote. No
 * photo here — Riya's portrait already opens the page in the hero.
 */
export function FounderSection() {
  return (
    <section className="bg-cream px-6 py-20 md:py-24">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-16">
        <FadeIn className="flex flex-col gap-6">
          <div>
            <span className="font-script text-ink/70 text-2xl md:text-3xl">
              meet the founder
            </span>
            <SectionHeading as="h2" className="mt-3">
              Riya Kapoor
            </SectionHeading>
            <p className="text-ink mt-3 font-serif text-xl">
              Counselling Psychologist | Special Educator | Researcher |
              Educator
            </p>
          </div>

          <div className="text-body-gray flex flex-col gap-4 text-base leading-relaxed">
            {BIO.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div>
            <span className="text-body-gray text-xs font-semibold tracking-widest uppercase">
              Credentials
            </span>
            <ul className="mt-3 flex flex-wrap gap-2">
              {CREDENTIALS.map((item) => (
                <li
                  key={item}
                  className="border-border text-ink/90 rounded-full border bg-white/70 px-3 py-1.5 text-sm"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </FadeIn>

        {/* The quote stays in view alongside the long bio on desktop. */}
        <FadeIn
          delay={0.1}
          className="self-start lg:sticky lg:top-[calc(var(--nav-height)+2rem)]"
        >
          <PullQuoteCard
            quote={
              "I don't believe people need to become someone else to be better.\nSometimes, they simply need the space, understanding and perspective to become more fully themselves."
            }
            attribution="Riya Kapoor, Founder, Recap"
          />
        </FadeIn>
      </div>
    </section>
  );
}
