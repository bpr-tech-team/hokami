import { Heading } from "@/components/typography/heading";
import { MonoText } from "@/components/typography/mono-text";
import { Text } from "@/components/typography/text";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { IndustryChevron } from "./industry-chevron";
import { IndustryImage } from "./industry-image";
import type { Industry } from "./types";

export function IndustryItem({ industry }: { industry: Industry }) {
  return (
    <AccordionItem value={industry.id} variant="industry">
      <AccordionTrigger variant="industry" icon={<IndustryChevron />}>
        <span className="flex min-w-0 flex-1 flex-col gap-1 desktop:flex-row desktop:items-center desktop:gap-4">
          <MonoText
            as="span"
            tone="tertiary"
            className="shrink-0 group-aria-expanded/accordion-trigger:text-text-accent desktop:w-24"
          >
            {industry.code}
          </MonoText>
          <Heading
            as="span"
            variant="item"
            className="min-w-0 flex-1 text-text-primary"
          >
            {industry.name}
          </Heading>
        </span>
      </AccordionTrigger>
      <AccordionContent variant="industry">
        <IndustryImage industry={industry} />
        <Text variant="small" tone="secondary">
          {industry.description}
        </Text>
        <MonoText variant="meta">{industry.certification}</MonoText>
      </AccordionContent>
    </AccordionItem>
  );
}
