"use client";

import { useEffect, type RefObject } from "react";
import {
  getProcessScrollProgress,
  getProcessScrollState,
} from "./process-scroll-timeline";

export function useProcessScroll(
  rootRef: RefObject<HTMLDivElement | null>,
  count: number,
) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !count) return;

    const scene = root.querySelector<HTMLElement>(
      "[data-process-scroll-scene]",
    );
    const orbit = root.querySelector<HTMLElement>("[data-process-orbit]");
    const progress = root.querySelector<HTMLElement>("[data-process-progress]");
    const ring = root.querySelector<HTMLElement>("[data-process-scroll-ring]");
    if (!scene || !orbit || !progress || !ring) return;

    const steps = Array.from(
      root.querySelectorAll<HTMLElement>("[data-process-scroll-step]"),
    );
    const exits = Array.from(
      root.querySelectorAll<HTMLElement>("[data-process-scroll-exit]"),
    );
    const nodes = Array.from(
      root.querySelectorAll<HTMLElement>("[data-process-node]"),
    );
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const native =
      typeof CSS?.supports === "function" &&
      CSS.supports("animation-timeline", "--process-scroll") &&
      CSS.supports("animation-range", "contain 0% contain 100%") &&
      CSS.supports("view-timeline-inset", "0px 0px");

    let driver: "native" | "fallback" | "reduced";
    let start = 0;
    let distance = 0;
    let textOffset = 18;
    let frame = 0;
    let measure = true;
    let disposed = false;

    const render = () => {
      frame = 0;
      if (disposed) return;

      if (measure) {
        const top = Number.parseFloat(getComputedStyle(scene).top) || 0;
        const bounds = root.getBoundingClientRect();
        const container = root.parentElement;
        const headingOffset =
          container?.firstElementChild?.tagName === "HEADER"
            ? bounds.top - container.getBoundingClientRect().top
            : 0;
        start = bounds.top + window.scrollY - top;
        distance = bounds.height - scene.getBoundingClientRect().height;
        textOffset = Math.max(
          0,
          Math.min(18, (ring.getBoundingClientRect().width - 280) * 0.05),
        );
        // Keep the original section's background frame as the scene sticks.
        root.style.setProperty(
          "--process-heading-offset",
          `${headingOffset}px`,
        );
        measure = false;
      }
      if (count < 2 || driver === "native") return;

      const position = getProcessScrollProgress(
        window.scrollY,
        start,
        distance,
      );
      const state = getProcessScrollState(
        position,
        count,
        driver === "reduced",
        textOffset,
      );
      orbit.style.transform = `rotate(${state.angle}deg)`;
      progress.style.setProperty("--process-scroll-angle", `${state.angle}deg`);
      nodes.forEach((node, index) => {
        node.style.opacity = String(state.nodes[index]);
      });
      steps.forEach((step, index) => {
        const stateStep = state.steps[index];
        step.style.opacity = String(stateStep.enter);
        step.style.transform = `translateY(${stateStep.enterY}px)`;
        exits[index].style.opacity = String(stateStep.exit);
        exits[index].style.transform = `translateY(${stateStep.exitY}px)`;
      });
    };
    const schedule = () => {
      if (!frame && !disposed) frame = requestAnimationFrame(render);
    };
    const resize = () => {
      measure = true;
      schedule();
    };
    const clear = () => {
      orbit.style.removeProperty("transform");
      progress.style.removeProperty("--process-scroll-angle");
      [...steps, ...exits].forEach((element) => {
        element.style.removeProperty("opacity");
        element.style.removeProperty("transform");
      });
      nodes.forEach((node, index) => {
        node.style.opacity = index === 0 ? "1" : "0";
      });
    };
    const configure = () => {
      if (count < 2) {
        resize();
        return;
      }
      driver = reducedMotion.matches
        ? "reduced"
        : native
          ? "native"
          : "fallback";
      clear();
      root.dataset.driver = driver;
      window.removeEventListener("scroll", schedule);
      if (driver !== "native")
        window.addEventListener("scroll", schedule, { passive: true });
      resize();
    };

    configure();
    const observer = new ResizeObserver(resize);
    observer.observe(root);
    observer.observe(scene);
    if (root.parentElement) observer.observe(root.parentElement);
    // Content above the section can change its start without resizing the track.
    observer.observe(document.body);
    window.addEventListener("resize", resize);
    window.addEventListener("pageshow", resize);
    window.visualViewport?.addEventListener("resize", resize);
    reducedMotion.addEventListener("change", configure);
    void document.fonts.ready.then(resize);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pageshow", resize);
      window.visualViewport?.removeEventListener("resize", resize);
      reducedMotion.removeEventListener("change", configure);
      clear();
      delete root.dataset.driver;
      root.style.removeProperty("--process-heading-offset");
    };
  }, [count, rootRef]);
}
