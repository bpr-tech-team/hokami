import "./globals.css";
import { ErrorDocument } from "@/components/pages/errors/error-document";
import { routing } from "@/i18n/routing";

export default function NotFoundPage() {
  return <ErrorDocument locale={routing.defaultLocale} status={404} />;
}
