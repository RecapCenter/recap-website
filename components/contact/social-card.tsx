import { MessageCircle, Camera } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { Card } from "@/components/ui/card";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { LinkedinIcon } from "@/components/ui/social-icons";

const SOCIAL_LINKS = [
  { label: "Instagram", href: "#", icon: Camera },
  { label: "LinkedIn", href: "#", icon: LinkedinIcon },
  { label: "WhatsApp community", href: "#", icon: MessageCircle },
];

export function SocialCard() {
  return (
    <FadeIn className="mx-auto max-w-3xl px-6 md:max-w-5xl">
      <Card className="flex flex-col gap-6 bg-contact-card-warm border-contact-border p-8 md:flex-row md:items-center md:justify-between md:p-10">
        <div>
          <EyebrowLabel color="orange">or, come sit with us</EyebrowLabel>
          <h2 className="mt-2 font-serif text-2xl text-contact-ink md:text-3xl">
            elsewhere on the internet
          </h2>
          <p className="mt-2 max-w-md text-sm text-contact-body">
            Gentle reflections, journaling prompts, and behind-the-scenes from
            the studio.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              className="flex items-center gap-2 rounded-full border border-contact-border bg-white px-5 py-2.5 text-sm text-contact-ink transition-colors hover:border-contact-accent"
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
