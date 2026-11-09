"use client";

import type { PreviewProps } from "@keystatic/core";
import type {
  JobTranslationField,
  jobTranslationsField,
} from "@/lib/jobs/collection";
import { languages } from "@/i18n/languages";
import type { JobTranslationLocale } from "@/lib/jobs/resolve-job";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { JobAdminField } from "./job-admin-field";
import { useJobLocales } from "./job-locale-provider";

type InputFlags = { autoFocus: boolean; forceValidation: boolean };
export type JobTranslationsInputProps = PreviewProps<
  typeof jobTranslationsField
> &
  InputFlags;

function TranslationInput({
  locale,
  fields,
  schema,
  forceValidation,
  autoFocus,
}: PreviewProps<JobTranslationField> &
  InputFlags & { locale: JobTranslationLocale }) {
  const selected = useJobLocales();
  const Title = fields.title.schema.Input;
  const Department = fields.department.schema.Input;
  const Description = fields.description.schema.Input;
  const Content = fields.content.schema.Input;
  return (
    <section
      id={`job-language-${locale}`}
      tabIndex={-1}
      hidden={!selected.includes(locale)}
      className="min-w-0 scroll-mt-24 space-y-6"
    >
      <div className="space-y-3">
        <Heading as="h2" variant="item">
          {schema.label}
        </Heading>
        <Text variant="small" tone="secondary">
          {schema.description}
        </Text>
      </div>
      <Title
        {...fields.title}
        autoFocus={autoFocus}
        forceValidation={forceValidation}
      />
      <Department
        {...fields.department}
        autoFocus={false}
        forceValidation={forceValidation}
      />
      <Description
        {...fields.description}
        autoFocus={false}
        forceValidation={forceValidation}
      />
      <Content
        {...fields.content}
        autoFocus={false}
        forceValidation={forceValidation}
      />
    </section>
  );
}

export function JobTranslationsInput({
  fields,
  autoFocus,
  forceValidation,
}: JobTranslationsInputProps) {
  return (
    <JobAdminField area="translations">
      <div className="flex flex-col gap-10">
        {languages
          .filter(({ locale }) => locale !== "en")
          .map(({ locale }) => {
            const translation = locale as JobTranslationLocale;
            return (
              <TranslationInput
                key={locale}
                {...fields[translation]}
                locale={translation}
                autoFocus={autoFocus}
                forceValidation={forceValidation}
              />
            );
          })}
      </div>
    </JobAdminField>
  );
}
