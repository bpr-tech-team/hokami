"use client";

import { createContext, useContext } from "react";
import type { JobEditorState } from "@/lib/jobs/editor-layout";

export const JobEditorContext = createContext<{
  state: JobEditorState;
  onChange(state: JobEditorState): void;
} | null>(null);

export function useJobEditor() {
  const editor = useContext(JobEditorContext);
  if (!editor) throw new Error("Job controls require JobEditorContext.");
  return editor;
}
