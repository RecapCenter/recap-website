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

const OFFSETS = [
  "translate-y-0",
  "translate-y-3",
  "-translate-y-2",
  "translate-y-2",
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

        {/* Desktop: horizontal with a wavy dashed connector */}
        <div className="relative mt-16 hidden md:grid md:grid-cols-4 md:gap-6">
          <svg
            viewBox="0 0 800 40"
            preserveAspectRatio="none"
            className="text-accent-red pointer-events-none absolute top-5 left-0 h-8 w-full"
            aria-hidden
          >
            <path
              d="M40 30 C160 5, 240 5, 360 20 S560 35, 680 8 S760 5, 780 15"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeDasharray="8 7"
              strokeLinecap="round"
            />
          </svg>
          {MILESTONES.map((m, i) => (
            <FadeIn
              key={m.year}
              delay={i * 0.1}
              className={`flex flex-col items-center text-center ${OFFSETS[i]}`}
            >
              <span className="border-accent-red font-display text-ink flex size-14 items-center justify-center rounded-full border-2 bg-white text-sm font-bold">
                {m.year}
              </span>
              <h3 className="font-display text-ink mt-4 text-lg font-bold">
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
              <span className="border-accent-red font-display text-ink flex size-14 items-center justify-center rounded-full border-2 bg-white text-sm font-bold">
                {m.year}
              </span>
              <h3 className="font-display text-ink mt-4 text-lg font-bold">
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
