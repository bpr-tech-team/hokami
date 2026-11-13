import { getTranslations } from "next-intl/server";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/typography/heading";
import { documentGroups } from "./data";
import { DocumentLink } from "./document-link";
import { FactListGrid } from "@/components/sections/fact-list/fact-list-grid";

export async function AboutDocuments() {
  const t = await getTranslations("AboutDocuments");

  return (
    <Section
      id="documents"
      eyebrow={t("eyebrow")}
      title={t("title")}
      contentClassName="gap-8 desktop:gap-16"
    >
      <FactListGrid
        columns={2}
        decoration="none"
        groups={documentGroups.map(({ id, items }) => ({
          id,
          header: [
            <Heading key="title" as="h3" variant="subsection">
              {t(`groups.${id}`)}
            </Heading>,
          ],
          items: items.map(({ id: documentId, href }) => {
            const label = t(`items.${documentId}`);
            return {
              id: documentId,
              content: (
                <DocumentLink
                  href={href}
                  label={label}
                  openLabel={t("open", { document: label })}
                />
              ),
            };
          }),
        }))}
      />
    </Section>
  );
}
