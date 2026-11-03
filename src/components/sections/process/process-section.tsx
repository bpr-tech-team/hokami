import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { Section } from "@/components/layout/section";
import { ProcessBackground } from "./process-background";
import { ProcessRing } from "./process-ring";
import { ProcessScrollRing } from "./process-scroll-ring";
import type { ProcessStep } from "./types";

type ProcessSectionProps = Omit<ComponentProps<typeof Section>, "children"> & {
  steps: readonly ProcessStep[];
  motion?: "time" | "scroll";
};

export function ProcessSection({
  steps,
  motion = "time",
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
      {motion === "scroll" ? (
        <ProcessScrollRing
          steps={steps}
          labelledBy={`${props.id}-heading`}
          background={<ProcessBackground placement="scene" />}
        />
      ) : (
        <>
          <ProcessBackground />
          <ProcessRing steps={steps} />
        </>
      )}
    </Section>
  );
}
