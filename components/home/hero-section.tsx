import Image from "next/image";
import { FadeIn } from "@/components/motion/fade-in";
import { HighlightMark } from "@/components/ui/section-heading";
import scribbleIcon from "@/assets/icons/hero/scribble icon.svg";
import circularIcon from "@/assets/icons/hero/circular icon.svg";
import arrowUpIcon from "@/assets/icons/hero/arrow up.svg";
import arrowDownIcon from "@/assets/icons/hero/arrow down.svg";

const WATERCOLOR_BACKGROUND = [
  "radial-gradient(50% 40% at 42% 10%, #fdf8f0e6 0%, transparent 70%)",
  "radial-gradient(45% 35% at 6% 42%, #fdf8f0cc 0%, transparent 70%)",
  "radial-gradient(40% 32% at 80% 16%, #f0c96b99 0%, transparent 72%)",
  "radial-gradient(45% 35% at 55% 46%, #fdf8f0b3 0%, transparent 70%)",
  "radial-gradient(55% 40% at 8% 98%, #e2b34d 0%, transparent 75%)",
  "radial-gradient(65% 45% at 92% 100%, #e2b34d 0%, transparent 75%)",
  "radial-gradient(70% 35% at 50% 108%, #e2b34dcc 0%, transparent 80%)",
].join(", ");

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden px-6 py-20 xl:py-16"
      style={{
        backgroundColor: "#fbeecb",
        backgroundImage: WATERCOLOR_BACKGROUND,
      }}
    >
      <FadeIn className="relative mx-auto max-w-3xl xl:max-w-6xl">
        <div className="relative xl:pt-20 xl:pb-20">
          <div className="flex items-center justify-center gap-2 xl:absolute xl:top-0 xl:left-[12%] xl:justify-start">
            <HighlightMark className="font-script text-lg xl:text-2xl">
              from managing chaos
            </HighlightMark>
            <Image
              src={scribbleIcon}
              alt=""
              aria-hidden
              width={106}
              height={106}
              className="h-12 w-auto xl:h-16"
            />
          </div>

          {/* Mobile: whole-block anchored connecting arrows */}
          <Image
            src={arrowUpIcon}
            alt=""
            aria-hidden
            width={106}
            height={106}
            className="pointer-events-none absolute top-14 left-2 h-24 w-auto xl:hidden"
          />
          <Image
            src={arrowDownIcon}
            alt=""
            aria-hidden
            width={106}
            height={106}
            className="pointer-events-none absolute right-2 bottom-14 h-24 w-auto xl:hidden"
          />

          <h1 className="font-script text-ink mt-8 text-center text-[2.5rem] leading-[1.05] font-bold text-balance xl:mt-0 xl:text-6xl xl:whitespace-nowrap">
            Realm of<br className="xl:hidden" />{" "}
            <span className="relative inline-block">
              {/* Desktop: word-anchored connecting arrow */}
              <Image
                src={arrowUpIcon}
                alt=""
                aria-hidden
                width={106}
                height={106}
                className="pointer-events-none absolute -top-20 -left-12 hidden h-28 w-auto xl:block"
              />
              Counselling &amp;
            </span>
            <br className="xl:hidden" />{" "}
            <span className="relative inline-block">
              Psychological
              <Image
                src={arrowDownIcon}
                alt=""
                aria-hidden
                width={106}
                height={106}
                className="pointer-events-none absolute -right-12 -bottom-20 hidden h-28 w-auto xl:block"
              />
            </span>
            <br className="xl:hidden" /> Services
          </h1>

          <div className="mt-8 flex items-center justify-center gap-2 xl:absolute xl:right-[12%] xl:bottom-0 xl:justify-end">
            <HighlightMark className="font-script text-lg xl:text-2xl">
              to developing perspective
            </HighlightMark>
            <Image
              src={circularIcon}
              alt=""
              aria-hidden
              width={106}
              height={106}
              className="h-12 w-auto xl:h-16"
            />
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
