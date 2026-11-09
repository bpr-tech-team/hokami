"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/typography/text";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { adminLanguages } from "@/i18n/languages";
import {
  changeKeystaticUiLocale,
  getKeystaticUiLocale,
  isKeystaticUiLocale,
  keystaticUiText,
} from "@/i18n/keystatic-ui";
import { observeKeystaticHeader } from "@/lib/jobs/admin-header";

export function AdminLanguagePicker() {
  const locale = getKeystaticUiLocale();
  const [error, setError] = useState<"unsaved" | "storage-error">();
  const errorId = useId();
  const current = adminLanguages.find(
    (language) => language.locale === locale,
  )!;
  function select(value: unknown) {
    if (
      typeof value !== "string" ||
      !isKeystaticUiLocale(value) ||
      value === locale
    )
      return;
    try {
      setError(
        changeKeystaticUiLocale(value, document, window.localStorage, () =>
          window.location.reload(),
        ),
      );
    } catch {
      setError("storage-error");
    }
  }
  return (
    <DropdownMenu modal={false} onOpenChange={() => setError(undefined)}>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            showIcon={false}
            showTraceDots={false}
            className="gap-1.5 border-0"
            aria-label={keystaticUiText("Interface language")}
            title={keystaticUiText("Interface language")}
          />
        }
      >
        <Languages className="size-4" />
        <span className="hidden sm:inline">{current.name}</span>
        <span className="sm:hidden">{current.code}</span>
        <ChevronDown className="size-3" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-max min-w-44">
        <DropdownMenuRadioGroup
          value={locale}
          onValueChange={select}
          aria-label={keystaticUiText("Interface language")}
          aria-describedby={error ? errorId : undefined}
        >
          {adminLanguages.map((language) => (
            <DropdownMenuRadioItem
              key={language.locale}
              value={language.locale}
              label={language.name}
            >
              <span lang={language.locale}>{language.name}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        {error && (
          <Text
            variant="small"
            role="alert"
            id={errorId}
            className="m-0 max-w-64 border-t border-border-subtle p-2 text-feedback-error-text"
          >
            {keystaticUiText(
              error === "unsaved"
                ? "Save or discard your changes before changing the interface language."
                : "The language preference could not be saved. Allow this site to use browser storage.",
            )}
          </Text>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AdminHeaderLanguagePicker() {
  const [host, setHost] = useState<HTMLElement | null>(null);
  useEffect(() => {
    document.documentElement.lang = getKeystaticUiLocale();
    document.title = `HOKAMI — ${keystaticUiText("Job administration")}`;
    return observeKeystaticHeader(document, setHost);
  }, []);
  return host && createPortal(<AdminLanguagePicker />, host);
}
