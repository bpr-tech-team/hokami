import type { ReactNode } from "react";
import { PageMain } from "@/components/layout/page-main";
import { Heading } from "@/components/typography/heading";
import { RichText } from "@/components/typography/rich-text";

export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <PageMain variant="contained" spacing="medium">
      <article lang="cs" className="mx-auto max-w-copy">
        <Heading as="h1" variant="legal" className="mb-12">
          {title}
        </Heading>
        <RichText className="[&_table]:table-fixed">{children}</RichText>
      </article>
    </PageMain>
  );
}
