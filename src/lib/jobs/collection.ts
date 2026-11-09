import { keystaticUiText } from "@/i18n/keystatic-ui";
import { createElement } from "react";
import {
  collection,
  config,
  fields,
  type ComponentSchema,
} from "@keystatic/core";
import { languages } from "@/i18n/languages";
import { jobContentField } from "./content-field";
import { jobTextField, jobIntegerField, jobSelectField } from "./editor-fields";
import { withJobFieldLayout } from "@/components/integrations/keystatic/job-admin-field";
import { JobLanguagesInput } from "@/components/integrations/keystatic/job-languages-input";
import {
  JobTranslationsInput,
  type JobTranslationsInputProps,
} from "@/components/integrations/keystatic/job-translations-input";

const requiredText = {
  isRequired: true,
  pattern: {
    regex: /\S/,
    message: keystaticUiText("Please enter text, not just spaces."),
  },
};

function translationFields(label: string) {
  return fields.object(
    {
      title: jobTextField({
        label: keystaticUiText("Job title"),
        validation: { length: { max: 200 } },
      }),
      department: jobTextField({
        label: keystaticUiText("Department"),
        validation: { length: { max: 120 } },
      }),
      description: jobTextField({
        label: keystaticUiText("Short description"),
        multiline: true,
        validation: { length: { max: 2000 } },
      }),
      content: jobContentField(),
    },
    {
      label,
      description: keystaticUiText(
        "The card uses the translation once the title, department and short description are complete. Otherwise, the whole card uses English. Completing a translation does not change the published languages. An empty main description falls back to English, independently of the introduction.",
      ),
    },
  );
}

export type JobTranslationField = ReturnType<typeof translationFields>;

export const jobTranslationsField = fields.object(
  {
    cs: translationFields("Čeština"),
    de: translationFields("Deutsch"),
    fi: translationFields("Suomi"),
    pl: translationFields("Polski"),
  },
  { label: keystaticUiText("Translations") },
);

const visibleLocalesField = fields.multiselect({
  label: keystaticUiText("Show in language versions"),
  description: keystaticUiText(
    "Choose where the published job is shown. Disabled translations stay saved. The English original is always required.",
  ),
  options: languages.map(({ locale, name }) => ({
    label: name,
    value: locale,
  })),
  defaultValue: languages.map(({ locale }) => locale),
});

const jobSchema = {
  status: withJobFieldLayout(
    jobSelectField({
      label: keystaticUiText("Status"),
      options: [
        { label: keystaticUiText("Hidden"), value: "draft" },
        { label: keystaticUiText("Published"), value: "published" },
      ],
      defaultValue: "draft",
    }),
    "status",
  ),
  order: withJobFieldLayout(
    jobIntegerField({
      label: keystaticUiText("Order"),
      description: keystaticUiText("Lower numbers are displayed first."),
      defaultValue: 100,
      validation: { isRequired: true, min: 0 },
    }),
    "order",
  ),
  visibleLocales: {
    ...visibleLocalesField,
    Input(props: Parameters<typeof visibleLocalesField.Input>[0]) {
      return createElement(JobLanguagesInput, {
        ...props,
        field: visibleLocalesField,
      });
    },
  },
  title: withJobFieldLayout(
    fields.slug({
      name: {
        label: keystaticUiText("Job title (English)"),
        validation: { ...requiredText, length: { max: 200 } },
      },
      slug: {
        label: keystaticUiText("Identifier"),
        validation: {
          pattern: {
            regex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            message: keystaticUiText(
              "Use lowercase letters without accents, numbers and hyphens.",
            ),
          },
        },
      },
    }),
    "title",
  ),
  department: withJobFieldLayout(
    jobTextField({
      label: keystaticUiText("Department (English)"),
      validation: { ...requiredText, length: { max: 120 } },
    }),
    "department",
  ),
  description: withJobFieldLayout(
    jobTextField({
      label: keystaticUiText("Short description (English)"),
      multiline: true,
      validation: { ...requiredText, length: { max: 2000 } },
    }),
    "description",
  ),
  content: withJobFieldLayout(jobContentField({ required: true }), "content"),
  translations: {
    ...jobTranslationsField,
    Input(props: unknown) {
      return createElement(
        JobTranslationsInput,
        props as JobTranslationsInputProps,
      );
    },
  },
} satisfies Record<string, ComponentSchema>;

export const jobsCollection = collection({
  label: keystaticUiText("Job vacancies"),
  path: "src/content/jobs/*/",
  slugField: "title",
  format: { data: "json" },
  columns: ["title", "status", "order"],
  schema: jobSchema,
});

// Reading the checkout never needs Cloud credentials or write access.
export const jobsReaderConfig = config({
  storage: { kind: "local" },
  collections: { jobs: jobsCollection },
});
