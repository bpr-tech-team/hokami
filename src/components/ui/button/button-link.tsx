import type { ComponentProps, ReactNode } from "react";
import type { VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { ButtonContent } from "./button-content";
import { buttonVariants } from "./button-variants";

type ButtonLinkProps = ComponentProps<"a"> &
  VariantProps<typeof buttonVariants> & {
    href: string;
    icon?: ReactNode;
    showIcon?: boolean;
  };

/** Button styling with native link semantics, without Base UI's button role. */
function ButtonLink({
  children,
  className,
  variant = "default",
  size = "default",
  icon,
  showIcon,
  ...props
}: ButtonLinkProps) {
  return (
    <a
      {...props}
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
    >
      <ButtonContent
        variant={variant}
        size={size}
        icon={icon}
        showIcon={showIcon}
      >
        {children}
      </ButtonContent>
    </a>
  );
}

export { ButtonLink, type ButtonLinkProps };
