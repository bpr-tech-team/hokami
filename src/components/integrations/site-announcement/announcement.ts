"use client";

import { getSiteModalState, subscribeSiteModals } from "@/lib/site-modal-state";

export const ANNOUNCEMENT_STORAGE_KEY =
  "hokami:announcement:electronica-2026:v1";
export const ANNOUNCEMENT_DELAY = 3000;

// Also covers disabled storage and locale layout remounts in this document.
const shownDocuments = new WeakSet<Document>();

function wasShown() {
  if (shownDocuments.has(document)) return true;
  try {
    return window.localStorage.getItem(ANNOUNCEMENT_STORAGE_KEY) === "shown";
  } catch {
    return false;
  }
}

function rememberShow() {
  shownDocuments.add(document);
  try {
    window.localStorage.setItem(ANNOUNCEMENT_STORAGE_KEY, "shown");
  } catch {
    // The in-memory flag still prevents repeats during client navigation.
  }
}

export function watchAnnouncement(show: () => void) {
  let timer: ReturnType<typeof setTimeout> | undefined;

  function cancelTimer() {
    clearTimeout(timer);
    timer = undefined;
  }

  function schedule() {
    cancelTimer();
    const { open, cookiesClosedAt } = getSiteModalState();
    if (
      wasShown() ||
      open.size > 0 ||
      cookiesClosedAt === null ||
      document.hidden
    )
      return;

    timer = setTimeout(
      () => {
        timer = undefined;
        if (wasShown() || getSiteModalState().open.size > 0 || document.hidden)
          return;
        rememberShow();
        show();
      },
      Math.max(0, cookiesClosedAt + ANNOUNCEMENT_DELAY - Date.now()),
    );
  }

  const unsubscribe = subscribeSiteModals(schedule);
  window.addEventListener("storage", schedule);
  document.addEventListener("visibilitychange", schedule);
  schedule();

  return () => {
    cancelTimer();
    unsubscribe();
    window.removeEventListener("storage", schedule);
    document.removeEventListener("visibilitychange", schedule);
  };
}
