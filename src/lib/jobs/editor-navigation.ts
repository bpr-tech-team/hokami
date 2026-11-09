import type { Locale } from "next-intl";

export function scrollToJobDescription(locale: Locale, view: Window = window) {
  const target = view.document.getElementById(`job-language-${locale}`);
  if (!target || target.hidden) return false;
  const hash = `#${target.id}`;
  if (view.location.hash !== hash)
    view.history.pushState(view.history.state, "", hash);
  target.focus({ preventScroll: true });
  target.scrollIntoView({
    behavior: view.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "instant"
      : "smooth",
    block: "start",
  });
  return true;
}
