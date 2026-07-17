"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";

export function NotifyForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setEmail("");
  }

  return (
    <section className="px-6 pb-20 md:pb-24">
      <FadeIn className="mx-auto max-w-xl text-center">
        <SectionHeading as="h3">Want early access?</SectionHeading>
        <p className="text-body-gray mx-auto mt-3 max-w-md text-sm leading-relaxed">
          Leave your email and we&apos;ll let you know the moment Recap Lab
          opens up.
        </p>
        <form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center"
        >
          <div className="border-border focus-within:ring-accent-orange/20 focus-within:border-accent-orange flex h-11 items-center gap-2 rounded-full border bg-white px-4 focus-within:ring-2">
            <Mail className="text-body-gray size-4 shrink-0" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@somewhere.com"
              aria-label="Email address"
              className="text-ink placeholder:text-body-gray/70 w-full bg-transparent text-sm focus:outline-none sm:w-56"
            />
          </div>
          <Button type="submit" variant="solid-accent" className="w-full sm:w-auto">
            {submitted ? "You're on the list!" : "Notify me"}
          </Button>
        </form>
      </FadeIn>
    </section>
  );
}
