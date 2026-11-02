import { getProcessNode } from "./process-timeline";

export function ProcessDiagram({ count }: { count: number }) {
  return (
    <div
      data-slot="process-diagram"
      aria-hidden="true"
      className="pointer-events-none relative aspect-square w-full [--process-unit:calc(100cqw/620)]"
    >
      <div className="absolute inset-[calc(40.583*var(--process-unit))] rounded-full border-[calc(1.5*var(--process-unit))] border-border-subtle" />
      <div
        data-process-progress
        className="absolute inset-0 mask-[conic-gradient(#000_var(--process-angle,0deg),transparent_0deg)]"
      >
        <div className="absolute inset-[calc(40.083*var(--process-unit))] rounded-full border-[calc(2.5*var(--process-unit))] border-text-accent shadow-[0_0_calc(8*var(--process-unit))_color-mix(in_srgb,var(--color-brand-identity)_40%,transparent),inset_0_0_calc(8*var(--process-unit))_color-mix(in_srgb,var(--color-brand-identity)_40%,transparent)]" />
      </div>
      {Array.from({ length: count }, (_, index) => {
        const { x, y } = getProcessNode(index, count);

        return (
          <div
            key={index}
            className="absolute size-[calc(12*var(--process-unit))] -translate-1/2"
            style={{ left: `${(x / 620) * 100}%`, top: `${(y / 620) * 100}%` }}
          >
            <div className="absolute inset-0 rounded-full border-[calc(1.5*var(--process-unit))] border-text-tertiary bg-surface-default" />
            <div
              data-process-node
              className="absolute inset-0 rounded-full bg-text-accent shadow-[0_0_calc(10*var(--process-unit))_color-mix(in_srgb,var(--color-brand-identity)_90%,transparent)]"
              style={{ opacity: index === 0 ? 1 : 0 }}
            />
          </div>
        );
      })}
      <div data-process-orbit className="absolute inset-0">
        <div className="absolute top-[calc(41.333*var(--process-unit))] left-1/2 size-[calc(16*var(--process-unit))] -translate-1/2 rounded-full bg-text-accent shadow-[0_0_calc(12*var(--process-unit))_var(--color-brand-identity),0_0_calc(26*var(--process-unit))_color-mix(in_srgb,var(--color-brand-identity)_60%,transparent)]" />
      </div>
    </div>
  );
}
