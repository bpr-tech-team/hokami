import Image from "next/image";

export function PhotoTrace() {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0">
      <span className="absolute -top-px right-0 h-0.5 w-1/4 bg-brand-identity" />
      <span className="absolute bottom-0 -left-px h-1/2 w-0.5 bg-brand-identity" />
      <span className="absolute -bottom-px left-0 h-0.5 w-1/4 bg-brand-identity" />
      <span className="absolute top-0 -right-px h-1/2 w-0.5 bg-brand-identity" />
      <Image
        src="/images/sustainability/photo-dot.svg"
        alt=""
        width={9}
        height={9}
        unoptimized
        className="absolute -bottom-[4.5px] -left-[4.5px]"
      />
      <Image
        src="/images/sustainability/photo-dot.svg"
        alt=""
        width={9}
        height={9}
        unoptimized
        className="absolute -top-[4.5px] -right-[4.5px]"
      />
    </span>
  );
}
