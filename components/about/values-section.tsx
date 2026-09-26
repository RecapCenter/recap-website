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
    title: "People deserve to be understood…",
    description: "Before they are judged, labelled, or defined by a problem.",
    bg: "var(--pastel-peach)",
    titleColor: "var(--accent-orange)",
  },
  {
    icon: <StarburstIcon className="size-10" />,
    title: "Every experience has a story…",
    description:
      "And understanding the story can change the way we see ourselves and each other.",
    bg: "var(--pastel-blue)",
    titleColor: "#1e3a6e",
  },
  {
    icon: <PetalClusterIcon className="size-10" />,
    title: "Growth does not look the same for everyone…",
    description:
      "There is no single path to learning, healing, connecting, or becoming.",
    bg: "var(--pastel-lavender-light)",
    titleColor: "#5b3a91",
  },
  {
    icon: <ArchIcon className="size-10" />,
    title: "Support should create possibility…",
    description:
      "Not dependence—because the goal is to help people find their own voice, choices, strengths, and way forward.",
    bg: "var(--pastel-yellow-light)",
    titleColor: "var(--pastel-mustard)",
  },
];

export function ValuesSection() {
  return (
    // Continues OurStorySection's chapter: same background, no top padding.
    <section className="bg-cream px-6 pb-20 md:pb-24">
      <div className="border-border mx-auto max-w-[1200px] border-t pt-12 md:pt-16">
        <FadeIn>
          <span className="font-script text-ink/70 text-xl">our values</span>
          <SectionHeading as="h2" className="mt-3">
            What we believe
          </SectionHeading>
        </FadeIn>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
