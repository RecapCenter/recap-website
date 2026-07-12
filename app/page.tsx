import { HeroSection } from "@/components/home/hero-section";
import { QuickLinkGrid } from "@/components/home/quick-link-grid";
import { ServicesSection } from "@/components/home/services-section";
import { GlobeSection } from "@/components/home/globe-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <QuickLinkGrid />
      <ServicesSection />
      <GlobeSection />
      <TestimonialsSection />
    </main>
  );
}
