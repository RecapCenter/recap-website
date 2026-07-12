import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatCard } from "./stat-card";

const STATS = [
  {
    value: "10+",
    label: "Years in practice",
    bg: "var(--pastel-yellow-light)",
  },
  { value: "1,200+", label: "Sessions delivered", bg: "var(--pastel-blue)" },
  { value: "40+", label: "Schools partnered", bg: "var(--pastel-peach)" },
  {
    value: "6",
    label: "Countries reached",
    bg: "var(--pastel-lavender-light)",
  },
];

export function OurStorySection() {
  return (
    <section className="bg-cream px-6 py-20 md:py-28">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-12 md:grid-cols-2 md:gap-10">
        <FadeIn>
          <span className="font-script text-ink/70 text-xl">our story</span>
          <SectionHeading as="h2" className="mt-3">
            A quiet space, built with care
          </SectionHeading>
          <div className="text-body-gray mt-6 flex flex-col gap-4 text-base leading-relaxed">
            <p>
              Recap began the way most honest work does — quietly, and out of
              need. After years of sitting across from children, parents, and
              educators who felt unseen by textbook answers, we wanted a place
              that felt more like a conversation and less like a clinic.
            </p>
            <p>
              We work at the intersection of counselling, learning, and everyday
              life. Our approach is warm, evidence-informed, and refreshingly
              practical. No jargon, no shame — just steady support and the tools
              to move forward.
            </p>
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="grid grid-cols-2 gap-4">
            {STATS.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
