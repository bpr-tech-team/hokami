"use client";

import { makePage } from "@keystatic/next/ui/app";
import { useSyncExternalStore } from "react";
import config from "../../../keystatic.config";
import { JobLocaleProvider } from "@/components/integrations/keystatic/job-locale-provider";
import {
  AdminHeaderLanguagePicker,
  AdminLanguagePicker,
} from "@/components/integrations/keystatic/admin-language-picker";
import { keystaticUiText } from "@/i18n/keystatic-ui";

const KeystaticPage = config ? makePage(config) : null;
const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export default function KeystaticApp() {
  // The browser preference determines schema labels at module initialization.
  // Mount the editor after hydration so the server's default cannot conflict.
  const hydrated = useSyncExternalStore(
    subscribe,
    clientSnapshot,
    serverSnapshot,
  );
  if (!hydrated) return null;
  if (!KeystaticPage) {
    return (
      <main>
        <AdminLanguagePicker />
        <h1>HOKAMI — {keystaticUiText("Job administration")}</h1>
        <p>
          {keystaticUiText(
            "The administration is not connected yet. Please contact the website administrator.",
          )}
        </p>
      </main>
    );
  }

  return (
    <JobLocaleProvider>
      <KeystaticPage />
      <AdminHeaderLanguagePicker />
    </JobLocaleProvider>
  );
}
