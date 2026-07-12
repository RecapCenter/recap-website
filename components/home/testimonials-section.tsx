import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/ui/section-heading";
import { TestimonialCard } from "./testimonial-card";
import avatar1 from "@/assets/images/home/testimonial-avatar-1.png";
import avatar2 from "@/assets/images/home/testimonial-avatar-2.png";
import avatar3 from "@/assets/images/home/testimonial-avatar-3.png";

// TODO: replace placeholder quotes/names (carried over verbatim from source screenshots) with real client testimonials
const QUOTE =
  "Boost your product and service's credibility by adding testimonials from your clients. People love recommendations so feedback from others who've tried it is invaluable.";

const TESTIMONIALS = [
  { quote: QUOTE, name: "Lillian Pratt", avatar: avatar1 },
  { quote: QUOTE, name: "Nicholas Newark", avatar: avatar2 },
  { quote: QUOTE, name: "Kyrie Rivera", avatar: avatar3 },
];

export function TestimonialsSection() {
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
          {TESTIMONIALS.map((t, i) => (
            <FadeIn key={t.name} delay={i * 0.1}>
              <TestimonialCard {...t} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
