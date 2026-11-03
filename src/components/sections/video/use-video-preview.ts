"use client";

import { useEffect, type RefObject } from "react";

export function useVideoPreview(
  videoRef: RefObject<HTMLVideoElement | null>,
  src: string | undefined,
  enabled: boolean,
) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src || typeof IntersectionObserver !== "function") return;
    const desktop = window.matchMedia("(min-width: 47.5rem)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    let visible = false;
    let failed = false;
    let disposed = false;

    function update() {
      const permitted =
        desktop.matches && !reducedMotion.matches && !connection?.saveData;
      if (!permitted) {
        video!.pause();
        if (video!.hasAttribute("src")) {
          video!.removeAttribute("src");
          video!.load();
        }
        return;
      }
      if (!enabled || !visible || document.hidden || failed) {
        video!.pause();
        return;
      }
      if (!video!.hasAttribute("src")) video!.src = src!;
      video!.play().catch(() => {
        if (!disposed) failed = true;
      });
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(video);
    desktop.addEventListener("change", update);
    reducedMotion.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    update();

    return () => {
      disposed = true;
      observer.disconnect();
      desktop.removeEventListener("change", update);
      reducedMotion.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
      video.pause();
    };
  }, [enabled, src, videoRef]);
}
