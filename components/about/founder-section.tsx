import Image from "next/image";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/ui/section-heading";
import { PullQuoteCard } from "./pull-quote-card";
import founderPhoto from "@/assets/images/about/founder-photo.webp";

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

export function FounderSection() {
  return (
    <section
      className="px-6 py-20 md:py-28"
      style={{
        background: "linear-gradient(160deg, #e4eef5 0%, #d3e4ee 100%)",
      }}
    >
      <div className="mx-auto max-w-[1200px]">
        <FadeIn className="text-center md:text-left">
          <span className="font-script text-ink/70 text-xl">
            meet the founder
          </span>
          <SectionHeading as="h2" className="mt-3">
            Riya Kapoor
          </SectionHeading>
        </FadeIn>

        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,340px)_1fr] md:gap-16">
          <FadeIn
            delay={0.1}
            className="relative mx-auto w-full max-w-[280px] self-start md:mx-0"
          >
            <div className="relative aspect-[280/335] w-full overflow-hidden rounded-t-full border-4 border-white shadow-[0_8px_30px_rgba(23,20,15,0.1)]">
              <Image
                src={founderPhoto}
                alt="Riya Kapoor"
                fill
                sizes="(min-width: 768px) 280px, 70vw"
                className="object-cover"
              />
            </div>
            <span className="font-script text-ink absolute right-2 -bottom-3 rotate-3 rounded bg-[#fdf1a8] px-3 py-1 text-lg shadow-sm">
              that&rsquo;s her!
            </span>
          </FadeIn>

          <FadeIn delay={0.2} className="flex flex-col gap-5">
            <p className="font-serif text-ink text-xl">
              Counselling Psychologist | Special Educator | Researcher |
              Educator
            </p>

            <div className="text-body-gray flex flex-col gap-4 text-base leading-relaxed">
              {BIO.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <PullQuoteCard
              quote={
                "I don't believe people need to become someone else to be better.\nSometimes, they simply need the space, understanding and perspective to become more fully themselves."
              }
              attribution="Riya Kapoor, Founder, Recap"
            />

            <div>
              <span className="text-body-gray text-xs font-semibold tracking-widest uppercase">
                Credentials
              </span>
              <ul className="mt-3 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
                {CREDENTIALS.map((item) => (
                  <li
                    key={item}
                    className="text-ink/90 flex items-start gap-2 text-sm"
                  >
                    <span className="bg-accent-red mt-1.5 size-1.5 shrink-0 rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
