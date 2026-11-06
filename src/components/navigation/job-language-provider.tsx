"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { JobLanguages } from "@/lib/jobs/urls";

const JobLanguageContext = createContext<JobLanguages>({});

export function JobLanguageProvider({
  jobs,
  children,
}: {
  jobs: JobLanguages;
  children: ReactNode;
}) {
  return <JobLanguageContext value={jobs}>{children}</JobLanguageContext>;
}

export function useJobLanguages() {
  return useContext(JobLanguageContext);
}
