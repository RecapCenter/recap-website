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
  { label: "Contact", href: "/contact" },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "#", icon: InstagramIcon },
  { label: "LinkedIn", href: "#", icon: LinkedinIcon },
  { label: "Chat with us", href: "/contact", icon: MessageCircle },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-footer-bg text-cream">
      <div
        className="pointer-events-none absolute -left-32 -top-32 size-96 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--footer-accent), transparent 70%)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-32 -right-32 size-96 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--footer-accent), transparent 70%)" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1200px] px-6 py-16 md:px-10 md:py-20">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="flex flex-col gap-4 md:max-w-md">
            <Link href="/">
              <Logo variant="cream" />
            </Link>
            <p className="font-serif text-2xl leading-snug md:text-3xl">
              be gentle with the{" "}
              <em className="not-italic font-script text-footer-accent">version</em> of you
              that&rsquo;s{" "}
              <em className="not-italic font-script text-footer-accent">still learning.</em>
            </p>
            <p className="text-xs uppercase tracking-widest text-footer-muted">
              THE RECAP STUDIO · EST. 2019 · BENGALURU
            </p>
          </div>

          <div className="flex flex-col gap-3 md:max-w-xs">
            <span className="font-script text-xl text-footer-accent">the slow letter</span>
            <p className="text-sm text-cream/80">One reflection, once a month.</p>
            <NewsletterForm />
          </div>
        </div>

        <div className="my-10 h-px bg-white/10" />

        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
            {NAV_LINKS.map((link, i) => (
              <span key={link.href} className="flex items-center gap-2">
                <Link href={link.href} className="text-cream/90 hover:text-footer-accent">
                  {link.label}
                </Link>
                {i < NAV_LINKS.length - 1 && <span className="text-footer-muted">·</span>}
              </span>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                className="flex size-9 items-center justify-center rounded-full border border-white/20 text-cream/90 transition-colors hover:border-footer-accent hover:text-footer-accent"
              >
                <Icon className="size-4" />
              </Link>
            ))}
          </div>
        </div>

        <div className="my-10 h-px bg-white/10" />

        <div className="flex flex-col gap-2 text-sm md:flex-row md:items-center md:justify-between">
          <p className="font-serif italic text-cream/70">
            Recap — Counselling &amp; Psychological Services
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-cream/60">
            <span>made with ❤️ in watercolor</span>
            <Link href="#" className="hover:text-cream">Privacy</Link>
            <Link href="#" className="hover:text-cream">Terms</Link>
            <span>© 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
