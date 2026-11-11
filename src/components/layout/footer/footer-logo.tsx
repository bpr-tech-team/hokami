import Image from "next/image";
import { Link } from "@/i18n/navigation";

function BrandRule() {
  return (
    <span aria-hidden="true" className="h-[1.6px] flex-1 bg-brand-identity" />
  );
}

export function FooterLogo({ label }: { label: string }) {
  return (
    <Link
      href="/"
      aria-label={label}
      className="flex w-56 flex-col items-center gap-[9.6px]"
    >
      <Image
        src="/images/footer/wordmark.svg"
        alt="HOKAMI"
        width={751}
        height={98}
        className="h-auto w-full"
        unoptimized
      />
      <span className="flex h-[12.8px] w-full items-center gap-[9.6px]">
        <BrandRule />
        <Image
          src="/images/footer/tagline.svg"
          alt="PCBA production"
          width={114.584}
          height={6.26157}
          unoptimized
        />
        <BrandRule />
      </span>
    </Link>
  );
}
