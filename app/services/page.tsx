import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/page-intro";
import { CTABanner } from "@/components/ui/cta-banner";
import { ServicesDetailSection } from "@/components/services/services-detail-section";
import { HowItWorksSection } from "@/components/services/how-it-works-section";
import { ServicesFAQSection } from "@/components/services/services-faq-section";
import servicesIcon from "@/assets/icons/services-logo.svg";

export const metadata: Metadata = {
  title: "Services — Recap",
  description:
    "Counselling, special education support, and trainings for schools and parent groups — support that meets you where you are.",
};

export default function ServicesPage() {
  return (
    <main>
      <PageIntro
        icon={servicesIcon}
        iconBg="var(--pastel-lavender)"
        eyebrow="what we offer"
        heading="Support that meets you where you are."
        subtext="Three ways we work alongside children, families, and schools — counselling, special education support, and training for the adults around them."
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
