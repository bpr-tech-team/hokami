// Keystatic has no header slot. Use its semantic page header rather than its
// generated styles, and reattach when client-side navigation replaces it.
export function observeKeystaticHeader(
  page: Document,
  onAttach: (host: HTMLElement) => void,
) {
  const host = page.createElement("div");
  host.dataset.keystaticLanguagePicker = "";
  host.className = "ml-auto flex shrink-0 items-center";
  const compactNavigation = "max-sm:[&>nav]:min-w-0!";
  let previousRow: Element | null = null;
  function attach() {
    const row = page.querySelector("#keystatic-main-panel header > div");
    if (row && host.parentElement !== row) {
      previousRow?.classList.remove(compactNavigation);
      // Let breadcrumbs shrink to leave the save and language controls visible
      // on narrow screens. Keystatic otherwise reserves 192px for navigation.
      row.classList.add(compactNavigation);
      previousRow = row;
      row.append(host);
      onAttach(host);
    }
  }
  const observer = new page.defaultView!.MutationObserver(attach);
  observer.observe(page.body, { childList: true, subtree: true });
  attach();
  return () => {
    observer.disconnect();
    previousRow?.classList.remove(compactNavigation);
    host.remove();
  };
}
