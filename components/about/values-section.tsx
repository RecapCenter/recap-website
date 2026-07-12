import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/ui/section-heading";
import { ValueCard } from "./value-card";
import {
  SproutIcon,
  StarburstIcon,
  PetalClusterIcon,
  ArchIcon,
} from "./value-icons";

const VALUES = [
  {
    icon: <SproutIcon className="size-10" />,
    title: "Warmth first",
    description:
      "Every session begins with safety. We believe change only takes root when people feel genuinely met.",
    bg: "var(--pastel-peach)",
    titleColor: "var(--accent-orange)",
  },
  {
    icon: <StarburstIcon className="size-10" />,
    title: "Evidence, gently used",
    description:
      "We lean on research — CBT, ACT, play therapy, structured literacy — but always shape it to fit the person in front of us.",
    bg: "var(--pastel-blue)",
    titleColor: "#1e3a6e",
  },
  {
    icon: <PetalClusterIcon className="size-10" />,
    title: "Ripple outward",
    description:
      "Children live inside families, classrooms, and cultures. Real progress usually means supporting the whole ecosystem.",
    bg: "var(--pastel-lavender-light)",
    titleColor: "#5b3a91",
  },
  {
    icon: <ArchIcon className="size-10" />,
    title: "Honest, not perfect",
    description:
      "We share what we know, name what we don't, and celebrate the messy middle where growth actually happens.",
    bg: "var(--pastel-yellow-light)",
    titleColor: "var(--pastel-mustard)",
  },
];

export function ValuesSection() {
  return (
    <section className="bg-white px-6 py-20 md:py-24">
      <div className="mx-auto max-w-[1200px]">
        <FadeIn className="text-center">
          <span className="font-script text-ink/70 text-xl">
            what we believe
          </span>
          <SectionHeading as="h2" className="mt-3">
            Four small ideas we protect fiercely.
          </SectionHeading>
        </FadeIn>
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((value, i) => (
            <FadeIn key={value.title} delay={i * 0.08}>
              <ValueCard {...value} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
