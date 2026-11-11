import { getLocale, getTranslations } from "next-intl/server";
import { getPublicFormHref } from "@/lib/forms/navigation";
import { HeroSection } from "@/components/sections/hero/hero-section";
import { CompanyVideo } from "@/components/sections/video/company-video";

export async function HomeHero() {
  const [locale, t] = await Promise.all([getLocale(), getTranslations("Hero")]);

  return (
    <HeroSection
      id="hero"
      eyebrow={t("eyebrow")}
      title={t.rich("title", {
        accent: (chunks) => (
          <span className="text-brand-identity">{chunks}</span>
        ),
      })}
      description={t("description")}
      actions={[
        {
          label: t("contact"),
          href: getPublicFormHref(locale, "/#reques-for-quote", "/"),
        },
        { label: t("production"), href: "#industries" },
      ]}
      media={<CompanyVideo />}
    />
  );
}
