"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useMotionVisibility } from "@/hooks/use-motion-visibility";

type HeroMotionProps = {
  animated: boolean;
  className?: string;
  children: ReactNode;
};

/** CSS owns the timeline; browser events only change its play state. */
export function HeroMotion({ animated, className, children }: HeroMotionProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useMotionVisibility(rootRef, animated);

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
