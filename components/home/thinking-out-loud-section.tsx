import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { HoverLift } from "@/components/motion/hover-lift";
import { IconBadge } from "@/components/ui/icon-badge";
import { ThinkingOutLoudCard } from "./thinking-out-loud-card";
import caseStoriesIcon from "@/assets/icons/case-stories-logo.svg";
import storyImage from "@/assets/images/home/service-special-education.png";

const LIGHT_GRAY = "#e7e5e2";
const CRIMSON = "#e8194d";

const COLUMN_HEIGHT = "h-[26rem] md:h-[34rem]";

export function ThinkingOutLoudSection() {
  return (
    <section className="bg-white px-6 py-20 md:py-24">
      <FadeIn>
        <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {/* Column 1 — Thinking Out Loud intro (1/3) + photo (2/3) */}
          <div className={`flex flex-col gap-4 md:gap-6 ${COLUMN_HEIGHT}`}>
            <div
              className="flex flex-1 flex-col gap-3 rounded-3xl p-6"
              style={{ backgroundColor: LIGHT_GRAY }}
            >
              <IconBadge bg="#c9c7c2" size="lg">
                <Image
                  src={caseStoriesIcon}
                  alt=""
                  width={28}
                  height={28}
                  className="h-7 w-auto object-contain"
                />
              </IconBadge>
              <div>
                <h3 className="font-display text-ink text-2xl font-bold">
                  Thinking Out Loud
                </h3>
                <p className="text-body-gray mt-2 text-sm leading-relaxed">
                  Real stories of change, growth, and perspective drawn from
                  everyday work with children, families, and schools.
                </p>
              </div>
            </div>

            <HoverLift className="flex-[2]">
              <Link
                href="/thinking-out-loud"
                className="relative block h-full overflow-hidden rounded-3xl"
              >
                <Image
                  src={storyImage}
                  alt="A child arranging colorful paper shapes during a special education session"
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover"
                />
                <span className="absolute top-4 right-4 flex size-7 items-center justify-center rounded-full bg-white/30">
                  <Plus className="size-4 text-white" />
                </span>
              </Link>
            </HoverLift>
          </div>

          {/* Column 2 — Imposter Syndrome / Human Resources System (1/2, 1/2) */}
          <div className={`flex flex-col gap-4 md:gap-6 ${COLUMN_HEIGHT}`}>
            <ThinkingOutLoudCard
              href="/thinking-out-loud"
              label="Imposter Syndrome"
              bg="var(--accent-orange)"
              labelColor="#ffffff"
              className="flex-1"
            />
            <ThinkingOutLoudCard
              href="/thinking-out-loud"
              label="Human Resources System"
              bg={LIGHT_GRAY}
              labelColor="var(--ink)"
              className="flex-1"
            />
          </div>

          {/* Column 3 — Catastrophic Thinking / Learning & Development Community (1/2, 1/2) */}
          <div className={`flex flex-col gap-4 md:gap-6 ${COLUMN_HEIGHT}`}>
            <ThinkingOutLoudCard
              href="/thinking-out-loud"
              label="Catastrophic Thinking"
              bg={LIGHT_GRAY}
              labelColor="var(--ink)"
              className="flex-1"
            />
            <ThinkingOutLoudCard
              href="/thinking-out-loud"
              label="Learning & Development Community"
              bg="#7c3aed"
              labelColor="#ffffff"
              className="flex-1"
            />
          </div>

          {/* Column 4 — Global News (2/3) + Knowledge Hub CTA (1/3) */}
          <div className={`flex flex-col gap-4 md:gap-6 ${COLUMN_HEIGHT}`}>
            <ThinkingOutLoudCard
              href="/thinking-out-loud"
              label="Global News"
              bg={CRIMSON}
              labelColor="#ffffff"
              className="flex-[2]"
            />
            <ThinkingOutLoudCard
              href="/thinking-out-loud"
              label="Knowledge Hub"
              bg={CRIMSON}
              labelColor="var(--ink)"
              variant="cta"
              className="flex-1"
            />
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
