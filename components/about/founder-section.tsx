import Image from "next/image";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/ui/section-heading";
import { PullQuoteCard } from "./pull-quote-card";
import founderPhoto from "@/assets/images/about/founder-photo.png";

const CREDENTIALS = [
  "PsyD, Clinical Psychology",
  "Certified in Play & Sandtray Therapy",
  "Trained in Structured Literacy (Orton-Gillingham)",
  "Guest lecturer — Child Development, State University",
];

export function FounderSection() {
  return (
    <section
      className="px-6 py-20 md:py-28"
      style={{
        background: "linear-gradient(160deg, #e4eef5 0%, #d3e4ee 100%)",
      }}
    >
      <div className="mx-auto max-w-[1200px]">
        <FadeIn className="text-center md:text-left">
          <span className="font-script text-ink/70 text-xl">
            meet the founder
          </span>
          <SectionHeading as="h2" className="mt-3">
            The one behind the warm kitchen table.
          </SectionHeading>
        </FadeIn>

        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,340px)_1fr] md:gap-16">
          <FadeIn
            delay={0.1}
            className="relative mx-auto w-full max-w-[280px] md:mx-0"
          >
            <div className="relative aspect-[280/335] w-full overflow-hidden rounded-t-full border-4 border-white shadow-[0_8px_30px_rgba(23,20,15,0.1)]">
              <Image
                src={founderPhoto}
                alt="Dr. Reya Rao"
                fill
                sizes="(min-width: 768px) 280px, 70vw"
                className="object-cover"
              />
            </div>
            <span className="font-script text-ink absolute right-2 -bottom-3 rotate-3 rounded bg-[#fdf1a8] px-3 py-1 text-lg shadow-sm">
              that&rsquo;s her!
            </span>
          </FadeIn>

          <FadeIn delay={0.2} className="flex flex-col gap-5">
            <div>
              <h3 className="font-display text-ink text-3xl font-bold">
                Dr. Reya Rao
              </h3>
              <p className="text-body-gray mt-1 text-sm">
                Founder, Clinical Psychologist
              </p>
            </div>

            <div className="text-body-gray flex flex-col gap-4 text-base leading-relaxed">
              <p>
                Reya has spent the last decade sitting with children who felt
                too much, families who felt too little, and teachers who felt
                everything at once. Her work is grounded in clinical psychology
                and shaped by everyday life.
              </p>
              <p>
                She writes, teaches, and consults on childhood mental health,
                learning differences, and the small ordinary rituals that keep
                families steady. Off the clock, she is usually somewhere near a
                bookshelf or a very tall cup of chai.
              </p>
            </div>

            <PullQuoteCard quote="You do not have to be fixed to be loved. You just have to be here, honestly." />

            <div>
              <span className="text-body-gray text-xs font-semibold tracking-widest uppercase">
                Credentials
              </span>
              <ul className="mt-3 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
                {CREDENTIALS.map((item) => (
                  <li
                    key={item}
                    className="text-ink/90 flex items-start gap-2 text-sm"
                  >
                    <span className="bg-accent-red mt-1.5 size-1.5 shrink-0 rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
