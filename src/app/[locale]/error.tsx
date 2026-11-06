"use client";

import { useLocale } from "next-intl";
import { ErrorPage } from "@/components/pages/errors/error-page";

export default function ServerErrorPage() {
  const locale = useLocale();
  return <ErrorPage locale={locale} status={500} />;
}
