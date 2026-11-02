"use client";

import { useEffect, useRef, type ReactNode } from "react";

type StatGridProps = {
  children: ReactNode;
};

export function StatGrid({ children }: StatGridProps) {
  const gridRef = useRef<HTMLDListElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || typeof ResizeObserver !== "function") return;

    const measurements = Array.from(
      grid.querySelectorAll<HTMLElement>("[data-stat-measure]"),
    );

    const fit = () => {
      const capacity = Number(
        getComputedStyle(grid).getPropertyValue("--stat-capacity"),
      );
      let minimumWidth = 0;

      for (const measurement of measurements) {
        const item = measurement.closest<HTMLElement>("[data-stat-item]");
        if (!item) continue;
        const styles = getComputedStyle(item);
        minimumWidth = Math.max(
          minimumWidth,
          measurement.getBoundingClientRect().width +
            parseFloat(styles.paddingLeft) +
            parseFloat(styles.paddingRight) +
            1,
        );
      }

      const columns = Math.max(
        1,
        Math.min(capacity, Math.floor(grid.clientWidth / minimumWidth)),
      );

      if (grid.dataset.columns !== String(columns)) {
        grid.dataset.columns = String(columns);
      }
    };

    const observer = new ResizeObserver(fit);
    observer.observe(grid);
    measurements.forEach((measurement) => observer.observe(measurement));

    return () => observer.disconnect();
  }, [children]);

  return (
    <dl
      ref={gridRef}
      className="group/stat-grid grid grid-cols-12 [--stat-capacity:1] [--stat-vertical:0] @min-[320px]/trust-grid:[--stat-capacity:2] @min-[672px]/trust-grid:[--stat-capacity:3] @min-[672px]/trust-grid:[--stat-vertical:1] @min-[896px]/trust-grid:[--stat-capacity:4]"
    >
      {children}
    </dl>
  );
}
