import Image from "next/image";
import { PhotoTrace } from "@/components/ui/photo-trace";

export function JobPhoto({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative aspect-3/2">
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        className="m-0! object-cover"
      />
      <PhotoTrace />
    </div>
  );
}
