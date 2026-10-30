import { getTranslations } from "next-intl/server";
import { PageMain } from "@/components/layout/page-main";
import { Heading } from "@/components/typography/heading";

export async function InfoPage({
  page,
}: {
  page: "quality" | "about" | "careers";
}) {
  const t = await getTranslations("Header.items");

  return (
    <PageMain variant="contained" spacing="large">
      <Heading as="h1" variant="page">
        {t(page)}
      </Heading>
    </PageMain>
  );
}
