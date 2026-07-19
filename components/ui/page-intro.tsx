import Image, { type StaticImageData } from "next/image";
import { FadeIn } from "@/components/motion/fade-in";
import { IconBadge } from "@/components/ui/icon-badge";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { SectionHeading } from "@/components/ui/section-heading";
import { DecorativeBlob } from "@/components/ui/decorative-blob";

function isStaticImage(icon: unknown): icon is StaticImageData {
  return typeof icon === "object" && icon !== null && "src" in icon;
}

type PageIntroProps = {
  icon?: StaticImageData | React.ReactNode;
  iconBg?: string;
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
          ? "bg-cream relative overflow-hidden px-6 py-24 text-center md:py-32"
          : "bg-cream relative overflow-hidden px-6 py-16 text-center md:py-20"
      }
    >
      <DecorativeBlob
        color="#f0c368"
        size={360}
        className="top-[-15%] left-[-8%]"
      />
      <DecorativeBlob
        color="#c9b8da"
        size={360}
        className="top-[-10%] right-[-8%]"
      />

      <FadeIn className="relative mx-auto max-w-2xl">
        {icon && (
          <div className="flex justify-center">
            <IconBadge bg={iconBg} size="lg">
              {isStaticImage(icon) ? (
                <Image
                  src={icon}
                  alt=""
                  width={28}
                  height={28}
                  className="h-7 w-auto object-contain"
                />
              ) : (
                icon
              )}
            </IconBadge>
          </div>
        )}
        <div className={icon ? "mt-4" : ""}>
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
