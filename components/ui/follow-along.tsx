import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InstagramIcon, LinkedinIcon } from "@/components/ui/social-icons";
import { cn } from "@/lib/utils";
import {
  INSTAGRAM_URL,
  LINKEDIN_URL,
  WHATSAPP_CHANNEL_URL,
} from "@/lib/social";

/**
 * "Follow along" call to action used where the newsletter signup used to be
 * (see lib/features.ts): WhatsApp leads — its updates arrive as phone
 * notifications — with Instagram and LinkedIn as smaller icon links.
 * `dark` sits on the footer; `light` on cream sections.
 */
export function FollowAlong({
  variant,
  className,
}: {
  variant: "dark" | "light";
  className?: string;
}) {
  const iconLink =
    variant === "dark"
      ? "text-cream/90 hover:border-footer-accent hover:text-footer-accent border-white/20"
      : "text-ink hover:border-accent-orange hover:text-accent-orange border-border";

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3",
        variant === "light" && "justify-center",
        className,
      )}
    >
      <Button
        href={WHATSAPP_CHANNEL_URL}
        target="_blank"
        rel="noopener noreferrer"
        variant="solid-accent"
        icon={<MessageCircle className="size-4" aria-hidden />}
        iconPosition="left"
      >
        Follow on WhatsApp
        <span className="sr-only"> (opens in a new tab)</span>
      </Button>
      {[
        { label: "Instagram", href: INSTAGRAM_URL, Icon: InstagramIcon },
        { label: "LinkedIn", href: LINKEDIN_URL, Icon: LinkedinIcon },
      ].map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Recap on ${label} (opens in a new tab)`}
          className={cn(
            "flex size-11 items-center justify-center rounded-full border transition-colors",
            iconLink,
          )}
        >
          <Icon className="size-4" />
        </a>
      ))}
    </div>
  );
}
