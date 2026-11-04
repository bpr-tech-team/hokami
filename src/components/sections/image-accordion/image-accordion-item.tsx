import { Heading } from "@/components/typography/heading";
import { MonoText } from "@/components/typography/mono-text";
import { Text } from "@/components/typography/text";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ImageAccordionChevron } from "./image-accordion-chevron";
import { ImageAccordionImage } from "./image-accordion-image";
import type { ImageAccordionEntry } from "./types";

export function ImageAccordionItem({ item }: { item: ImageAccordionEntry }) {
  return (
    <AccordionItem
      value={item.id}
      variant="industry"
      data-image-accordion-item={item.id}
    >
      <AccordionTrigger variant="industry" icon={<ImageAccordionChevron />}>
        <span className="flex min-w-0 flex-1 flex-col gap-1 desktop:flex-row desktop:items-center desktop:gap-4">
          <MonoText
            as="span"
            tone="tertiary"
            className="shrink-0 group-aria-expanded/accordion-trigger:text-text-accent desktop:w-24"
          >
            {item.code}
          </MonoText>
          <Heading
            as="span"
            variant="item"
            className="min-w-0 flex-1 text-text-primary"
          >
            {item.name}
          </Heading>
        </span>
      </AccordionTrigger>
      <AccordionContent variant="industry">
        <ImageAccordionImage item={item} />
        <Text variant="small" tone="secondary">
          {item.description}
        </Text>
        {item.metadata && <MonoText variant="meta">{item.metadata}</MonoText>}
        {item.action && (
          <a
            href={item.action.href}
            className="relative inline-flex min-h-11 max-w-full items-center self-start py-3 text-text-accent transition-colors duration-250 after:absolute after:bottom-[6.5px] after:left-0 after:h-[1.5px] after:w-[5%] after:bg-current after:transition-[width] after:duration-250 hover:text-text-accent-hover hover:after:w-full focus-visible:text-text-accent-hover focus-visible:after:w-full"
          >
            <MonoText as="span" variant="meta" className="text-inherit">
              {item.action.label}
            </MonoText>
          </a>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
