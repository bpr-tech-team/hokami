import Image from "next/image";
import { cn } from "@/lib/utils";
import { MonoText } from "@/components/typography/mono-text";
import type { Industry } from "./types";

export function IndustryImage({
  industry,
  showCode = false,
}: {
  industry: Industry;
  showCode?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-surface-inverse",
        showCode ? "h-full" : "h-[200px] shrink-0 tablet:h-80 desktop:hidden",
      )}
    >
      <Image
        src={industry.image}
        alt={industry.imageAlt}
        fill
        sizes={
          showCode
            ? "(min-width: 1360px) 700px, 54vw"
            : "(min-width: 1080px) 1px, (min-width: 760px) calc(100vw - 120px), calc(100vw - 80px)"
        }
        className="object-cover"
      />
      {showCode && (
        <MonoText
          as="span"
          tone="inverse"
          className="absolute bottom-8 left-8 flex items-center gap-2.5 border border-action-primary bg-surface-inverse px-3 py-2 backdrop-blur-sm"
        >
          <span
            className="size-1.5 shrink-0 rounded-[50%] bg-action-primary shadow-[0_0_8px_rgb(from_var(--color-brand-identity)_r_g_b/0.8)]"
            aria-hidden="true"
          />
          {industry.code}
        </MonoText>
      )}
    </div>
  );
}
