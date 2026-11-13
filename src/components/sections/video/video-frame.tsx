import type { ReactNode } from "react";
import { TraceDot } from "@/components/ui/button/trace-dot";

export function VideoFrame({ children }: { children: ReactNode }) {
  return (
    <div
      data-video-decoration
      data-rich-text-island
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
        <TraceDot
          data-video-corner="top-left"
          className="top-0 left-0 -translate-x-1/2 -translate-y-1/2 text-current"
        />
        <TraceDot
          data-video-corner="bottom-right"
          className="right-0 bottom-0 translate-x-1/2 translate-y-1/2 text-current"
        />
      </div>
      {children}
    </div>
  );
}
