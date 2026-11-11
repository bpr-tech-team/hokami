import Image from "next/image";
import { cn } from "@/lib/utils";

export function HokamiWordmark({ className }: { className?: string }) {
  return (
    <Image
      src="/images/header/wordmark.svg"
      alt="HOKAMI"
      width={751}
      height={98}
      className={cn("h-auto w-35", className)}
      unoptimized
      loading="eager"
    />
  );
}
