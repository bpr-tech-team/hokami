import type { ComponentProps } from "react";
import { cn } from "cn";
import { Section } from "@/components/layout/section";
import { ProcessRing } from "./process-ring";
import type { ProcessStep } from "./types";

type ProcessSectionProps = Omit<ComponentProps<typeof Section>, "children"> & {
  steps: readonly ProcessStep[];
};

function ProcessGlow({ className }: { className: string }) {
  return (
    <div
      data-slot="process-glow"
      className={cn(
        "absolute h-[974px] w-[1012px] bg-radial-[ellipse_closest-side_at_center] from-brand-identity/70 from-30% via-brand-identity/50 via-60% to-brand-identity/0",
        className,
      )}
    />
  );
}

export function ProcessSection({
  steps,
  className,
  contentClassName,
  ...props
}: ProcessSectionProps) {
  if (!steps.length) return null;

  return (
    <Section
      {...props}
      className={cn("relative isolate overflow-clip", className)}
      contentClassName={cn("relative isolate", contentClassName)}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 desktop:opacity-50"
      >
        <ProcessGlow className="top-1/4 left-0 -translate-1/2 scale-55 opacity-30 tablet:scale-50 desktop:top-[290px] desktop:scale-75 desktop:opacity-100" />
        <ProcessGlow className="top-3/4 right-0 hidden translate-x-1/2 -translate-y-1/2 scale-35 tablet:scale-50 desktop:top-[682px] desktop:block desktop:scale-75" />
      </div>
      <ProcessRing steps={steps} />
    </Section>
  );
}
