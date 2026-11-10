"use client";

import { useRef, useState } from "react";
import { loadRecaptcha } from "@/lib/recaptcha/client";
import { FormSubmitError, submitForm } from "@/lib/forms/submit";

type SubmissionInput = Omit<Parameters<typeof submitForm>[0], "siteKey">;
type SubmissionResult =
  { success: true } | { success: false; error: FormSubmitError };

export function useFormSubmission() {
  const busy = useRef(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<FormSubmitError>();
  const [success, setSuccess] = useState(false);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  function clearStatus() {
    setError(undefined);
    setSuccess(false);
  }

  function preload() {
    if (siteKey) void loadRecaptcha(siteKey).catch(() => {});
  }

  async function submit(
    input: SubmissionInput,
  ): Promise<SubmissionResult | undefined> {
    if (busy.current) return;
    clearStatus();
    if (!siteKey) {
      const error = new FormSubmitError("unavailable");
      setError(error);
      return { success: false, error };
    }
    busy.current = true;
    setSending(true);
    try {
      await submitForm({ ...input, siteKey });
      setSuccess(true);
      return { success: true };
    } catch (cause) {
      const error =
        cause instanceof FormSubmitError ? cause : new FormSubmitError("send");
      setError(error);
      return { success: false, error };
    } finally {
      busy.current = false;
      setSending(false);
    }
  }

  return { sending, error, success, clearStatus, preload, submit };
}
