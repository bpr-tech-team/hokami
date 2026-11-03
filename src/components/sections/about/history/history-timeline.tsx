"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useMotionVisibility } from "@/hooks/use-motion-visibility";
import { getHistoryTrace } from "./history-trace";
import "@/components/ui/trace-pulse.css";

export function HistoryTimeline({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const traceRef = useRef<SVGSVGElement>(null);
  const baseRef = useRef<SVGPathElement>(null);
  const pulseRef = useRef<SVGPathElement>(null);

  useMotionVisibility(rootRef);

  useEffect(() => {
    const root = rootRef.current;
    const trace = traceRef.current;
    if (!root || !trace) return;

    let frame = 0;
    let disposed = false;
    const contacts = Array.from(
      root.querySelectorAll<HTMLElement>("[data-history-contact]"),
    );

    const measure = () => {
      frame = 0;
      const bounds = trace.getBoundingClientRect();
      if (bounds.height === 0) return;

      const points = contacts.map((contact) => {
        const rect = contact.getBoundingClientRect();
        return {
          x: Math.round((rect.left + rect.width / 2 - bounds.left) * 100) / 100,
          y: Math.round((rect.top + rect.height / 2 - bounds.top) * 100) / 100,
        };
      });
      const d = getHistoryTrace(points, bounds.height);

      trace.setAttribute("viewBox", `0 0 48 ${bounds.height}`);
      baseRef.current?.setAttribute("d", d);
      pulseRef.current?.setAttribute("d", d);
    };

    const schedule = () => {
      if (!disposed && frame === 0) frame = requestAnimationFrame(measure);
    };

    const observer =
      typeof ResizeObserver === "function"
        ? new ResizeObserver(schedule)
        : null;
    observer?.observe(root);
    root.querySelectorAll("li").forEach((item) => observer?.observe(item));
    window.addEventListener("resize", schedule);
    void document.fonts.ready.then(schedule);
    measure();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener("resize", schedule);
    };
  }, [children]);

  return (
    <div
      ref={rootRef}
      data-slot="history-timeline"
      data-motion="paused"
      className="group/history relative w-full"
    >
      <svg
        ref={traceRef}
        aria-hidden="true"
        focusable="false"
        width="48"
        height="1464"
        viewBox="0 0 48 1464"
        fill="none"
        className="pointer-events-none absolute top-0 left-[6px] h-full w-12 overflow-visible text-brand-identity desktop:left-[calc(50%-24px)]"
      >
        <path ref={baseRef} stroke="currentColor" strokeOpacity="0.5" />
        <path
          ref={pulseRef}
          pathLength="1"
          stroke="currentColor"
          strokeOpacity="0.5"
          strokeWidth="1.4"
          shapeRendering="crispEdges"
          className="animate-[hokami-trace-pulse_30s_linear_infinite] [animation-play-state:paused] [filter:drop-shadow(0_0_3px_rgb(254_71_4_/_0.9))] group-data-[motion=running]/history:[animation-play-state:running] motion-reduce:hidden"
        />
      </svg>
      {children}
    </div>
  );
}
