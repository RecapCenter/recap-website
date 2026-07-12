import { FadeIn } from "@/components/motion/fade-in";
import { CircleAnnotation } from "@/components/ui/section-heading";

function TangleDoodle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={className} aria-hidden>
      <path
        d="M30 30c-8-10 6-14 0-2s-16 4-6-4 18 4 8 10 -14-8-2-8 12 10 2 12-16-2-2-8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function OpenCircleDoodle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <circle
        cx="20"
        cy="20"
        r="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

export function HeroSection() {
  return (
    <section
      className="overflow-hidden px-6 py-20 md:py-28"
      style={{
        background:
          "radial-gradient(120% 100% at 50% 20%, #fdf6d8 0%, #f7de8e 55%, #f0d77a 100%)",
      }}
    >
      <FadeIn className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
        <div className="flex -rotate-2 items-center gap-3 self-start md:ml-10">
          <span
            className="font-script text-xl text-ink md:text-2xl"
            style={{ background: "var(--highlight-lime)" }}
          >
            &nbsp;from managing chaos&nbsp;
          </span>
          <TangleDoodle className="size-10 shrink-0 text-ink/70 md:size-12" />
        </div>

        <h1 className="font-display text-3xl font-bold leading-tight text-ink md:text-5xl">
          <CircleAnnotation>Realm</CircleAnnotation> of Counselling &amp;
          Psychological Services
        </h1>

        <div className="flex rotate-1 items-center gap-3 self-end md:mr-10">
          <span
            className="font-script text-xl text-ink md:text-2xl"
            style={{ background: "var(--highlight-lime)" }}
          >
            &nbsp;to developing perspective&nbsp;
          </span>
          <OpenCircleDoodle className="size-9 shrink-0 text-ink/60" />
        </div>
      </FadeIn>
    </section>
  );
}
