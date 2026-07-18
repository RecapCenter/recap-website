"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { SectionHeading } from "@/components/ui/section-heading";

const FAQS = [
  {
    question: "Which service is right for us?",
    answer:
      "Honestly, tell us what's going on and we'll point you the right way — most families start with a quick chat, not a decision.",
  },
  {
    question: "Do you work directly with schools?",
    answer:
      "Yes — both through special education support and trainings for staff. We're used to working alongside teachers and IEP teams.",
  },
  {
    question: "Are sessions covered by insurance?",
    answer:
      "It depends on your provider. Write in and we'll help you figure out what's possible.",
  },
  {
    question: "How long does support usually last?",
    answer:
      "There's no fixed timeline. Some families come for a few sessions, others for longer — we go at your pace.",
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-border border-b border-dashed py-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 text-left"
        aria-expanded={open}
      >
        <span className="font-display text-ink text-lg font-bold md:text-xl">
          {question}
        </span>
        <ChevronDown
          className={`text-body-gray size-5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <p className="text-body-gray mt-3 max-w-2xl text-sm leading-relaxed">
          {answer}
        </p>
      )}
    </div>
  );
}

export function ServicesFAQSection() {
  return (
    <section className="bg-white px-6 py-20 md:py-24">
      <div className="mx-auto max-w-3xl">
        <FadeIn className="text-center">
          <EyebrowLabel withDottedLines>before you write</EyebrowLabel>
          <SectionHeading as="h2" className="mt-3">
            Small things you might be wondering.
          </SectionHeading>
        </FadeIn>
        <FadeIn delay={0.1} className="mt-10">
          {FAQS.map((faq) => (
            <FAQItem key={faq.question} {...faq} />
          ))}
        </FadeIn>
      </div>
    </section>
  );
}
