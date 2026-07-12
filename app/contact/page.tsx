import type { Metadata } from "next";
import { ContactHero } from "@/components/contact/contact-hero";
import { ContactMailCard } from "@/components/contact/contact-mail-card";
import { NoteAndFormSection } from "@/components/contact/note-and-form-section";
import { SocialCard } from "@/components/contact/social-card";
import { FAQSection } from "@/components/contact/faq-section";

export const metadata: Metadata = {
  title: "Contact — Recap",
  description:
    "Get in touch with Recap — whether it's a session for yourself, a workshop for your team, or a message you've been meaning to send.",
};

export default function ContactPage() {
  return (
    <main>
      <ContactHero />
      <div className="bg-contact-bg pb-8">
        <ContactMailCard />
      </div>
      <NoteAndFormSection />
      <div className="bg-contact-bg pb-16">
        <SocialCard />
      </div>
      <FAQSection />
    </main>
  );
}
