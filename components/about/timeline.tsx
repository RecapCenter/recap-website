import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/ui/section-heading";

const MILESTONES = [
  { value: "2022", title: "Started" },
  { value: "3", title: "Partnerships", description: "Schools" },
  { value: "100+", title: "Happy Clients" },
  { value: "50+", title: "Workshops & Trainings" },
  {
    value: "Ongoing",
    title: "Research & Learning",
    description: "Keeping our practice curious, reflective and evidence-informed",
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
            5 years, one steady hand.
          </SectionHeading>
        </FadeIn>

        {/* Vertical stack on mobile, single row from md up */}
        <div className="mt-14 grid grid-cols-1 gap-10 md:mt-16 md:grid-cols-5 md:gap-6">
          {MILESTONES.map((m, i) => (
            <FadeIn
              key={m.title}
              delay={i * 0.1}
              className="flex flex-col items-center text-center"
            >
              <span className="border-accent-red font-serif text-ink flex size-20 items-center justify-center rounded-full border-2 bg-white text-base font-bold">
                {m.value}
              </span>
              <h3 className="font-serif text-ink mt-4 text-lg">{m.title}</h3>
              {m.description && (
                <p className="text-body-gray mt-1 max-w-xs text-sm md:max-w-[200px]">
                  {m.description}
                </p>
              )}
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
