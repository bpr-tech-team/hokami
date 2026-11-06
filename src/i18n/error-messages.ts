import { hasLocale, type Locale } from "next-intl";
import cs from "../../messages/errors/cs.json";
import en from "../../messages/errors/en.json";
import de from "../../messages/errors/de.json";
import fi from "../../messages/errors/fi.json";
import pl from "../../messages/errors/pl.json";
import { routing } from "./routing";

// Keep the fallback independent of the request config and provider it may replace.
export const errorMessages = { cs, en, de, fi, pl } satisfies Record<
  Locale,
  typeof cs
>;

export function resolveErrorLocale(value: unknown): Locale {
  return hasLocale(routing.locales, value) ? value : routing.defaultLocale;
}
