"use client";

import "./globals.css";
import { useParams } from "next/navigation";
import { ErrorDocument } from "@/components/pages/errors/error-document";
import { resolveErrorLocale } from "@/i18n/error-messages";

export default function GlobalErrorPage() {
  const params = useParams();
  return (
    <ErrorDocument locale={resolveErrorLocale(params?.locale)} status={500} />
  );
}
