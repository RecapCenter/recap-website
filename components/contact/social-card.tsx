import { MessageCircle } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { Card } from "@/components/ui/card";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { InstagramIcon, LinkedinIcon  } from "@/components/ui/social-icons";

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/recap_center", icon: InstagramIcon },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/recapcenter/", icon: LinkedinIcon },
  { label: "WhatsApp Community", href: "https://whatsapp.com/channel/0029VbD8p3gAjPXDr1Njyq3d", icon: MessageCircle },
];

export function SocialCard() {
  return (
    <FadeIn className="mx-auto max-w-3xl px-6 md:max-w-5xl">
      <Card className="bg-contact-card-warm border-contact-border flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between md:p-10">
        <div>
          <EyebrowLabel color="orange">or, come sit with us</EyebrowLabel>
          <h2 className="text-contact-ink mt-2 font-serif text-2xl md:text-3xl">
            elsewhere on the internet
          </h2>
          <p className="text-contact-body mt-2 max-w-md text-sm">
            Gentle reflections, journaling prompts, and behind-the-scenes from
            the studio.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              className="border-contact-border text-contact-ink hover:border-contact-accent flex items-center gap-2 rounded-full border bg-white px-5 py-2.5 text-sm transition-colors"
            >
              <Icon className="size-4" />
              {label}
            </a>
          ))}
        </div>
      </Card>
    </FadeIn>
  );
}
