import { PageMain } from "@/components/layout/page-main";
import { getLocale } from "next-intl/server";
import { LegacyFormRedirect } from "@/components/navigation/legacy-form-redirect";
import { publicFormsEnabled } from "@/lib/forms/availability";
import { ContactHero } from "@/components/sections/contact/hero/contact-hero";
import { ContactDirections } from "@/components/sections/contact/directions/contact-directions";
import { ContactFormSection } from "@/components/sections/contact/form/contact-form-section";
import { CompanyDetails } from "@/components/sections/contact/company-details/company-details";
import { Locations } from "@/components/sections/locations/locations";
import { getPageMetadata } from "@/lib/seo";

export function generateMetadata() {
  return getPageMetadata("contact");
}

export default async function ContactPage() {
  const locale = await getLocale();
  return (
    <PageMain>
      <ContactHero />
      <ContactDirections />
      {publicFormsEnabled ? (
        <ContactFormSection />
      ) : (
        <LegacyFormRedirect locale={locale} formHref="/contact#contact-form" />
      )}
      <Locations tone="default" />
      <CompanyDetails />
    </PageMain>
  );
}
