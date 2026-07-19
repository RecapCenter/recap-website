import { FadeIn } from "@/components/motion/fade-in";
import { QuickLinkCard } from "./quick-link-card";
import aboutIcon from "@/assets/icons/about-logo.svg";
import servicesIcon from "@/assets/icons/services-logo.svg";
import caseStoriesIcon from "@/assets/icons/case-stories-logo.svg";
import recapLabIcon from "@/assets/icons/recap-lab-logo.svg";
import thinkingOutLoudIcon from "@/assets/icons/thinking-out-loud-logo.svg";
import freebieIcon from "@/assets/icons/freebie-logo.svg";
import recapRecommendsIcon from "@/assets/icons/recap-recommends-logo.svg";

const CARDS = [
  {
    href: "/about",
    label: "About",
    bg: "var(--pastel-blue)",
    labelColor: "var(--pastel-mustard)",
    icon: aboutIcon,
    tall: true,
  },
  {
    href: "/services",
    label: "Services",
    bg: "var(--pastel-lavender)",
    labelColor: "#ffffff",
    icon: servicesIcon,
  },
  {
    href: "/thinking-out-loud",
    label: "Thinking Out Loud",
    bg: "var(--pastel-mustard)",
    labelColor: "#ffffff",
    icon: caseStoriesIcon,
  },
  {
    href: "/recap-lab",
    label: "Recap Lab",
    bg: "var(--accent-orange)",
    labelColor: "#ffffff",
    icon: recapLabIcon,
  },
  {
    href: "/gallery",
    label: "Gallery",
    bg: "var(--accent-orange)",
    labelColor: "#ffffff",
    icon: thinkingOutLoudIcon,
  },
  {
    href: "/freebies",
    label: "Freebie",
    bg: "var(--pastel-blue)",
    labelColor: "#1a2a6b",
    icon: freebieIcon,
  },
  {
    href: "/recap-recommends",
    label: "Recap Recommends",
    bg: "var(--pastel-cream-tan)",
    labelColor: "var(--accent-orange)",
    icon: recapRecommendsIcon,
  },
];

export function QuickLinkGrid() {
  return (
    <section className="bg-cream px-6 py-20 md:py-24">
      <FadeIn>
        <div className="mx-auto grid max-w-[1200px] grid-flow-row-dense auto-rows-[13rem] grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {CARDS.map((card) => (
            <QuickLinkCard
              key={card.href}
              href={card.href}
              label={card.label}
              bg={card.bg}
              labelColor={card.labelColor}
              icon={card.icon}
              className={card.tall ? "row-span-2" : undefined}
            />
          ))}
        </div>
      </FadeIn>
    </section>
  );
}
