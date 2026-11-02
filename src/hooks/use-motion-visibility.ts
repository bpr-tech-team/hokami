"use client";

import { useEffect, type RefObject } from "react";

/** Ambient timelines only run while visible and motion is permitted. */
export function useMotionVisibility(
  rootRef: RefObject<HTMLElement | null>,
  enabled = true,
) {
  useEffect(() => {
    const root = rootRef.current;
    if (
      !root ||
      !enabled ||
      typeof IntersectionObserver !== "function" ||
      typeof window.matchMedia !== "function" ||
      typeof document.hidden !== "boolean"
    )
      return;

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

    root.dataset.motionReady = "true";
    observer.observe(root);
    document.addEventListener("visibilitychange", update);
    reducedMotion.addEventListener("change", update);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
      reducedMotion.removeEventListener("change", update);
      root.dataset.motion = "paused";
      delete root.dataset.motionReady;
    };
  }, [enabled, rootRef]);
}
