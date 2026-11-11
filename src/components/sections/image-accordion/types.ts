export type ImageAccordionEntry = {
  id: string;
  code: string;
  image: string;
  imageAlt: string;
  name: string;
  description: string;
  metadata?: string;
  action?: { href: string; label: string };
  imagePosition?: { desktop: string; compact: string };
  imageSizes?: { desktop: string; compact: string };
  imageQuality?: number;
};
