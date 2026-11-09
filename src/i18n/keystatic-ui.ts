import messages from "./keystatic-ui-messages.json";

export const keystaticUiLocales = {
  cs: "cs-CZ",
  en: "en-US",
  de: "de-DE",
  fi: "fi-FI",
  pl: "pl-PL",
} as const;

export type KeystaticUiLocale = keyof typeof keystaticUiLocales;
export type KeystaticUiMessage = keyof typeof messages.en;

// The administration language is independent of the document being edited.
export const keystaticUiLocale: KeystaticUiLocale = "cs";
export const KEYSTATIC_UI_LOCALE_KEY = "hokami:keystatic:ui-locale";
let browserPreference:
  { document: Document; locale: KeystaticUiLocale } | undefined;

export function isKeystaticUiLocale(
  value: string | null,
): value is KeystaticUiLocale {
  return value !== null && Object.hasOwn(keystaticUiLocales, value);
}

export function readKeystaticUiLocale(
  storage: Pick<Storage, "getItem">,
): KeystaticUiLocale {
  try {
    const value = storage.getItem(KEYSTATIC_UI_LOCALE_KEY);
    return isKeystaticUiLocale(value) ? value : keystaticUiLocale;
  } catch {
    return keystaticUiLocale;
  }
}

export function getKeystaticUiLocale(): KeystaticUiLocale {
  if (typeof document === "undefined") return keystaticUiLocale;
  if (browserPreference?.document === document) return browserPreference.locale;
  let locale = keystaticUiLocale;
  try {
    locale = readKeystaticUiLocale(window.localStorage);
  } catch {
    // Some browser privacy modes block storage access entirely.
  }
  browserPreference = { document, locale };
  return locale;
}

export function changeKeystaticUiLocale(
  locale: KeystaticUiLocale,
  page: Document,
  storage: Pick<Storage, "setItem">,
  reload: () => void,
): "unsaved" | "storage-error" | undefined {
  // Reloading also rebuilds Keystatic's schema labels in the selected language.
  // The marker is attached to its native dirty-state indicator by our loader.
  if (page.querySelector("[data-keystatic-unsaved]")) return "unsaved";
  try {
    storage.setItem(KEYSTATIC_UI_LOCALE_KEY, locale);
  } catch {
    return "storage-error";
  }
  reload();
}

export function keystaticUiText(
  message: KeystaticUiMessage,
  locale: KeystaticUiLocale = getKeystaticUiLocale(),
) {
  return messages[locale][message];
}

export function formatKeystaticUiText(
  message: KeystaticUiMessage,
  ...values: unknown[]
) {
  return keystaticUiText(message).replace(/\{(\d+)\}/g, (_, index: string) =>
    String(values[Number(index)]),
  );
}
