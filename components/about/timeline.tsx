import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/ui/section-heading";

const MILESTONES = [
  {
    year: "2015",
    title: "A tiny room, a big idea",
    description:
      "Recap opened as a single-therapist practice above a bookshop.",
  },
  {
    year: "2018",
    title: "School partnerships begin",
    description:
      "Launched consultation programs for two neighbourhood schools.",
  },
  {
    year: "2021",
    title: "Recap Lab",
    description:
      "Started training programs for parents, teachers, and early-career clinicians.",
  },
  {
    year: "2024",
    title: "Going global",
    description: "Online sessions extended to families across six countries.",
  },
];

export function Timeline() {
  return (
    <section className="bg-pastel-lavender px-6 py-20 md:py-24">
      <div className="mx-auto max-w-[1200px]">
        <FadeIn className="text-center">
          <span className="font-script text-ink/70 text-xl">
            our little journey
          </span>
          <SectionHeading as="h2" className="mt-3">
            Ten years, one steady hand.
          </SectionHeading>
        </FadeIn>

        {/* Desktop: horizontal */}
        <div className="relative mt-16 hidden md:grid md:grid-cols-4 md:gap-6">
          {MILESTONES.map((m, i) => (
            <FadeIn
              key={m.year}
              delay={i * 0.1}
              className="flex flex-col items-center text-center"
            >
              <span className="border-accent-red font-serif text-ink flex size-14 items-center justify-center rounded-full border-2 bg-white text-sm font-bold">
                {m.year}
              </span>
              <h3 className="font-serif text-ink mt-4 text-lg">
                {m.title}
              </h3>
              <p className="text-body-gray mt-1 max-w-[220px] text-sm">
                {m.description}
              </p>
            </FadeIn>
          ))}
        </div>

        {/* Mobile: vertical stack, no connector */}
        <div className="mt-14 flex flex-col gap-10 md:hidden">
          {MILESTONES.map((m, i) => (
            <FadeIn
              key={m.year}
              delay={i * 0.1}
              className="flex flex-col items-center text-center"
            >
              <span className="border-accent-red font-serif text-ink flex size-14 items-center justify-center rounded-full border-2 bg-white text-sm font-bold">
                {m.year}
              </span>
              <h3 className="font-serif text-ink mt-4 text-lg">
                {m.title}
              </h3>
              <p className="text-body-gray mt-1 max-w-xs text-sm">
                {m.description}
              </p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
