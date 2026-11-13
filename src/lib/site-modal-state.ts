"use client";

type SiteModal = "consentModal" | "preferencesModal" | "navigation";

type SiteModalState = {
  open: ReadonlySet<SiteModal>;
  cookiesClosedAt: number | null;
};

let state: SiteModalState = { open: new Set(), cookiesClosedAt: null };
const listeners = new Set<() => void>();

export function getSiteModalState() {
  return state;
}

export function setSiteModalOpen(modal: SiteModal, open: boolean) {
  if (state.open.has(modal) === open) return;

  const next = new Set(state.open);
  if (open) next.add(modal);
  else next.delete(modal);

  const cookiesClosed =
    modal !== "navigation" &&
    !open &&
    !next.has("consentModal") &&
    !next.has("preferencesModal");

  state = {
    open: next,
    cookiesClosedAt: cookiesClosed ? Date.now() : state.cookiesClosedAt,
  };
  for (const listener of listeners) listener();
}

export function subscribeSiteModals(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
