import type { Locale } from "next-intl";
import { languages } from "@/i18n/languages";

export function createJobLocaleStore(
  initial: readonly Locale[] = languages.map(({ locale }) => locale),
) {
  let selected: readonly Locale[] = [...initial];
  const listeners = new Set<() => void>();
  return {
    getSnapshot: () => selected,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    set(value: readonly Locale[]) {
      if (
        selected.length === value.length &&
        selected.every((locale, index) => locale === value[index])
      )
        return;
      selected = [...value];
      for (const listener of listeners) listener();
    },
  };
}
