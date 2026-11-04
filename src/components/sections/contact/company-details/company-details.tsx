import { getTranslations } from "next-intl/server";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/typography/heading";
import { MonoText } from "@/components/typography/mono-text";
import { Text } from "@/components/typography/text";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { company } from "@/content/company";

export async function CompanyDetails() {
  const t = await getTranslations("CompanyDetails");
  const items = [
    {
      id: "operator",
      label: t("operator"),
      title: company.name,
      content: (
        <div className="flex flex-col gap-[9px] font-mono text-[13px] leading-body tracking-[0.04em] text-text-secondary">
          <p>{t("registrationId", { value: company.registrationId })}</p>
          <p>{t("vatId", { value: company.vatId })}</p>
        </div>
      ),
    },
    {
      id: "address",
      label: t("address"),
      title: company.address.street,
      content: (
        <Text tone="secondary">
          {company.address.district}, {company.address.postalCity},{" "}
          {t("country")}
        </Text>
      ),
    },
    {
      id: "register",
      label: t("register"),
      title: t("reference", { value: company.registerReference }),
      content: (
        <Text tone="secondary">
          {t("registration", { value: company.registerReference })}
        </Text>
      ),
    },
  ];

  return (
    <Section
      id="company-details"
      tone="subtle"
      eyebrow={t("eyebrow")}
      title={t("title")}
      contentClassName="gap-10 desktop:gap-16"
    >
      <div className="grid min-w-0 desktop:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id} variant="feature" className="min-w-0">
            <CardHeader className="flex flex-col gap-3.5 px-0">
              <MonoText tone="tertiary">{item.label}</MonoText>
              <CardTitle>
                <Heading
                  as="h3"
                  variant="item"
                  className="text-lg leading-[22px]"
                >
                  {item.title}
                </Heading>
              </CardTitle>
              {item.content}
            </CardHeader>
          </Card>
        ))}
      </div>
    </Section>
  );
}
