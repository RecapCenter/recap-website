import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { ArchImageCard } from "./arch-image-card";
import counselingImage from "@/assets/images/home/service-counseling.png";
import specialEducationImage from "@/assets/images/home/service-special-education.png";
import trainingsImage from "@/assets/images/home/service-trainings.png";

const SERVICES = [
  {
    image: counselingImage,
    title: "Counseling",
    subtext: "1:1 and family sessions for stress, transitions, and everyday worries.",
  },
  {
    image: specialEducationImage,
    title: "Special Education",
    subtext: "Personalized learning support for kids who learn differently.",
  },
  {
    image: trainingsImage,
    title: "Trainings",
    subtext: "Workshops for schools and parents on behavior and development.",
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
        <FadeIn delay={0.3} className="mt-14 flex justify-center">
          <Button
            href="/services"
            icon={<ArrowRight className="size-4" />}
          >
            Explore our Services
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}
