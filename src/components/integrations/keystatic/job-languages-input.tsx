"use client";

import { useId, useLayoutEffect } from "react";
import type { BasicFormField, FormFieldInputProps } from "@keystatic/core";
import type { Locale } from "next-intl";
import { adminLanguages, languages } from "@/i18n/languages";
import { keystaticUiText } from "@/i18n/keystatic-ui";
import { JobAdminField } from "./job-admin-field";
import { useJobLocales, useJobLocaleStore } from "./job-locale-provider";
import { MonoText } from "@/components/typography/mono-text";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { scrollToJobDescription } from "@/lib/jobs/editor-navigation";
import { ArrowDownRight } from "lucide-react";

export function JobLanguagesInput({
  field,
  ...props
}: FormFieldInputProps<readonly Locale[]> & {
  field: BasicFormField<readonly Locale[]>;
}) {
  const store = useJobLocaleStore();
  const selected = useJobLocales();
  const id = useId();
  // Keep the sibling translation views synchronized on load, undo and entry changes.
  useLayoutEffect(() => store.set(props.value), [store, props.value]);
  return (
    <JobAdminField area="languages">
      <aside data-job-language-panel className="space-y-6 xl:sticky xl:top-6">
        <FieldSet
          aria-describedby={`${id}-help`}
          className="m-0 min-w-0 border-0 p-0"
        >
          <FieldLegend
            variant="label"
            className="font-mono text-xs leading-body tracking-label text-text-secondary uppercase"
          >
            {field.label}
          </FieldLegend>
          <div className="flex flex-col gap-1.5">
            {adminLanguages.map(({ locale, name }, index) => (
              <Field
                key={locale}
                orientation="horizontal"
                className="box-border items-center border border-solid border-border-subtle bg-surface-default px-3 py-2 transition-colors has-data-checked:border-action-primary has-data-checked:bg-surface-accent-subtle"
              >
                <Checkbox
                  id={`${id}-${locale}`}
                  checked={props.value.includes(locale)}
                  autoFocus={props.autoFocus && index === 0}
                  onCheckedChange={(checked) => {
                    const value = languages
                      .map(({ locale }) => locale)
                      .filter((item) =>
                        item === locale ? checked : props.value.includes(item),
                      );
                    store.set(value);
                    props.onChange(value);
                  }}
                />
                <FieldLabel
                  htmlFor={`${id}-${locale}`}
                  className="cursor-pointer font-sans text-sm leading-body tracking-normal text-text-primary normal-case"
                >
                  {name}
                </FieldLabel>
              </Field>
            ))}
          </div>
          <FieldDescription
            id={`${id}-help`}
            className="m-0 text-xs leading-small"
          >
            {keystaticUiText(
              "Choose where the job is shown. Disabled translations stay saved. The English original is always required.",
            )}
          </FieldDescription>
        </FieldSet>
        <nav
          aria-label={keystaticUiText("Go to language version")}
          className="border-t border-border-subtle pt-4"
        >
          <MonoText variant="label" className="mt-0 mb-2">
            {keystaticUiText("Go to description")}
          </MonoText>
          <ul className="m-0 flex list-none flex-col p-0">
            {adminLanguages.map(({ locale, name }) => (
              <li key={locale}>
                {locale === "en" || selected.includes(locale) ? (
                  <a
                    href={`#job-language-${locale}`}
                    onClick={(event) => {
                      if (
                        event.button !== 0 ||
                        event.metaKey ||
                        event.ctrlKey ||
                        event.shiftKey ||
                        event.altKey
                      )
                        return;
                      if (scrollToJobDescription(locale))
                        event.preventDefault();
                    }}
                    className="-mx-2 flex items-center justify-between gap-2 px-2 py-1.5 font-sans text-sm leading-small text-text-secondary no-underline transition-colors hover:bg-surface-subtle hover:text-text-accent focus-visible:outline-2 focus-visible:outline-focus-ring"
                  >
                    <span>
                      {name}
                      {locale === "en" ? keystaticUiText(" · original") : ""}
                    </span>
                    <ArrowDownRight
                      aria-hidden="true"
                      className="size-3.5 shrink-0"
                    />
                  </a>
                ) : (
                  <span className="block py-1.5 font-sans text-sm leading-small text-text-disabled">
                    {name}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </JobAdminField>
  );
}
