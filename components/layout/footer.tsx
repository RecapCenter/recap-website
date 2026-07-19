import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { InstagramIcon, LinkedinIcon } from "@/components/ui/social-icons";
import { NewsletterForm } from "./newsletter-form";
import { Logo } from "./logo";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Blog", href: "/thinking-out-loud" },
  { label: "Reviews", href: "/reviews" },
  { label: "Contact", href: "/contact" },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/recap_center", icon: InstagramIcon },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/recapcenter/", icon: LinkedinIcon },
  { label: "WhatsApp Community", href: "https://whatsapp.com/channel/0029VbD8p3gAjPXDr1Njyq3d", icon: MessageCircle },
];

export default function Footer() {
  return (
    <footer className="bg-footer-bg text-cream relative overflow-hidden">
      <div
        className="pointer-events-none absolute -top-32 -left-32 size-96 rounded-full opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, var(--footer-accent), transparent 70%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-32 -bottom-32 size-96 rounded-full opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, var(--footer-accent), transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1200px] px-6 py-8 md:px-10 md:py-10">
        <div className="flex flex-col gap-6 md:flex-row md:justify-between">
          <div className="flex flex-col gap-2 md:max-w-md">
            <Link href="/">
              <Logo variant="cream" />
            </Link>
            <p className="font-serif text-xl leading-snug md:text-2xl">
              be gentle with the{" "}
              <em className="font-script text-footer-accent not-italic">
                version
              </em>{" "}
              of you that&rsquo;s{" "}
              <em className="font-script text-footer-accent not-italic">
                still learning.
              </em>
            </p>
          </div>

          <div className="flex flex-col gap-2 md:max-w-xs">
            <span className="font-script text-footer-accent text-xl">
              the slow letter
            </span>
            <p className="text-cream/80 text-sm">
              One reflection, once a month.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="my-6 h-px bg-white/10" />

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
            {NAV_LINKS.map((link, i) => (
              <span key={link.href} className="flex items-center gap-2">
                <Link
                  href={link.href}
                  className="text-cream/90 hover:text-footer-accent"
                >
                  {link.label}
                </Link>
                {i < NAV_LINKS.length - 1 && (
                  <span className="text-footer-muted">·</span>
                )}
              </span>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                className="text-cream/90 hover:border-footer-accent hover:text-footer-accent flex size-9 items-center justify-center rounded-full border border-white/20 transition-colors"
              >
                <Icon className="size-4" />
              </Link>
            ))}
          </div>
        </div>

        <div className="my-6 h-px bg-white/10" />

        <div className="flex flex-col gap-2 text-sm md:flex-row md:items-center md:justify-between">
          <p className="text-cream/70 font-serif italic">
            Recap — Realm of Counselling &amp; Psychological Services
          </p>
          <div className="text-cream/60 flex flex-wrap items-center gap-x-4 gap-y-1">
            <Link href="/faq" className="hover:text-cream">
              FAQ
            </Link>
            <Link href="/privacy" className="hover:text-cream">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-cream">
              Terms
            </Link>
            <span>© 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
