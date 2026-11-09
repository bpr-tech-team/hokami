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
  "tablet:[div:has(>&,>[data-ks-path]>&)]:col-span-6!",
  "tablet:[div:has(>&,>[data-ks-path]>&)~div:has(>[data-job-field=order],>[data-ks-path]>[data-job-field=order])]:col-span-6!",
  "xl:[div:has(>&,>[data-ks-path]>&)]:[grid-area:status]!",
  "[div:has(>div>div>&,>div>div>[data-ks-path]>&)]:max-w-content!",
  "xl:[div:has(>div>&,>div>[data-ks-path]>&)]:gap-x-4!",
  "xl:[div:has(>div>&,>div>[data-ks-path]>&)]:grid-cols-[repeat(2,minmax(0,1fr))_--spacing(4)_--spacing(64)]!",
  "xl:[div:has(>div>&,>div>[data-ks-path]>&)]:[grid-template-areas:'status_order_._languages'_'title_title_._languages'_'department_department_._languages'_'description_description_._languages'_'content_content_._languages'_'translations_translations_._languages']!",
  "xl:[div:has(>div>&,>div>[data-ks-path]>&)>div:has(>[data-job-field=order],>[data-ks-path]>[data-job-field=order])]:[grid-area:order]!",
  "xl:[div:has(>div>&,>div>[data-ks-path]>&)>div:has(>[data-job-field=title],>[data-ks-path]>[data-job-field=title])]:[grid-area:title]!",
  "xl:[div:has(>div>&,>div>[data-ks-path]>&)>div:has(>[data-job-field=department],>[data-ks-path]>[data-job-field=department])]:[grid-area:department]!",
  "xl:[div:has(>div>&,>div>[data-ks-path]>&)>div:has(>[data-job-field=description],>[data-ks-path]>[data-job-field=description])]:[grid-area:description]!",
  "xl:[div:has(>div>&,>div>[data-ks-path]>&)>div:has(>[data-job-field=content],>[data-ks-path]>[data-job-field=content])]:[grid-area:content]!",
  "xl:[div:has(>div>&,>div>[data-ks-path]>&)>div:has(>[data-job-field=languages],>[data-ks-path]>[data-job-field=languages])]:[grid-area:languages]!",
  "xl:[div:has(>div>&,>div>[data-ks-path]>&)>div:has(>[data-job-field=translations],>[data-ks-path]>[data-job-field=translations])]:[grid-area:translations]!",
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
      id={area === "title" ? "job-language-en" : undefined}
      tabIndex={area === "title" ? -1 : undefined}
      className={cn(
        "min-w-0 scroll-mt-24",
        area === "status" && publishingLayout,
        area === "title" &&
          "[&_button]:h-12! [&_input]:h-12! [&_label]:font-mono! [&_label]:text-xs! [&_label]:leading-body! [&_label]:font-normal! [&_label]:tracking-label! [&_label]:text-text-secondary! [&_label]:uppercase",
        area === "languages" && "h-full [div[data-ks-path]:has(>&)]:h-full",
      )}
    >
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
