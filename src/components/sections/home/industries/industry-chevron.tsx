import { ChevronIcon } from "@/components/ui/icons/chevron-icon";

export function IndustryChevron() {
  return (
    <ChevronIcon className="size-6 text-text-tertiary transition-[color,rotate] duration-500 ease-[cubic-bezier(.2,.7,.2,1)] group-hover/accordion-trigger:text-text-accent group-aria-expanded/accordion-trigger:rotate-180 group-aria-expanded/accordion-trigger:text-text-accent" />
  );
}
