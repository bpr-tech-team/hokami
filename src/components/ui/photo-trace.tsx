import { TraceDot } from "./button/trace-dot";

export function PhotoTrace() {
  return (
    <span
      data-photo-trace
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
    >
      <span className="absolute -top-px right-0 h-0.5 w-1/4 bg-brand-identity" />
      <span className="absolute bottom-0 -left-px h-1/2 w-0.5 bg-brand-identity" />
      <span className="absolute -bottom-px left-0 h-0.5 w-1/4 bg-brand-identity" />
      <span className="absolute top-0 -right-px h-1/2 w-0.5 bg-brand-identity" />
      <TraceDot
        data-photo-corner="bottom-left"
        className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2"
      />
      <TraceDot
        data-photo-corner="top-right"
        className="top-0 right-0 translate-x-1/2 -translate-y-1/2"
      />
    </span>
  );
}
