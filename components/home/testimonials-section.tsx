import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/ui/section-heading";
import { Marquee } from "@/components/ui/marquee";
import { TestimonialCard } from "./testimonial-card";
import { getReviews } from "@/lib/wordpress/reviews";

export async function TestimonialsSection() {
  const reviews = await getReviews(10);
  if (reviews.length === 0) return null;

  const midpoint = Math.ceil(reviews.length / 2);
  const firstRow = reviews.slice(0, midpoint);
  const secondRow = reviews.slice(midpoint);

  return (
    <section
      className="py-20 md:py-24"
      style={{
        background: "linear-gradient(180deg, #d3eaf0 0%, #e8f3f6 100%)",
      }}
    >
      <div className="mx-auto max-w-[1200px] px-6">
        <FadeIn>
          <SectionHeading as="h2">
            Straight from <span className="text-accent-orange">clients</span>
          </SectionHeading>
        </FadeIn>
      </div>

      <FadeIn
        delay={0.1}
        className="relative mt-14 flex w-full flex-col gap-6"
      >
        <Marquee pauseOnHover className="[--duration:26s]">
          {firstRow.map((review) => (
            <TestimonialCard key={review.id} {...review} />
          ))}
        </Marquee>
        {secondRow.length > 0 && (
          <Marquee reverse pauseOnHover className="[--duration:26s]">
            {secondRow.map((review) => (
              <TestimonialCard key={review.id} {...review} />
            ))}
          </Marquee>
        )}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32"
          style={{
            background: "linear-gradient(90deg, #d3eaf0 0%, transparent 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32"
          style={{
            background: "linear-gradient(270deg, #e8f3f6 0%, transparent 100%)",
          }}
        />
      </FadeIn>
    </section>
  );
}
