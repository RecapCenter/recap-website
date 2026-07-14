import Image, { type StaticImageData } from "next/image";
import { FadeIn } from "@/components/motion/fade-in";
import { IconBadge } from "@/components/ui/icon-badge";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { SectionHeading } from "@/components/ui/section-heading";

type PageIntroProps = {
  icon: StaticImageData;
  iconBg: string;
  eyebrow: string;
  heading: React.ReactNode;
  subtext: string;
  size?: "compact" | "full";
};

export function PageIntro({
  icon,
  iconBg,
  eyebrow,
  heading,
  subtext,
  size = "compact",
}: PageIntroProps) {
  return (
    <section
      className={
        size === "full"
          ? "px-6 py-24 text-center md:py-32"
          : "px-6 py-16 text-center md:py-20"
      }
    >
      <FadeIn className="mx-auto max-w-2xl">
        <div className="flex justify-center">
          <IconBadge bg={iconBg} size="lg">
            <Image
              src={icon}
              alt=""
              width={28}
              height={28}
              className="h-7 w-auto object-contain"
            />
          </IconBadge>
        </div>
        <div className="mt-4">
          <EyebrowLabel withDottedLines>{eyebrow}</EyebrowLabel>
        </div>
        <SectionHeading as="h1" className="mt-3">
          {heading}
        </SectionHeading>
        <p className="text-body-gray mx-auto mt-6 max-w-xl text-base leading-relaxed">
          {subtext}
        </p>
      </FadeIn>
    </section>
  );
}
