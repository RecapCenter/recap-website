import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/ui/section-heading";
import { TestimonialCard } from "./testimonial-card";
import { getReviews } from "@/lib/wordpress/reviews";

export async function TestimonialsSection() {
  const reviews = await getReviews(3);
  if (reviews.length === 0) return null;

  return (
    <section
      className="px-6 py-20 md:py-24"
      style={{
        background: "linear-gradient(180deg, #d3eaf0 0%, #e8f3f6 100%)",
      }}
    >
      <div className="mx-auto max-w-[1200px]">
        <FadeIn>
          <SectionHeading as="h2">
            Straight from <span className="text-accent-orange">clients</span>
          </SectionHeading>
        </FadeIn>
        <div className="mt-14 grid grid-cols-1 gap-12 sm:grid-cols-3 sm:gap-8">
          {reviews.map((review, i) => (
            <FadeIn key={review.id} delay={i * 0.1}>
              <TestimonialCard {...review} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
