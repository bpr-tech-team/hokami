"use client";

import { useState } from "react";
import { Accordion } from "@/components/ui/accordion";
import { IndustryGallery } from "./industry-gallery";
import { IndustryItem } from "./industry-item";
import type { Industry } from "./types";

export function IndustryAccordion({ items }: { items: Industry[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  function changeIndustry(value: string[]) {
    const nextIndex = items.findIndex((item) => item.id === value[0]);
    // The design always keeps one industry open, including on repeated clicks.
    if (nextIndex !== -1) setActiveIndex(nextIndex);
  }

  return (
    <div className="py-6 desktop:border-y desktop:border-border-brand-subtle">
      <div className="desktop:grid desktop:grid-cols-[5fr_7fr]">
        <Accordion
          value={[items[activeIndex].id]}
          onValueChange={changeIndustry}
          className="min-w-0 border-t border-border-brand-subtle desktop:min-h-[536px] desktop:border-r"
        >
          {items.map((industry) => (
            <IndustryItem key={industry.id} industry={industry} />
          ))}
        </Accordion>
        <IndustryGallery items={items} activeIndex={activeIndex} />
      </div>
    </div>
  );
}
