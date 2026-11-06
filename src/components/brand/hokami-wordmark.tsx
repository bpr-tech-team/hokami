import Image from "next/image";

export function HokamiWordmark({ className }: { className?: string }) {
  return (
    <Image
      src="/images/header/wordmark.svg"
      alt="HOKAMI"
      width={103.615}
      height={18.304}
      className={className}
      unoptimized
      loading="eager"
    />
  );
}
