"use client";

import dynamic from "next/dynamic";
import type { FAQItem } from "@/components/home/HomePageView";

const FAQAccordion = dynamic(() => import("@/components/FAQAccordion"), {
  loading: () => (
    <div className="space-y-3" role="status" aria-label="Loading FAQ">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-14 animate-pulse rounded-2xl border border-emerald-200/60 bg-white/80 dark:border-emerald-500/10 dark:bg-emerald-950/30"
        />
      ))}
    </div>
  ),
});

export default function HomeFAQ({ items }: { items: FAQItem[] }) {
  return <FAQAccordion items={items} />;
}
