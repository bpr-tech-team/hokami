import { Text } from "@/components/typography/text";

export function SustainabilityCopy({
  paragraphs,
}: {
  paragraphs: readonly string[];
}) {
  return (
    <div className="flex min-w-0 flex-col gap-6 desktop:gap-8">
      {paragraphs.map((paragraph) => (
        <Text key={paragraph} tone="secondary" className="max-w-copy">
          {paragraph}
        </Text>
      ))}
    </div>
  );
}
