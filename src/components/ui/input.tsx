import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "cn";
import { formControlVariants } from "./form-control-variants";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(formControlVariants(), className)}
      {...props}
    />
  );
}

export { Input };
