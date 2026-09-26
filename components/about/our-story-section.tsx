import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/ui/section-heading";

const NO_SINGLE_WAY = [
  "There is no single way to be well.",
  "There is no single way to learn, heal or grow.",
  "And there is no single version of who you are meant to become.",
];

export function OurStorySection() {
  return (
    <section className="bg-cream px-6 py-20 md:py-28">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
        <FadeIn>
          <span className="font-script text-ink/70 text-xl">our story</span>
          <p className="text-body-gray mt-3 text-base leading-relaxed">
            Life can feel complicated. A child may struggle to find their words.
            A parent may wonder if they are doing enough. A young person may
            feel lost between who they are and who they are expected to become.
            An educator may see a behaviour but not the story behind it. And
            sometimes, even when everything looks fine from the outside,
            something within us needs attention.
          </p>
          <SectionHeading as="h2" className="mt-6">
            Recap exists in that space.
          </SectionHeading>
          <p className="text-body-gray mt-6 text-base leading-relaxed">
            We bring together psychology, education, relationships and lived
            experience to make support more meaningful and accessible. Our work
            extends across counselling, emotional and social learning,
            inclusive education, parent guidance, psychological support,
            professional learning and research-informed interventions.
          </p>
        </FadeIn>

        <FadeIn delay={0.1} className="flex flex-col gap-6">
          <div className="text-body-gray flex flex-col gap-4 text-base leading-relaxed">
            <p className="font-serif text-ink text-2xl">
              But beyond the services, Recap is about perspective.
            </p>
            <p>
              We believe that when we understand ourselves, our relationships
              and our experiences with greater clarity, we create new
              possibilities for how we respond, connect and move forward.
            </p>
          </div>

          <ul className="bg-pastel-yellow-light flex flex-col gap-2 rounded-3xl p-7">
            {NO_SINGLE_WAY.map((line) => (
              <li key={line} className="font-serif text-ink text-lg">
                {line}
              </li>
            ))}
          </ul>

          <p className="text-body-gray text-base leading-relaxed">
            Recap is a place to pause, understand, reconnect and move
            forward—with greater awareness and a little more possibility.
          </p>
          <p className="font-script text-ink text-2xl">
            From managing chaos to developing perspective.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
