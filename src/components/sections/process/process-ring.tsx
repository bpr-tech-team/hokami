"use client";

import { useEffect, useRef } from "react";
import { ProcessDiagram } from "./process-diagram";
import { ProcessStep } from "./process-step";
import { getProcessTimeline } from "./process-timeline";
import type { ProcessStep as ProcessStepContent } from "./types";

type ProcessRingProps = {
  steps: readonly ProcessStepContent[];
};

let progressPropertyRegistered = false;

function registerProgressProperty() {
  if (progressPropertyRegistered) return;

  try {
    CSS.registerProperty({
      name: "--process-angle",
      syntax: "<angle>",
      inherits: false,
      initialValue: "0deg",
    });
  } catch (error) {
    // A development hot reload can leave the property registered in the page.
    if (
      !(error instanceof DOMException) ||
      error.name !== "InvalidModificationError"
    )
      throw error;
  }

  progressPropertyRegistered = true;
}

export function ProcessRing({ steps }: ProcessRingProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (
      !root ||
      !steps.length ||
      typeof root.animate !== "function" ||
      typeof IntersectionObserver !== "function" ||
      typeof window.CSS?.registerProperty !== "function"
    )
      return;

    registerProgressProperty();
    const timeline = getProcessTimeline(steps.length);
    const animations: Animation[] = [];
    const animate = (element: Element | null, frames: Keyframe[]) => {
      if (!element || steps.length < 2) return;
      const animation = element.animate(frames, {
        duration: timeline.duration,
        iterations: 1,
        fill: "both",
      });
      animation.pause();
      animation.currentTime = 0;
      animations.push(animation);
    };

    animate(root.querySelector("[data-process-orbit]"), timeline.orbit);
    animate(root.querySelector("[data-process-progress]"), timeline.progress);
    root
      .querySelectorAll("[data-process-node]")
      .forEach((element, index) => animate(element, timeline.nodes[index]));
    root
      .querySelectorAll("[data-process-step]")
      .forEach((element, index) => animate(element, timeline.steps[index]));

    let inViewport = false;
    const onFinish = () => {
      root.dataset.motion = "complete";
    };
    const update = () => {
      if (animations[0]?.playState === "finished") {
        onFinish();
        return;
      }

      const running = inViewport && !document.hidden;
      animations.forEach((animation) => {
        if (animation.playState === "finished") return;
        if (running) animation.play();
        else animation.pause();
      });
      root.dataset.motion = running && steps.length > 1 ? "running" : "paused";
    };
    const observer = new IntersectionObserver(([entry]) => {
      inViewport = entry.isIntersecting;
      update();
    });

    root.dataset.enhanced = "true";
    animations[0]?.addEventListener("finish", onFinish);
    observer.observe(root);
    document.addEventListener("visibilitychange", update);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
      animations[0]?.removeEventListener("finish", onFinish);
      animations.forEach((animation) => animation.cancel());
      delete root.dataset.enhanced;
    };
  }, [steps]);

  if (!steps.length) return null;

  return (
    <div
      ref={rootRef}
      data-slot="process-ring"
      data-motion="paused"
      className="group/process @container/process mx-auto w-full max-w-[620px]"
    >
      <ol className="grid gap-8 group-data-[enhanced=true]/process:sr-only">
        {steps.map((step) => (
          <li key={step.id}>
            <ProcessStep step={step} />
          </li>
        ))}
      </ol>
      <div
        aria-hidden="true"
        className="relative hidden aspect-square w-full group-data-[enhanced=true]/process:block"
      >
        <ProcessDiagram count={steps.length} />
        <div className="pointer-events-none absolute inset-x-[14.52%] inset-y-0 grid items-center text-center">
          {steps.map((step, index) => (
            <div
              key={step.id}
              data-process-step={step.id}
              className="col-start-1 row-start-1"
              style={{ opacity: index === 0 ? 1 : 0 }}
            >
              <ProcessStep step={step} ring />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
