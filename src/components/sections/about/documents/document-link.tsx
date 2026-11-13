import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { MonoText } from "@/components/typography/mono-text";
import { Text } from "@/components/typography/text";

function DocumentIcon({ name }: { name: "file-text" }) {
  return (
    <span aria-hidden="true" className="relative size-5 shrink-0">
      <Image
        src={`/images/about/documents/${name}.svg`}
        alt=""
        width={20}
        height={20}
        className="transition-opacity group-hover/document:opacity-0"
        unoptimized
      />
      <Image
        src={`/images/about/documents/${name}-hover.svg`}
        alt=""
        width={20}
        height={20}
        className="absolute inset-0 opacity-0 transition-opacity group-hover/document:opacity-100"
        unoptimized
      />
    </span>
  );
}

type DocumentLinkProps = {
  href: string;
  label: string;
  openLabel: string;
};

export function DocumentLink({ href, label, openLabel }: DocumentLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={openLabel}
      className="group/document flex h-full min-h-14 w-full min-w-0 items-center gap-3 border-b border-border-subtle px-2 py-4 transition-colors hover:border-brand-identity hover:bg-surface-raised focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-focus-ring"
    >
      <DocumentIcon name="file-text" />
      <Text as="span" className="min-w-0 flex-1 wrap-anywhere">
        {label}
      </Text>
      <MonoText as="span" variant="meta" tone="tertiary" className="shrink-0">
        PDF
      </MonoText>
      <ArrowUpRight aria-hidden="true" className="size-5 shrink-0" />
    </a>
  );
}
