import { cn } from "cn";
import { Heading } from "@/components/typography/heading";
import { MonoText } from "@/components/typography/mono-text";
import { Text } from "@/components/typography/text";
import type { ProcessStep as ProcessStepContent } from "./types";

export function ProcessStep({
  step,
  ring = false,
}: {
  step: ProcessStepContent;
  ring?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        ring && "items-center @max-[350px]/process:gap-2",
      )}
    >
      <MonoText variant="eyebrow">{step.label}</MonoText>
      <Heading
        as="h3"
        variant="page"
        className={
          ring
            ? "w-full text-[clamp(24px,9.15cqw,52px)] leading-[1.02] tracking-[-0.01em] @max-[350px]/process:hyphens-auto"
            : "text-2xl leading-tight"
        }
      >
        {step.title}
      </Heading>
      <Text
        tone="secondary"
        className={ring ? "w-full text-[clamp(13px,4.58cqw,16px)]" : undefined}
      >
        {step.description}
      </Text>
    </div>
  );
}
