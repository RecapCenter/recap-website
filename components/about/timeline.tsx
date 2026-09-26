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
    description:
      "Keeping our practice curious, reflective and evidence-informed",
  },
];

/**
 * "Our little journey" as a dark ink band of figures — the About page's one
 * high-contrast moment between the cream story and founder chapters.
 */
export function Timeline() {
  return (
    <section className="bg-ink text-cream px-6 py-16 md:py-20">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)] lg:gap-12">
        <FadeIn>
          <span className="font-script text-cream/70 text-2xl md:text-3xl">
            our little journey
          </span>
          <SectionHeading as="h2" className="text-cream mt-3">
            5 years, one steady hand.
          </SectionHeading>
        </FadeIn>

        <ul className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
          {MILESTONES.map((m, i) => (
            <li
              key={m.title}
              className={
                // Spans both columns on phones so the last row isn't half empty.
                i === MILESTONES.length - 1 ? "col-span-2 sm:col-span-1" : ""
              }
            >
              <FadeIn
                delay={i * 0.08}
                className="border-cream/25 flex flex-col gap-1 border-t pt-4"
              >
                <span className="font-serif text-3xl font-bold tabular-nums md:text-4xl">
                  {m.value}
                </span>
                <span className="text-cream text-base">{m.title}</span>
                {m.description && (
                  <span className="text-cream/65 text-sm leading-snug">
                    {m.description}
                  </span>
                )}
              </FadeIn>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
