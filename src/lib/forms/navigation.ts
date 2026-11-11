import type { Locale } from "next-intl";
import { getPathname } from "@/i18n/navigation";
import { publicFormsEnabled } from "./availability";

/** Keep native fragments on the current page so its query string survives. */
export function getPublicFormHref(
  locale: Locale,
  formHref: string,
  pathname?: string,
) {
  const href = publicFormsEnabled ? formHref : "/contact#locations";
  const [targetPath, fragment] = href.split("#");
  if (pathname === targetPath) return `#${fragment}`;
  return getPathname({
    locale,
    href: publicFormsEnabled ? formHref : "/contact",
  });
}

/** Only mounted on an existing page; unavailable vacancies keep their 404. */
export function getLegacyFormRedirect(
  location: Pick<URL, "pathname" | "search" | "hash">,
  locale: Locale,
  formHref: string,
) {
  if (publicFormsEnabled) return null;
  const [pathname, fragment] = formHref.split("#");
  const expectedPath = getPathname({ locale, href: pathname });
  if (
    location.pathname.replace(/\/$/, "") !== expectedPath.replace(/\/$/, "") ||
    location.hash !== `#${fragment}`
  )
    return null;

  const contactPath = getPathname({ locale, href: "/contact" });
  return `${contactPath}${location.search}${pathname === "/contact" ? "#locations" : ""}`;
}
