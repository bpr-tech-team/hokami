import { cn } from "@/lib/utils";
import { Heading } from "@/components/typography/heading";
import { MonoText } from "@/components/typography/mono-text";
import { Text } from "@/components/typography/text";
import type { ProcessStep as ProcessStepContent } from "./types";

export function ProcessStep({
  step,
  ring = false,
  compact = false,
}: {
  step: ProcessStepContent;
  ring?: boolean;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        ring && "items-center",
        ring && !compact && "@max-[350px]/process:gap-2",
        compact && "gap-[clamp(4px,2cqw,12px)] @max-[280px]/process:gap-1",
      )}
    >
      <MonoText
        variant="eyebrow"
        className={
          compact
            ? "text-[clamp(10px,2cqw,12px)] leading-[1.3] tracking-label"
            : undefined
        }
      >
        {step.label}
      </MonoText>
      <Heading
        as="h3"
        variant="page"
        className={cn(
          ring
            ? "w-full text-[clamp(24px,9.15cqw,52px)] leading-[1.02] tracking-[-0.01em] @max-[350px]/process:hyphens-auto"
            : "text-2xl leading-tight",
          compact &&
            "text-[clamp(18px,8cqw,52px)] leading-[1.02] hyphens-auto @max-[280px]/process:text-[18px]",
        )}
      >
        {step.title}
      </Heading>
      <Text
        tone="secondary"
        className={cn(
          ring && "w-full text-[clamp(13px,4.58cqw,16px)]",
          compact &&
            "text-[clamp(12px,3.7cqw,16px)] leading-[1.4] hyphens-auto @max-[280px]/process:leading-[1.3]",
        )}
      >
        {step.description}
      </Text>
    </div>
  );
}
