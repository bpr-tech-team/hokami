import { getLocale } from "next-intl/server";
import { ErrorPage } from "@/components/pages/errors/error-page";

export default async function NotFoundPage() {
  return <ErrorPage locale={await getLocale()} status={404} />;
}
