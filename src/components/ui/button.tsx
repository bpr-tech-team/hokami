"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import type { VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { useId, type ReactNode } from "react";
import { buttonVariants } from "./button-variants";
import { ButtonContent } from "./button-content";

type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    icon?: ReactNode;
    showIcon?: boolean;
    loading?: boolean;
    /** Pass a translated label, e.g. "Odesílám…". Defaults to children. */
    loadingLabel?: ReactNode;
  };

function Button({
  children,
  className,
  variant = "default",
  size = "default",
  icon,
  showIcon = !size?.startsWith("icon") &&
    (variant === "default" || variant === "outline"),
  disabled = false,
  focusableWhenDisabled = false,
  loading = false,
  loadingLabel,
  "aria-busy": ariaBusy,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...props
}: ButtonProps) {
  const labelId = useId();
  const loadingLabelId = useId();
  const showLoadingLabel = loading && loadingLabel != null;

  return (
    <ButtonPrimitive
      {...props}
      data-slot="button"
      data-loading={loading || undefined}
      disabled={disabled || loading}
      focusableWhenDisabled={loading || focusableWhenDisabled}
      aria-busy={loading || ariaBusy}
      aria-label={ariaLabel}
      aria-labelledby={
        ariaLabelledBy ??
        (ariaLabel ? undefined : showLoadingLabel ? loadingLabelId : labelId)
      }
      className={(state) =>
        cn(
          buttonVariants({ variant, size }),
          typeof className === "function" ? className(state) : className,
        )
      }
    >
      <ButtonContent
        variant={variant}
        size={size}
        icon={icon}
        showIcon={showIcon}
        loading={loading}
        loadingLabel={loadingLabel}
        labelId={labelId}
        loadingLabelId={loadingLabelId}
      >
        {children}
      </ButtonContent>
    </ButtonPrimitive>
  );
}

export { Button, buttonVariants, type ButtonProps };
