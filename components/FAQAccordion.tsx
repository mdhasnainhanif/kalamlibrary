"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { faqItemSurfaceClass } from "@/utils/kalamCardStyles";

interface FAQItem {
  q: string;
  a: string;
}

export default function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reduceMotion = useReducedMotion();

  const toggleIndex = (idx: number) => {
    setOpenIndex((current) => (current === idx ? null : idx));
  };

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        const questionId = `faq-question-${idx}`;
        const answerId = `faq-answer-${idx}`;

        return (
          <div
            key={idx}
            className={faqItemSurfaceClass}
          >
            <button
              id={questionId}
              type="button"
              onClick={() => toggleIndex(idx)}
              aria-expanded={isOpen}
              aria-controls={answerId}
              className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left text-sm font-bold text-slate-800 transition-colors hover:text-gold-500 focus:outline-none md:text-base dark:text-gray-100"
            >
              <span className="pr-2">{item.q}</span>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.25 }}
                className="shrink-0 text-gold-500"
              >
                <ChevronDown className="h-5 w-5" aria-hidden />
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  id={answerId}
                  role="region"
                  aria-labelledby={questionId}
                  key="content"
                  initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden border-t border-emerald-100 dark:border-emerald-500/5"
                >
                  <p
                    className="bg-emerald-50/80 p-5 text-sm leading-relaxed text-slate-600 dark:bg-emerald-950/20 dark:text-gray-400"
                    dangerouslySetInnerHTML={{ __html: item.a }}
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
