"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 10);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="bg-cream/95 sticky top-0 z-50 border-b border-black/5 backdrop-blur">
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

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-ink hover:text-accent-orange font-serif text-base transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
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
        <nav className="flex flex-col gap-1 border-t border-black/5 px-6 py-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
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
