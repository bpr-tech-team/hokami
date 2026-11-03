import { getTranslations } from "next-intl/server";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/typography/heading";
import { documentGroups } from "./data";
import { DocumentLink } from "./document-link";

export async function AboutDocuments() {
  const t = await getTranslations("AboutDocuments");

  return (
    <Section
      id="documents"
      eyebrow={t("eyebrow")}
      title={t("title")}
      contentClassName="gap-8 desktop:gap-16"
    >
      <div className="grid min-w-0 grid-cols-1 gap-8 desktop:grid-cols-2">
        {documentGroups.map(({ id, items }) => (
          <div key={id} className="flex min-w-0 flex-col gap-4">
            <Heading
              as="h3"
              variant="article"
              className="text-[28px] leading-[34px] tracking-[0.01em] uppercase"
            >
              {t(`groups.${id}`)}
            </Heading>
            <ul className="desktop:grid desktop:flex-1 desktop:auto-rows-fr">
              {items.map(({ id: documentId, href }) => {
                const label = t(`items.${documentId}`);

                return (
                  <li key={documentId} className="desktop:flex">
                    <DocumentLink
                      href={href}
                      label={label}
                      downloadLabel={t("download", { document: label })}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
