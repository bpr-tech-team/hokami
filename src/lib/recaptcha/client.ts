"use client";

import { RECAPTCHA_ACTION } from "@/lib/reques-for-quote/validation";

type Recaptcha = {
  ready: (callback: () => void) => void;
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
};

declare global {
  interface Window {
    grecaptcha?: Recaptcha;
  }
}

let loading: Promise<Recaptcha> | undefined;

export function loadRecaptcha(siteKey: string): Promise<Recaptcha> {
  if (loading) return loading;
  loading = new Promise<Recaptcha>((resolve, reject) => {
    const script = document.createElement("script");
    const timeout = window.setTimeout(fail, 15000);

    function fail() {
      window.clearTimeout(timeout);
      script.remove();
      loading = undefined;
      reject(new Error("reCAPTCHA could not load"));
    }

    script.src = `https://www.recaptcha.net/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    script.async = true;
    script.onerror = fail;
    script.onload = () => {
      window.grecaptcha?.ready(() => {
        window.clearTimeout(timeout);
        resolve(window.grecaptcha!);
      });
    };
    document.head.appendChild(script);
  });
  return loading;
}

export async function getRecaptchaToken(siteKey: string) {
  const recaptcha = await loadRecaptcha(siteKey);
  return new Promise<string>((resolve, reject) => {
    const timeout = window.setTimeout(
      () => reject(new Error("reCAPTCHA timed out")),
      15000,
    );
    recaptcha
      .execute(siteKey, { action: RECAPTCHA_ACTION })
      .then(resolve, reject)
      .finally(() => window.clearTimeout(timeout));
  });
}
