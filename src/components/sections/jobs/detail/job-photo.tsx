import { PhotoFrame } from "@/components/ui/photo-frame";

export function JobPhoto({ src, alt }: { src: string; alt: string }) {
  return <PhotoFrame src={src} alt={alt} unoptimized />;
}
