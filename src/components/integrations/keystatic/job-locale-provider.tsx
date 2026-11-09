"use client";

import {
  createContext,
  useContext,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createJobLocaleStore } from "@/lib/jobs/editor-locales";
import type { Locale } from "next-intl";

const JobLocaleContext = createContext<ReturnType<
  typeof createJobLocaleStore
> | null>(null);

export function JobLocaleProvider({
  children,
  initialLocales,
}: {
  children: ReactNode;
  initialLocales?: readonly Locale[];
}) {
  const [store] = useState(() => createJobLocaleStore(initialLocales));
  return (
    <JobLocaleContext.Provider value={store}>
      {children}
    </JobLocaleContext.Provider>
  );
}

export function useJobLocaleStore() {
  const store = useContext(JobLocaleContext);
  if (!store) throw new Error("Job fields require JobLocaleProvider.");
  return store;
}

export function useJobLocales() {
  const store = useJobLocaleStore();
  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot,
  );
}
