export type ImageCrop = {
  frameWidth: number;
  frameHeight: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ImageAccordionEntry = {
  id: string;
  code: string;
  image: string;
  imageAlt: string;
  name: string;
  description: string;
  metadata?: string;
  action?: { href: string; label: string };
  imageCrop?: { desktop: ImageCrop; compact: ImageCrop };
};
