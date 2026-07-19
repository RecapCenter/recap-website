"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";

const FAQS = [
  {
    question: "How soon will I hear back after I write in?",
    answer:
      "Usually within 48 hours. If it's urgent, say so in your message and we'll try to move faster.",
  },
  {
    question: "Are sessions online, in-person, or both?",
    answer:
      "Both — whatever fits your life better. Most families start online and decide from there.",
  },
  {
    question: "Is my message confidential?",
    answer: "Yes. Whatever you share with us stays between us, always.",
  },
  {
    question: "What if I'm not sure what I need yet?",
    answer:
      "That's completely fine — most people who write in start exactly there. We'll figure it out together.",
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-contact-border border-b border-dashed py-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 text-left"
        aria-expanded={open}
      >
        <span className="text-contact-ink font-serif text-lg md:text-xl">
          {question}
        </span>
        <ChevronDown
          className={`text-contact-body size-5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
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
            <p className="text-contact-body mt-3 max-w-2xl text-sm leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQSection() {
  return (
    <section className="bg-contact-bg px-6 py-20 md:py-24">
      <div className="mx-auto max-w-3xl">
        <FadeIn className="text-center">
          <EyebrowLabel color="orange">before you write</EyebrowLabel>
          <h2 className="text-contact-ink mt-3 font-serif text-3xl md:text-4xl">
            small things you might be wondering
          </h2>
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
