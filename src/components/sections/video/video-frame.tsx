import Image from "next/image";
import type { ReactNode } from "react";

export function VideoFrame({ children }: { children: ReactNode }) {
  return (
    <div
      data-video-decoration
      className="pointer-events-none absolute top-0 left-0 size-full"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,10,0.35)_0%,rgba(8,8,10,0)_35%,rgba(8,8,10,0)_60%,rgba(8,8,10,0.7)_100%)] group-data-active/video:hidden"
      />
      <div aria-hidden="true" className="absolute inset-0 text-action-primary">
        <span
          data-video-trace="horizontal"
          className="absolute -top-px left-0 h-0.5 w-full origin-left bg-current"
        />
        <span
          data-video-trace="vertical"
          className="absolute top-0 -left-px h-full w-0.5 origin-top bg-current"
        />
        <span
          data-video-trace="horizontal"
          className="absolute right-0 -bottom-px h-0.5 w-full origin-right bg-current"
        />
        <span
          data-video-trace="vertical"
          className="absolute -right-px bottom-0 h-full w-0.5 origin-bottom bg-current"
        />
        <Image
          src="/images/video/dot-top-left.svg"
          width={9}
          height={9}
          alt=""
          className="absolute -top-[4.5px] -left-[4.5px]"
        />
        <Image
          src="/images/video/dot-bottom-right.svg"
          width={9}
          height={9}
          alt=""
          className="absolute -right-[4.5px] -bottom-[4.5px]"
        />
      </div>
      {children}
    </div>
  );
}
