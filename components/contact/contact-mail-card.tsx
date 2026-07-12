import { Mail } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { Card } from "@/components/ui/card";
import { IconBadge } from "@/components/ui/icon-badge";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";

export function ContactMailCard() {
  return (
    <FadeIn className="mx-auto max-w-3xl px-6">
      <Card className="bg-contact-card border-contact-border relative overflow-hidden p-8 md:p-10">
        <div
          className="pointer-events-none absolute -top-10 -right-10 size-40 rounded-full opacity-50 blur-2xl"
          style={{
            background: "radial-gradient(circle, #f0c368, transparent 70%)",
          }}
          aria-hidden
        />
        <IconBadge bg="#f5dfa9" size="lg">
          <Mail className="text-contact-ink size-6" />
        </IconBadge>
        <div className="relative mt-4">
          <EyebrowLabel color="orange">write to us</EyebrowLabel>
          <p className="mt-1">
            <a
              href="mailto:hello@recap.co"
              className="text-lg text-[#3b5b7a] hover:underline"
            >
              hello@recap.co
            </a>
          </p>
        </div>
      </Card>
    </FadeIn>
  );
}
