"use client";

import { useState } from "react";
import { ChevronDown, Send } from "lucide-react";
import { Card } from "@/components/ui/card";

const inputClasses =
  "h-11 w-full rounded-xl border border-contact-border bg-contact-input px-4 text-sm text-contact-ink placeholder:text-contact-body focus:border-contact-accent focus:outline-none focus:ring-2 focus:ring-contact-accent/20";

const labelClasses = "font-script text-lg text-contact-accent";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <Card className="relative overflow-hidden bg-contact-card border-contact-border p-8 md:p-10">
      <div
        className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full opacity-90"
        style={{ background: "#f0c368" }}
        aria-hidden
      />

      <form onSubmit={handleSubmit} className="relative flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className={labelClasses}>your name</label>
            <input id="name" name="name" type="text" required placeholder="e.g. Anaya" className={inputClasses} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className={labelClasses}>email</label>
            <input id="email" name="email" type="email" required placeholder="you@somewhere.com" className={inputClasses} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="subject" className={labelClasses}>subject</label>
            <input id="subject" name="subject" type="text" placeholder="A short line about it" className={inputClasses} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="reason" className={labelClasses}>reaching out about</label>
            <div className="relative">
              <select
                id="reason"
                name="reason"
                defaultValue=""
                className={`${inputClasses} appearance-none pr-10`}
              >
                <option value="" disabled>Choose one</option>
                <option value="session">A session for myself</option>
                <option value="workshop">A workshop for my team</option>
                <option value="school">School partnership</option>
                <option value="other">Something else</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-contact-body" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="message" className={labelClasses}>your message</label>
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            placeholder="Say as little or as much as you'd like. This is a safe place to begin."
            className={`${inputClasses} h-auto resize-y py-3`}
          />
        </div>

        <label className="flex items-start gap-3 text-sm text-contact-body">
          <input
            type="radio"
            name="follow-up"
            className="mt-1 size-4 shrink-0 accent-contact-accent"
          />
          I&rsquo;d like Recap to reach out to me about my message. My details
          stay private and are never shared.
        </label>

        <button
          type="submit"
          className="flex h-13 items-center justify-center gap-2 rounded-2xl bg-[#2b1f17] text-base font-medium text-white transition-colors hover:bg-[#2b1f17]/90"
        >
          <Send className="size-4" />
          {submitted ? "Sent!" : "Send it across"}
        </button>
        <p className="text-center text-sm italic text-contact-body">
          Replies are personal and usually arrive within 48 hours.
        </p>
      </form>
    </Card>
  );
}
