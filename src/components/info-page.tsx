import { getTranslations } from "next-intl/server";

export async function InfoPage({
  page,
}: {
  page: "quality" | "about" | "careers";
}) {
  const t = await getTranslations("Header.items");

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto min-h-[calc(100dvh-72px)] max-w-content px-5 py-18 tablet:px-10 desktop:py-32"
    >
      <h1 className="font-display text-4xl font-semibold uppercase">
        {t(page)}
      </h1>
    </main>
  );
}
