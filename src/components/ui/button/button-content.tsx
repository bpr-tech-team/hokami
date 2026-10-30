import type { ReactNode } from "react";
import type { VariantProps } from "class-variance-authority";
import { buttonVariants } from "./button-variants";
import { cn } from "cn";
import { ButtonTrace } from "./button-trace";

const label =
  "col-start-1 row-start-1 inline-flex items-center justify-center gap-3";

type ButtonContentProps = VariantProps<typeof buttonVariants> & {
  children: ReactNode;
  icon?: ReactNode;
  showIcon?: boolean;
  showTraceDots?: boolean;
  loading?: boolean;
  loadingLabel?: ReactNode;
  labelId?: string;
  loadingLabelId?: string;
};

function ButtonContent({
  children,
  variant = "default",
  size = "default",
  icon,
  showIcon = !size?.startsWith("icon") &&
    (variant === "default" || variant === "outline"),
  showTraceDots = true,
  loading = false,
  loadingLabel,
  labelId,
  loadingLabelId,
}: ButtonContentProps) {
  const showLoadingLabel = loading && loadingLabel != null;

  return (
    <>
      {(variant === "default" || variant === "outline") && (
        <ButtonTrace
          variant={variant === "outline" ? "secondary" : "primary"}
          showDots={showTraceDots}
        />
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
