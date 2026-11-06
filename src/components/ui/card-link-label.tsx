import Image from "next/image";
import type { ReactNode } from "react";
import { MonoText } from "@/components/typography/mono-text";
import { cn } from "@/lib/utils";

/** Visual label inside a single card link; it does not add another tab stop. */
export function CardLinkLabel({
  children,
  className,
  lang,
}: {
  children: ReactNode;
  className?: string;
  lang?: string;
}) {
  return (
    <MonoText
      as="span"
      lang={lang}
      className={cn(
        "relative flex min-h-11 max-w-full items-center gap-2 py-3 transition-colors duration-250 group-hover/card-link:text-text-accent-hover group-focus-visible/card-link:text-text-accent-hover after:absolute after:bottom-[6.5px] after:left-0 after:h-[1.5px] after:w-[5%] after:bg-current after:transition-[width] after:duration-250 group-hover/card-link:after:w-full group-focus-visible/card-link:after:w-full",
        className,
      )}
    >
      <span className="min-w-0">{children}</span>
      <Image
        src="/images/about/press/external-link.svg"
        alt=""
        aria-hidden="true"
        width={16}
        height={16}
        unoptimized
        className="shrink-0"
      />
    </MonoText>
  );
}
