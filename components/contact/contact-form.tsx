"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Send, TriangleAlert } from "lucide-react";
import { Card } from "@/components/ui/card";

const inputClasses =
  "h-11 w-full rounded-xl border border-contact-border bg-contact-input px-4 text-sm text-contact-ink placeholder:text-contact-body focus:border-contact-accent focus:outline-none focus:ring-2 focus:ring-contact-accent/20";

const labelClasses = "font-script text-lg text-contact-accent";

const NUDGE_DURATION_MS = 4000;

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!showNudge) return;
    const timer = setTimeout(() => setShowNudge(false), NUDGE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [showNudge]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSending || submitted) return;
    if (!agreed) {
      setShowNudge(true);
      return;
    }

    const data = new FormData(e.currentTarget);
    setErrorMessage(null);
    setIsSending(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          reason: data.get("reason"),
          message: data.get("message"),
          agreed,
        }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(body?.error || "Something went wrong. Please try again.");
      }

      setSubmitted(true);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSending(false);
    }
  }

  return (
    <Card className="bg-contact-card border-contact-border relative overflow-hidden p-8 md:p-10">
      <div
        className="pointer-events-none absolute -top-6 -right-6 size-24 rounded-full opacity-90"
        style={{ background: "#f0c368" }}
        aria-hidden
      />

      <form onSubmit={handleSubmit} className="relative flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className={labelClasses}>
              your name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="e.g. Anaya"
              className={inputClasses}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className={labelClasses}>
              email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@somewhere.com"
              className={inputClasses}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="phone" className={labelClasses}>
              phone number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="e.g. +1 555 123 4567"
              className={inputClasses}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="reason" className={labelClasses}>
              reaching out about
            </label>
            <div className="relative">
              <select
                id="reason"
                name="reason"
                defaultValue=""
                className={`${inputClasses} appearance-none pr-10`}
              >
                <option value="" disabled>
                  Choose one
                </option>
                <option value="session">A session for myself</option>
                <option value="workshop">A workshop for my team</option>
                <option value="school">School partnership</option>
                <option value="other">Something else</option>
              </select>
              <ChevronDown className="text-contact-body pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="message" className={labelClasses}>
            your message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            placeholder="Say as little or as much as you'd like. This is a safe place to begin."
            className={`${inputClasses} h-auto resize-y py-3`}
          />
        </div>

        <label className="text-contact-body flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            name="follow-up"
            checked={agreed}
            onChange={(e) => {
              setAgreed(e.target.checked);
              if (e.target.checked) setShowNudge(false);
            }}
            className="accent-contact-accent mt-1 size-4 shrink-0"
          />
          I&rsquo;d like Recap to reach out to me about my message. My details
          stay private and are never shared.
        </label>

        <AnimatePresence>
          {showNudge && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              role="alert"
              className="border-accent-red/30 bg-accent-red/10 text-accent-red flex items-center gap-2 rounded-xl border px-4 py-3 text-sm"
            >
              <TriangleAlert className="size-4 shrink-0" />
              Please tick the box above so we know it&rsquo;s okay to reach
              out.
            </motion.p>
          )}
          {errorMessage && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              role="alert"
              className="border-accent-red/30 bg-accent-red/10 text-accent-red flex items-center gap-2 rounded-xl border px-4 py-3 text-sm"
            >
              <TriangleAlert className="size-4 shrink-0" />
              {errorMessage}
            </motion.p>
          )}
        </AnimatePresence>

        <button
          type="submit"
          aria-disabled={!agreed || isSending || submitted}
          className={`flex h-13 items-center justify-center gap-2 rounded-2xl text-base font-medium text-white transition-colors ${
            agreed
              ? "bg-[#2b1f17] hover:bg-[#2b1f17]/90"
              : "bg-[#2b1f17]/40 hover:bg-[#2b1f17]/40"
          }`}
        >
          <Send className="size-4" />
          {submitted ? "Sent!" : isSending ? "Sending…" : "Send it across"}
        </button>
        <p className="text-contact-body text-center text-sm italic">
          Replies are personal and usually arrive within 48 hours.
        </p>
      </form>
    </Card>
  );
}
