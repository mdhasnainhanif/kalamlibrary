"use client";

import { useState } from "react";

interface FAQItem {
  q: string;
  a: string;
}

export default function FAQAccordion({ items }: { items: FAQItem[] }) {
  // Open the first item by default (index 0)
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="flex flex-col gap-4">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        const questionId = `faq-question-${idx}`;
        const answerId = `faq-answer-${idx}`;

        return (
          <div
            key={idx}
            className="rounded-xl bg-emerald-900/10 border border-emerald-500/10 overflow-hidden transition-all duration-300"
          >
            <button
              id={questionId}
              type="button"
              onClick={() => toggleIndex(idx)}
              aria-expanded={isOpen}
              aria-controls={answerId}
              className="w-full p-5 flex justify-between items-center text-left font-bold text-gray-100 text-sm md:text-base hover:text-gold-500 transition-colors focus:outline-none cursor-pointer"
            >
              <span className="pr-4">{item.q}</span>
              <svg
                aria-hidden="true"
                className={`w-4 h-4 text-gold-500 transition-transform duration-300 shrink-0 ${
                  isOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <div
              id={answerId}
              role="region"
              aria-labelledby={questionId}
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isOpen ? "max-h-[300px] opacity-100 border-t border-emerald-500/5" : "max-h-0 opacity-0"
              }`}
            >
              <p 
                className="p-5 text-xs md:text-sm text-gray-400 leading-relaxed bg-emerald-950/20 font-sans"
                dangerouslySetInnerHTML={{ __html: item.a }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
