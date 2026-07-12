"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NewsletterForm() {
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmail("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 sm:flex-row sm:items-center"
    >
      <div className="flex h-11 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4">
        <Mail className="text-footer-muted size-4 shrink-0" />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@somewhere.com"
          className="text-cream placeholder:text-footer-muted w-full bg-transparent text-sm focus:outline-none sm:w-56"
        />
      </div>
      <Button type="submit" variant="solid-accent" className="w-full sm:w-auto">
        Subscribe
      </Button>
    </form>
  );
}
