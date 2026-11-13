import type { FormFieldInputProps } from "@keystatic/core";
import type { ReactElement, ReactNode } from "react";
import { cn } from "@/lib/utils";

type JobFieldArea =
  | "status"
  | "order"
  | "title"
  | "department"
  | "description"
  | "content"
  | "languages"
  | "translations";

// Keystatic 0.6 places each public field Input in a grid item. Cloud adds
// one data-ks-path wrapper for presence indicators. Scope both layouts to
// our markers, without depending on generated vendor classes.
const publishingLayout = cn(
  "[div:has(>&,>[data-ks-path]>&)]:[grid-area:2/1/3/-1]!",
  "[div:has(>&,>[data-ks-path]>&)~div:has(>[data-job-field=order],>[data-ks-path]>[data-job-field=order])]:[grid-area:3/1/4/-1]!",
  "tablet:[div:has(>&,>[data-ks-path]>&)]:[grid-area:2/1/3/7]!",
  "tablet:[div:has(>&,>[data-ks-path]>&)~div:has(>[data-job-field=order],>[data-ks-path]>[data-job-field=order])]:[grid-area:2/7/3/13]!",
  "xl:[div:has(>&,>[data-ks-path]>&)]:[grid-area:status]!",
  "[div:has(>div>div>&,>div>div>[data-ks-path]>&)]:max-w-content!",
  "[div:has(>div>&,>div>[data-ks-path]>&)]:gap-y-3!",
  "xl:[div:has(>div>&,>div>[data-ks-path]>&)]:gap-x-4!",
  "xl:[div:has(>div>&,>div>[data-ks-path]>&)]:grid-cols-[repeat(2,minmax(0,1fr))_--spacing(4)_--spacing(64)]!",
  "xl:[div:has(>div>&,>div>[data-ks-path]>&)]:[grid-template-areas:'identifier_identifier_._languages'_'status_order_._languages'_'title_title_._languages'_'department_department_._languages'_'description_description_._languages'_'content_content_._languages'_'translations_translations_._languages']!",
  "xl:[div:has(>div>&,>div>[data-ks-path]>&)>div:has(>[data-job-field=order],>[data-ks-path]>[data-job-field=order])]:[grid-area:order]!",
  "xl:[div:has(>div>&,>div>[data-ks-path]>&)>div:has(>[data-job-field=department],>[data-ks-path]>[data-job-field=department])]:[grid-area:department]!",
  "xl:[div:has(>div>&,>div>[data-ks-path]>&)>div:has(>[data-job-field=description],>[data-ks-path]>[data-job-field=description])]:[grid-area:description]!",
  "xl:[div:has(>div>&,>div>[data-ks-path]>&)>div:has(>[data-job-field=content],>[data-ks-path]>[data-job-field=content])]:[grid-area:content]!",
  "xl:[div:has(>div>&,>div>[data-ks-path]>&)>div:has(>[data-job-field=languages],>[data-ks-path]>[data-job-field=languages])]:[grid-area:languages]!",
  "xl:[div:has(>div>&,>div>[data-ks-path]>&)>div:has(>[data-job-field=translations],>[data-ks-path]>[data-job-field=translations])]:[grid-area:translations]!",
);

// The native slug Input contains both controls. Share the form's row tracks so
// status/order can sit between them without replacing slug generation/validation.
const titleLayout = cn(
  "[grid-row:1/-1] grid grid-cols-1 grid-rows-subgrid gap-[normal]",
  "[div:has(>&,>[data-ks-path]>&)]:grid!",
  "[div:has(>&,>[data-ks-path]>&)]:grid-cols-1!",
  "[div:has(>&,>[data-ks-path]>&)]:grid-rows-subgrid!",
  "[div:has(>&,>[data-ks-path]>&)]:[grid-area:1/1/5/-1]!",
  "tablet:[div:has(>&,>[data-ks-path]>&)]:[grid-area:1/1/4/-1]!",
  "xl:[div:has(>&,>[data-ks-path]>&)]:[grid-area:1/1/4/3]!",
  "[div[data-ks-path]:has(>&)]:[grid-area:1/1/-1/-1]!",
  "[div[data-ks-path]:has(>&)>div:not([data-job-field])]:[grid-area:1/1/2/2]!",
  "[&>div]:col-start-1! [&>div]:[grid-row:1/-1]! [&>div]:grid! [&>div]:grid-cols-1! [&>div]:grid-rows-subgrid! [&>div]:gap-[normal]!",
  "[&>div>div:first-child]:[grid-row:-2/-1]! [&>div>div:last-child]:row-start-1!",
  "[&_button]:h-12! [&_input]:h-12! [&_label]:font-mono! [&_label]:text-xs! [&_label]:leading-body! [&_label]:font-normal! [&_label]:tracking-label! [&_label]:text-text-secondary! [&_label]:uppercase",
);

export function JobAdminField({
  area,
  children,
}: {
  area: JobFieldArea;
  children: ReactNode;
}) {
  return (
    <div
      data-job-field={area}
      className={cn(
        "min-w-0 scroll-mt-24",
        area === "status" && publishingLayout,
        area === "status" &&
          "[&_[data-slot=native-select-icon]]:text-text-accent [&_select]:border-2 [&_select]:border-action-primary [&_select]:font-bold [&_select:focus-visible]:outline-2 [&_select:focus-visible]:outline-offset-2 [&_select:focus-visible]:outline-focus-ring [&_select:hover]:border-action-primary-hover",
        area === "title" && titleLayout,
        area === "languages" && "h-full [div[data-ks-path]:has(>&)]:h-full",
      )}
    >
      {area === "title" && (
        <span
          id="job-language-en"
          tabIndex={-1}
          className="col-start-1 [grid-row:-2/-1] h-0 scroll-mt-24"
        />
      )}
      {children}
    </div>
  );
}

export function withJobFieldLayout<Field, Value>(
  field: Field & {
    Input(props: FormFieldInputProps<Value>): ReactElement | null;
  },
  area: JobFieldArea,
): Field {
  const NativeInput = field.Input;
  return {
    ...field,
    Input(props: FormFieldInputProps<Value>) {
      return (
        <JobAdminField area={area}>
          <NativeInput {...props} />
        </JobAdminField>
      );
    },
  };
}
