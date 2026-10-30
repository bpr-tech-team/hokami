import { cn } from "cn";
import { cva, type VariantProps } from "class-variance-authority";
import { TraceDot } from "./trace-dot";

const edgeVariants = cva(
  "absolute bg-current transition-[width,height] duration-250 group-active/button:duration-100",
  {
    variants: {
      orientation: {
        horizontal:
          "h-0.5 w-1/4 group-hover/button:w-full group-active/button:w-full group-focus-visible/button:w-full",
        vertical:
          "w-0.5 h-1/2 group-hover/button:h-full group-active/button:h-full group-focus-visible/button:h-full",
      },
    },
  },
);

function TraceEdge({
  orientation,
  edge,
  className,
}: VariantProps<typeof edgeVariants> & {
  edge: string;
  className: string;
}) {
  return (
    <span
      data-edge={edge}
      className={cn(edgeVariants({ orientation }), className)}
    />
  );
}

export function ButtonTrace({ variant }: { variant: "primary" | "secondary" }) {
  return (
    <span
      data-slot="button-trace"
      className={cn(
        "pointer-events-none absolute inset-0 group-ui-disabled/button:hidden",
        variant === "secondary"
          ? "-inset-px text-brand-identity"
          : "text-action-primary-trace",
      )}
      aria-hidden="true"
    >
      <TraceEdge
        edge="top"
        orientation="horizontal"
        className="-top-px left-0"
      />
      <TraceEdge
        edge="left"
        orientation="vertical"
        className="top-0 -left-px"
      />
      <TraceEdge
        edge="bottom"
        orientation="horizontal"
        className="right-0 -bottom-px"
      />
      <TraceEdge
        edge="right"
        orientation="vertical"
        className="-right-px bottom-0"
      />
      <TraceDot
        data-corner="top-left"
        variant={variant}
        className="-top-[4.5px] -left-[4.5px] group-focus-visible/button:invisible"
      />
      <TraceDot
        data-corner="bottom-right"
        variant={variant}
        className="-right-[4.5px] -bottom-[4.5px] group-focus-visible/button:invisible"
      />
    </span>
  );
}
