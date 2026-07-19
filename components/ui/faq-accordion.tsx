"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export type FAQEntry = {
  question: string;
  answer: string;
};

function FAQItem({ question, answer }: FAQEntry) {
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
            <p className="text-body-gray mt-3 max-w-2xl text-sm leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQAccordion({ items }: { items: FAQEntry[] }) {
  return (
    <div>
      {items.map((item) => (
        <FAQItem key={item.question} {...item} />
      ))}
    </div>
  );
}
