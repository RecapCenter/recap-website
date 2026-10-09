"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/thinking-out-loud" },
  { label: "Services", href: "/services" },
  { label: "Resources", href: "/freebies" },
  { label: "Reviews", href: "/reviews" },
  { label: "Contact", href: "/contact" },
];

/** The current page (or a section's sub-page) gets aria-current for screen readers. */
function isCurrent(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Escape closes the mobile menu and returns focus to its toggle button.
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);
  const [scrolled, setScrolled] = useState(false);
  // The bar is fixed and floats over the top of every page, so each page's
  // first section pads itself by --nav-height (app/globals.css).
  // Transparent at the top of the page; cream once scrolled or while the
  // mobile menu is open (so the menu never floats over content unreadably).
  const solid = scrolled || open;

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 10);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ease-out",
        solid
          ? "bg-cream/95 border-black/5 backdrop-blur"
          : "border-transparent bg-transparent",
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-[1200px] items-center justify-between px-6 transition-[padding] duration-300 ease-out md:px-10",
          scrolled ? "py-2" : "py-4",
        )}
      >
        <Link
          href="/"
          className={cn(
            "origin-left transition-transform duration-300 ease-out",
            scrolled && "scale-90",
          )}
        >
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isCurrent(pathname, link.href) ? "page" : undefined}
              className="text-ink hover:text-accent-orange font-serif text-base transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-controls="mobile-menu"
          className="-mr-2 flex size-11 items-center justify-center md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? (
            <X className="text-ink size-6" />
          ) : (
            <Menu className="text-ink size-6" />
          )}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Main"
          className="flex flex-col gap-1 border-t border-black/5 px-6 py-4 md:hidden"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isCurrent(pathname, link.href) ? "page" : undefined}
              onClick={() => setOpen(false)}
              className="text-ink py-2 font-serif text-base"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
