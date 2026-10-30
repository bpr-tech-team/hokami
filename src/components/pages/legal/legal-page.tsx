import type { ReactNode } from "react";
import { PageMain } from "@/components/layout/page-main";
import { Heading } from "@/components/typography/heading";

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
        <div className="text-base leading-relaxed wrap-anywhere [&_a]:text-text-accent [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-text-accent-hover [&_figure]:my-8 [&_li]:my-2 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_strong]:font-semibold [&_table]:w-full [&_table]:table-fixed [&_table]:border-collapse [&_table]:text-sm [&_td]:border [&_td]:border-border-subtle [&_td]:p-3 [&_td]:align-top [&_th]:border [&_th]:border-border-subtle [&_th]:p-3 [&_th]:text-left [&_th]:align-top [&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-6 tablet:[&_td]:p-4 tablet:[&_th]:p-4">
          {children}
        </div>
      </article>
    </PageMain>
  );
}
