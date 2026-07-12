"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./logo";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/thinking-out-loud" },
  { label: "Services", href: "/services" },
  { label: "Resources", href: "/freebies" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4 md:px-10">
        <Link href="/">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-serif text-base text-ink transition-colors hover:text-accent-orange"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center justify-center md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="size-6 text-ink" /> : <Menu className="size-6 text-ink" />}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-black/5 px-6 py-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="py-2 font-serif text-base text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
