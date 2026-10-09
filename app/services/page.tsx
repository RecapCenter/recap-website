import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/page-intro";
import { CTABanner } from "@/components/ui/cta-banner";
import { ServicesDetailSection } from "@/components/services/services-detail-section";
import { HowItWorksSection } from "@/components/services/how-it-works-section";
import { ServicesFAQSection } from "@/components/services/services-faq-section";
import servicesIcon from "@/assets/icons/services-logo.svg";

export const metadata: Metadata = {
  title: "Services — Recap",
  alternates: { canonical: "/services" },
  description:
    "Special education, counselling and trainings that bring together psychological understanding and human connection — support that meets you where you are.",
};

export default function ServicesPage() {
  return (
    <main>
      <PageIntro
        icon={servicesIcon}
        iconBg="var(--pastel-lavender)"
        eyebrow="our services"
        heading="Support that meets you where you are."
        subtext="Every person comes with a different story, and meaningful support cannot follow a one-size-fits-all approach. At Recap, our services bring together psychological understanding, education and human connection to help individuals, families, educators and organisations move forward with greater clarity and confidence."
      />
      <ServicesDetailSection />
      <HowItWorksSection />
      <ServicesFAQSection />
      <CTABanner
        eyebrow="not sure where to start?"
        heading="Tell us what's going on. We'll help you find the fit."
        subtext="No forms, no diagnosis needed — just a real conversation about what would actually help."
        buttonLabel="Get in touch"
        buttonHref="/contact"
      />
    </main>
  );
}
