"use client";

import { useLayoutEffect, useRef, type RefObject } from "react";
import {
  getVideoRevealGeometry,
  getVideoRevealProgress,
  hasVideoRevealLayoutChanged,
  type VideoRevealMeasurement,
} from "./video-reveal";

const duration = 1000;
const easing = "cubic-bezier(0.4, 0, 0.2, 1)";
const anchorLocks = new WeakMap<
  HTMLElement,
  { count: number; previous: string }
>();

// Several reused sections can share the scroller. Restore its original
// anchoring after every section has finished changing layout.
function suspendScrollAnchoring() {
  const scroller = document.scrollingElement;
  if (!(scroller instanceof HTMLElement)) return () => {};
  const lock = anchorLocks.get(scroller) ?? {
    count: 0,
    previous: scroller.style.overflowAnchor,
  };
  if (lock.count++ === 0) scroller.style.overflowAnchor = "none";
  anchorLocks.set(scroller, lock);
  return () => {
    if (--lock.count === 0) {
      scroller.style.overflowAnchor = lock.previous;
      anchorLocks.delete(scroller);
    }
  };
}

/** A stable artwork stage grows its layout slot from the inline preview to full size. */
export function useVideoReveal(
  rootRef: RefObject<HTMLElement | null>,
  expanded: boolean,
  enabled: boolean,
) {
  const initialHashHandled = useRef(false);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const slot = root?.querySelector<HTMLElement>("[data-video-slot]");
    const stage = root?.querySelector<HTMLElement>("[data-video-stage]");
    const frame = root?.querySelector<HTMLElement>("[data-video-frame]");
    const clip = root?.querySelector<HTMLElement>("[data-video-clip]");
    const media = root?.querySelector<HTMLElement>("[data-video-media]");
    const previewAnchor = root?.querySelector<HTMLElement>(
      "[data-video-preview-anchor]",
    );
    const decoration = root?.querySelector<HTMLElement>(
      "[data-video-decoration]",
    );
    if (
      !root ||
      !slot ||
      !stage ||
      !frame ||
      !clip ||
      !media ||
      !previewAnchor ||
      !decoration
    )
      return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = window.matchMedia("(max-width: 47.499rem)");
    let geometry: ReturnType<typeof getVideoRevealGeometry> | undefined;
    let measurement: VideoRevealMeasurement | undefined;
    let animations: Animation[] = [];
    let request = 0;
    let anchorRequest = 0;
    let releaseAnchoring: (() => void) | undefined;
    let previousProgress = -1;
    let disposed = false;

    const holdAnchoring = () => {
      cancelAnimationFrame(anchorRequest);
      anchorRequest = 0;
      releaseAnchoring ??= suspendScrollAnchoring();
    };
    const restoreAnchoring = () => {
      if (!releaseAnchoring || anchorRequest) return;
      // Apply this frame's layout before restoring browser scroll anchoring.
      anchorRequest = requestAnimationFrame(() => {
        anchorRequest = 0;
        releaseAnchoring?.();
        releaseAnchoring = undefined;
      });
    };
    const reset = () => {
      animations.forEach((animation) => animation.cancel());
      animations = [];
      slot.style.removeProperty("height");
      media.style.removeProperty("height");
      geometry = undefined;
      previousProgress = -1;
    };
    const update = () => {
      request = 0;
      if (!geometry) return;
      const progress = getVideoRevealProgress(geometry, window.scrollY);
      if (progress === previousProgress) return;
      holdAnchoring();
      animations.forEach((animation) => {
        animation.currentTime = progress * duration;
      });
      previousProgress = progress;
      restoreAnchoring();
    };
    const schedule = () => {
      if (geometry && !request && !document.hidden)
        request = requestAnimationFrame(update);
    };
    const measure = () => {
      if (disposed) return;
      // This stage has final artwork dimensions even while its layout slot is
      // preview-sized. Measuring it cannot create a height/progress feedback loop.
      const bounds = stage.getBoundingClientRect();
      const gap = parseFloat(
        getComputedStyle(root).getPropertyValue("--video-gap"),
      );
      const nextMeasurement = {
        top: bounds.top + window.scrollY,
        width: bounds.width,
        height: bounds.height,
        viewportHeight: innerHeight,
        viewportWidth: innerWidth,
        bottomGap: gap,
        topOffset: parseFloat(
          getComputedStyle(root).getPropertyValue("--video-top"),
        ),
        compact: compact.matches,
        previewInset: previewAnchor.getBoundingClientRect().left - bounds.left,
        reducedMotion: reducedMotion.matches,
      };
      if (!hasVideoRevealLayoutChanged(measurement, nextMeasurement)) {
        schedule();
        return;
      }
      holdAnchoring();
      reset();
      measurement = nextMeasurement;
      root.dataset.ready = "true";
      if (
        !enabled ||
        reducedMotion.matches ||
        expanded ||
        innerHeight < 480 ||
        typeof frame.animate !== "function" ||
        typeof ResizeObserver !== "function"
      ) {
        slot.style.height = `${bounds.height}px`;
        restoreAnchoring();
        return;
      }
      if (!bounds.width || !bounds.height) {
        restoreAnchoring();
        return;
      }
      geometry = getVideoRevealGeometry(nextMeasurement);
      media.style.height = `${bounds.width * (9 / 16)}px`;
      const animate = (element: HTMLElement, keyframes: Keyframe[]) => {
        const animation = element.animate(keyframes, {
          duration,
          easing,
          fill: "both",
        });
        animation.pause();
        animations.push(animation);
      };
      animate(slot, [
        { height: `${geometry.previewHeight}px` },
        { height: `${bounds.height}px` },
      ]);
      animate(clip, [
        { clipPath: geometry.clip },
        { clipPath: "inset(0px 0px 0px 0px)" },
      ]);
      animate(media, [
        { transform: geometry.mediaStart },
        { transform: geometry.mediaEnd },
      ]);
      animate(decoration, [
        {
          width: `${geometry.previewWidth}px`,
          height: `${geometry.previewHeight}px`,
          left: `${geometry.previewInset}px`,
        },
        {
          width: `${bounds.width}px`,
          height: `${bounds.height}px`,
          left: "0px",
        },
      ]);
      root
        .querySelectorAll<HTMLElement>("[data-video-trace]")
        .forEach((edge) => {
          const axis = edge.dataset.videoTrace === "horizontal" ? "X" : "Y";
          animate(edge, [
            { transform: `scale${axis}(${axis === "X" ? 0.25 : 0.5})` },
            { transform: `scale${axis}(1)` },
          ]);
        });
      update();
    };

    const fragmentTarget = (hash: string) => {
      try {
        return hash
          ? document.getElementById(decodeURIComponent(hash.slice(1)))
          : null;
      } catch {
        return null;
      }
    };
    const expandForTarget = (target: HTMLElement | null) => {
      if (
        !target ||
        !geometry ||
        (target !== root &&
          !(
            root.compareDocumentPosition(target) &
            Node.DOCUMENT_POSITION_FOLLOWING
          ))
      )
        return false;
      holdAnchoring();
      animations.forEach((animation) => {
        animation.currentTime = duration;
      });
      previousProgress = -1;
      return true;
    };
    const beforeLink = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>("a[href]")
          : null;
      if (
        !link ||
        link.hasAttribute("download") ||
        (link.target && link.target !== "_self")
      )
        return;
      const url = new URL(link.href, location.href);
      if (
        url.origin === location.origin &&
        url.pathname === location.pathname &&
        url.search === location.search
      )
        expandForTarget(fragmentTarget(url.hash));
    };
    const followHash = () => {
      const target = fragmentTarget(location.hash);
      if (expandForTarget(target))
        target?.scrollIntoView({ block: "start", behavior: "auto" });
    };

    measure();
    const observer =
      typeof ResizeObserver === "function"
        ? new ResizeObserver(measure)
        : undefined;
    observer?.observe(stage);
    // Observe preceding content at each nesting level, including hero copy.
    // The slot and its ancestors grow every frame and must not be observed.
    for (
      let ancestor: HTMLElement | null = root;
      ancestor && ancestor !== document.body;
      ancestor = ancestor.parentElement
    ) {
      for (
        let sibling = ancestor.previousElementSibling;
        sibling;
        sibling = sibling.previousElementSibling
      ) {
        const position = getComputedStyle(sibling).position;
        // Absolute hero backgrounds resize with the slot but do not move it.
        if (position !== "absolute" && position !== "fixed")
          observer?.observe(sibling);
      }
    }
    document.fonts.ready.then(() => {
      if (disposed) return;
      measure();
      if (!initialHashHandled.current) {
        initialHashHandled.current = true;
        followHash();
      }
    });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    window.addEventListener("pageshow", measure);
    window.addEventListener("hashchange", followHash);
    document.addEventListener("click", beforeLink, true);
    document.addEventListener("visibilitychange", schedule);
    reducedMotion.addEventListener("change", measure);
    compact.addEventListener("change", measure);

    return () => {
      disposed = true;
      cancelAnimationFrame(request);
      cancelAnimationFrame(anchorRequest);
      observer?.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
      window.removeEventListener("pageshow", measure);
      window.removeEventListener("hashchange", followHash);
      document.removeEventListener("click", beforeLink, true);
      document.removeEventListener("visibilitychange", schedule);
      reducedMotion.removeEventListener("change", measure);
      compact.removeEventListener("change", measure);
      reset();
      delete root.dataset.ready;
      releaseAnchoring?.();
    };
  }, [enabled, expanded, rootRef]);
}
