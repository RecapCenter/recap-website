import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/ui/section-heading";

const STEPS = [
  {
    title: "Reach out",
    description:
      "Send a message with a little about what's going on. No forms, just a note.",
  },
  {
    title: "A quick intro chat",
    description:
      "Fifteen minutes, free, to see if we're the right fit and figure out where to start.",
  },
  {
    title: "Your first session",
    description:
      "In-person or online, at whatever pace works for you and your family.",
  },
  {
    title: "An ongoing rhythm",
    description:
      "We keep adjusting together as things change — there's no fixed script.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="bg-pastel-cream-tan px-6 py-20 md:py-24">
      <div className="mx-auto max-w-[1200px]">
        <FadeIn className="text-center">
          <span className="font-script text-ink/70 text-xl">
            getting started
          </span>
          <SectionHeading as="h2" className="mt-3">
            How working together usually goes.
          </SectionHeading>
        </FadeIn>
        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <FadeIn key={step.title} delay={i * 0.08}>
              <div className="flex h-full flex-col gap-3 rounded-3xl bg-white p-7">
                <span className="font-display text-accent-orange text-3xl font-bold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-ink text-lg font-bold">
                  {step.title}
                </h3>
                <p className="text-body-gray text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
