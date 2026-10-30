import Image from "next/image";

export function IndustryChevron() {
  return (
    <span className="relative size-6 shrink-0" aria-hidden="true">
      <Image
        src="/images/industries/chevron.svg"
        alt=""
        width={24}
        height={24}
        unoptimized
        className="absolute inset-0 transition-opacity duration-500 group-hover/accordion-trigger:opacity-0 group-aria-expanded/accordion-trigger:opacity-0"
      />
      <Image
        src="/images/industries/chevron-active.svg"
        alt=""
        width={24}
        height={24}
        unoptimized
        className="absolute inset-0 opacity-0 transition-[opacity,rotate] duration-500 ease-[cubic-bezier(.2,.7,.2,1)] group-hover/accordion-trigger:opacity-100 group-aria-expanded/accordion-trigger:rotate-180 group-aria-expanded/accordion-trigger:opacity-100"
      />
    </span>
  );
}
