"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "cn";

type HeroMotionProps = {
  animated: boolean;
  className?: string;
  children: ReactNode;
};

/** CSS owns the timeline; browser events only change its play state. */
export function HeroMotion({ animated, className, children }: HeroMotionProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;

    if (
      !root ||
      !animated ||
      typeof IntersectionObserver !== "function" ||
      typeof window.matchMedia !== "function" ||
      typeof document.hidden !== "boolean"
    ) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (typeof reducedMotion.addEventListener !== "function") return;

    let inViewport = false;

    const update = () => {
      root.dataset.motion =
        inViewport && !document.hidden && !reducedMotion.matches
          ? "running"
          : "paused";
    };

    const observer = new IntersectionObserver(([entry]) => {
      inViewport = entry.isIntersecting;
      update();
    });

    observer.observe(root);
    document.addEventListener("visibilitychange", update);
    reducedMotion.addEventListener("change", update);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
      reducedMotion.removeEventListener("change", update);
      root.dataset.motion = "paused";
    };
  }, [animated]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      data-slot="hero-background"
      data-motion="paused"
      data-animated={animated}
      className={cn(
        "group/hero-background pointer-events-none absolute inset-0 overflow-clip select-none",
        className,
      )}
    >
      {children}
    </div>
  );
}
