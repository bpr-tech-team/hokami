import type { ReactNode } from "react";

export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto max-w-content px-5 py-18 tablet:px-10 desktop:py-24"
    >
      <article lang="cs" className="mx-auto max-w-copy">
        <h1 className="mb-12 font-display text-4xl leading-tight font-semibold wrap-anywhere uppercase tablet:text-5xl">
          {title}
        </h1>
        <div className="text-base leading-relaxed wrap-anywhere [&_a]:text-text-accent [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-text-accent-hover [&_figure]:my-8 [&_h2]:mt-12 [&_h2]:mb-5 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:leading-snug [&_h2]:font-semibold [&_h2:first-child]:mt-0 [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-semibold [&_li]:my-2 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-5 [&_strong]:font-semibold [&_table]:w-full [&_table]:table-fixed [&_table]:border-collapse [&_table]:text-sm [&_td]:border [&_td]:border-border-subtle [&_td]:p-3 [&_td]:align-top [&_th]:border [&_th]:border-border-subtle [&_th]:p-3 [&_th]:text-left [&_th]:align-top [&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-6 tablet:[&_td]:p-4 tablet:[&_th]:p-4">
          {children}
        </div>
      </article>
    </main>
  );
}
