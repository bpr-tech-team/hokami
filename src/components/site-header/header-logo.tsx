import Image from "next/image";
import type { Ref } from "react";
import { Link } from "@/i18n/navigation";

export function HeaderLogo({
  label,
  onNavigate,
  ref,
}: {
  label: string;
  onNavigate?: () => void;
  ref?: Ref<HTMLAnchorElement>;
}) {
  return (
    <Link
      ref={ref}
      href="/"
      data-slot="header-logo"
      className="inline-flex min-h-11 shrink-0 items-center"
      aria-label={label}
      onClick={onNavigate}
    >
      <Image
        src="/images/header/wordmark.svg"
        alt="HOKAMI"
        width={103.615}
        height={18.304}
        className="h-[18.304px] w-[103.615px]"
        unoptimized
        loading="eager"
      />
    </Link>
  );
}
