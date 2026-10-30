"use client";

import { useSearchParams } from "next/navigation";
import { useSyncExternalStore } from "react";
import { usePathname } from "@/i18n/navigation";

export type SiteLocation = {
  pathname: string;
  search: string;
  hash: string;
};

function subscribeHash(notify: () => void) {
  window.addEventListener("hashchange", notify);
  window.addEventListener("popstate", notify);
  return () => {
    window.removeEventListener("hashchange", notify);
    window.removeEventListener("popstate", notify);
  };
}

function serverHash() {
  // URL fragments are never sent to the server.
  return "";
}

export function useSiteLocation(): SiteLocation {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // A fresh reader also rechecks after App Router commits its URL. Router
  // pushState calls can change the fragment without firing hashchange.
  const hash = useSyncExternalStore(
    subscribeHash,
    () => window.location.hash,
    serverHash,
  );
  // Preserve duplicate query keys and safely encode their values.
  const query = searchParams.toString();

  return { pathname, search: query ? `?${query}` : "", hash };
}
