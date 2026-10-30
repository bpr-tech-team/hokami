import type { ReactNode } from "react";
import type { VariantProps } from "class-variance-authority";
import { buttonVariants } from "./button-variants";
import { cn } from "cn";

const edge =
  "absolute bg-current transition-[width,height] duration-250 group-active/button:duration-100";
const horizontal =
  "h-0.5 w-1/4 group-hover/button:w-full group-active/button:w-full group-focus-visible/button:w-full";
const vertical =
  "w-0.5 h-1/2 group-hover/button:h-full group-active/button:h-full group-focus-visible/button:h-full";
const dot =
  "absolute size-[9px] bg-contain bg-center bg-no-repeat group-focus-visible/button:invisible";
const label =
  "col-start-1 row-start-1 inline-flex items-center justify-center gap-3";

type ButtonContentProps = VariantProps<typeof buttonVariants> & {
  children: ReactNode;
  icon?: ReactNode;
  showIcon?: boolean;
  loading?: boolean;
  loadingLabel?: ReactNode;
  labelId?: string;
  loadingLabelId?: string;
};

/** Shared by action buttons and navigation links, including the Figma artwork. */
function ButtonContent({
  children,
  variant = "default",
  size = "default",
  icon,
  showIcon = !size?.startsWith("icon") &&
    (variant === "default" || variant === "outline"),
  loading = false,
  loadingLabel,
  labelId,
  loadingLabelId,
}: ButtonContentProps) {
  const showLoadingLabel = loading && loadingLabel != null;

  return (
    <>
      {(variant === "default" || variant === "outline") && (
        <span
          data-slot="button-trace"
          className={cn(
            "pointer-events-none absolute inset-0 group-ui-disabled/button:hidden",
            variant === "outline"
              ? "-inset-px text-brand-identity"
              : "text-action-primary-trace",
          )}
          aria-hidden="true"
        >
          <span
            data-edge="top"
            className={cn(edge, horizontal, "-top-px left-0")}
          />
          <span
            data-edge="left"
            className={cn(edge, vertical, "top-0 -left-px")}
          />
          <span
            data-edge="bottom"
            className={cn(edge, horizontal, "right-0 -bottom-px")}
          />
          <span
            data-edge="right"
            className={cn(edge, vertical, "-right-px bottom-0")}
          />
          <span
            data-corner="top-left"
            className={cn(
              dot,
              "-top-[4.5px] -left-[4.5px]",
              variant === "outline"
                ? "bg-[url('/images/ui/button/dot-secondary.svg')]"
                : "bg-[url('/images/ui/button/dot-primary.svg')]",
            )}
          />
          <span
            data-corner="bottom-right"
            className={cn(
              dot,
              "-right-[4.5px] -bottom-[4.5px]",
              variant === "outline"
                ? "bg-[url('/images/ui/button/dot-secondary.svg')]"
                : "bg-[url('/images/ui/button/dot-primary.svg')]",
            )}
          />
        </span>
      )}
      {/* Reserve both labels' widths before submission starts. */}
      <span data-slot="button-labels" className="relative inline-grid">
        <span
          id={labelId}
          className={cn(label, showLoadingLabel && "invisible")}
          aria-hidden={showLoadingLabel || undefined}
        >
          {children}
        </span>
        {loadingLabel != null && (
          <span
            id={loadingLabelId}
            className={cn(label, !loading && "invisible")}
            aria-hidden={!loading || undefined}
          >
            {loadingLabel}
          </span>
        )}
      </span>
      {showIcon && (
        <span
          data-slot="button-icon"
          className="relative inline-flex size-5 flex-none"
          aria-hidden="true"
        >
          {icon ?? (
            <span
              data-slot="button-arrow"
              className={cn(
                "relative inline-flex size-5 flex-none bg-contain bg-center bg-no-repeat group-ui-disabled/button:bg-[url('/images/ui/button/arrow-disabled.svg')]",
                variant === "default"
                  ? "bg-[url('/images/ui/button/arrow-primary.svg')]"
                  : "bg-[url('/images/ui/button/arrow-secondary.svg')]",
              )}
            />
          )}
        </span>
      )}
    </>
  );
}

export { ButtonContent };
