export const company = {
  name: "Hokami CZ s.r.o.",
  registrationId: "25024981",
  vatId: "CZ25024981",
  registerReference: "C12746",
  address: {
    street: "Ampérova 464",
    district: "Liberec XXIII – Doubí",
    postalCity: "463 12 Liberec",
  },
  maps: {
    href: "https://maps.app.goo.gl/GCELM2vzLB3ZVptAA",
    // Copied from Google Maps' Embed a map dialog for the verified HOKAMI place.
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d10099.83451351987!2d15.0278897!3d50.7392562!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4709366e9386ba67%3A0x76dfe1c443c8ae50!2sHokami%20CZ%2C%20S.r.o.!5e0!3m2!1scs!2scz!4v1793811390898!5m2!1scs!2scz",
  },
} as const;

export const companyContacts = [
  {
    label: "+420 482 425 984",
    href: "tel:+420482425984",
    icon: "/images/about/contact/phone.svg",
  },
  {
    label: "info@hokami.cz",
    href: "mailto:info@hokami.cz",
    icon: "/images/about/contact/mail.svg",
  },
] as const;

export function formatCompanyAddress(country: string) {
  return [...Object.values(company.address), country].join(", ");
}
