import { ClipboardList, HelpCircle, BookOpen } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { ValueCard } from "@/components/about/value-card";

const TILES = [
  {
    icon: <ClipboardList className="size-7" />,
    title: "Assessments",
    description: "Short, thoughtful check-ins to help you understand where things stand.",
    bg: "var(--pastel-peach)",
    titleColor: "var(--ink)",
  },
  {
    icon: <HelpCircle className="size-7" />,
    title: "Quizzes",
    description: "Bite-sized, reflective quizzes — no right answers, just useful ones.",
    bg: "var(--pastel-lavender-light)",
    titleColor: "var(--ink)",
  },
  {
    icon: <BookOpen className="size-7" />,
    title: "Resources",
    description: "Guides and tools we're building to support the work you're already doing.",
    bg: "var(--pastel-yellow-light)",
    titleColor: "var(--ink)",
  },
];

export function PreviewTiles() {
  return (
    <section className="px-6 pb-20 md:pb-24">
      <FadeIn className="mx-auto grid max-w-[1200px] grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
        {TILES.map((tile) => (
          <ValueCard key={tile.title} {...tile} />
        ))}
      </FadeIn>
    </section>
  );
}
