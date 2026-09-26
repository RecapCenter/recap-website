"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { SectionHeading } from "@/components/ui/section-heading";
import { FAQS } from "@/lib/faqs";

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
        <span className="font-serif text-ink text-lg md:text-xl">
          {question}
        </span>
        <ChevronDown
          className={`text-body-gray size-5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="text-body-gray mt-3 max-w-2xl text-base leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ServicesFAQSection() {
  return (
    <section className="bg-cream px-6 py-20 md:py-24">
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
