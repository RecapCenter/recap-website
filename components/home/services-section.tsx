import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/ui/section-heading";
import { ArchImageCard } from "./arch-image-card";
import counselingImage from "@/assets/images/home/service-counseling.png";
import specialEducationImage from "@/assets/images/home/service-special-education.png";
import trainingsImage from "@/assets/images/home/service-trainings.png";

// TODO: replace placeholder subtext (carried over verbatim from source screenshots) with real service copy
const SERVICES = [
  {
    image: counselingImage,
    title: "Counseling",
    subtext: "2 bedrooms | 2 King beds | Up to 4 guests",
  },
  {
    image: specialEducationImage,
    title: "Special Education",
    subtext: "1 Queen and 1 Single Bed | Up to 3 guests",
  },
  {
    image: trainingsImage,
    title: "Trainings",
    subtext: "1 Queen or 2 Single Beds | Up to 2 guests",
  },
];

export function ServicesSection() {
  return (
    <section className="bg-pastel-lavender px-6 py-20 md:py-24">
      <div className="mx-auto max-w-[1200px]">
        <FadeIn className="text-center">
          <SectionHeading as="h2">Services</SectionHeading>
        </FadeIn>
        <div className="mt-14 grid grid-cols-1 gap-12 sm:grid-cols-3 sm:gap-6">
          {SERVICES.map((service, i) => (
            <FadeIn key={service.title} delay={i * 0.1}>
              <ArchImageCard {...service} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
