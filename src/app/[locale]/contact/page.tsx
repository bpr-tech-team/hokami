import { PageMain } from "@/components/layout/page-main";
import { ContactHero } from "@/components/sections/contact/hero/contact-hero";
import { ContactDirections } from "@/components/sections/contact/directions/contact-directions";
import { ContactFormSection } from "@/components/sections/contact/form/contact-form-section";
import { CompanyDetails } from "@/components/sections/contact/company-details/company-details";
import { Locations } from "@/components/sections/locations/locations";
import { getPageMetadata } from "@/lib/seo";

export function generateMetadata() {
  return getPageMetadata("contact");
}

export default function ContactPage() {
  return (
    <PageMain>
      <ContactHero />
      <ContactDirections />
      <ContactFormSection />
      <Locations tone="default" />
      <CompanyDetails />
    </PageMain>
  );
}
