import type { Ref } from "react";
import { HokamiWordmark } from "@/components/brand/hokami-wordmark";
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
      <HokamiWordmark className="h-[18.304px] w-[103.615px]" />
    </Link>
  );
}
