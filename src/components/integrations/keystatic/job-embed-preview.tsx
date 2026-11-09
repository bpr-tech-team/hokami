import { keystaticUiText } from "@/i18n/keystatic-ui";
import { Text } from "@/components/typography/text";

export function JobEmbedPreview({
  value,
}: {
  value: { readonly src: string; readonly title: string };
}) {
  return (
    <div className="space-y-2 border border-solid border-border-subtle bg-surface-subtle p-4">
      <Text variant="small" className="m-0 font-semibold">
        {value.title || keystaticUiText("Embedded content")}
      </Text>
      <Text variant="small" tone="secondary" className="m-0 break-all">
        {value.src ||
          keystaticUiText(
            "Use Edit to insert an HTTPS address or iframe code and name the content.",
          )}
      </Text>
    </div>
  );
}
