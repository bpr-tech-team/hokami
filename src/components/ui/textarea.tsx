import * as React from "react";
import { cn } from "cn";
import { formControlVariants } from "./form-control-variants";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(formControlVariants({ multiline: true }), className)}
      {...props}
    />
  );
}

export { Textarea };
