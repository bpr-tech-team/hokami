"use client";

import { keystaticUiText } from "@/i18n/keystatic-ui";

import { useId, useState, type ReactNode } from "react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

type ControlProps = {
  id: string;
  "aria-invalid": boolean;
  "aria-describedby": string | undefined;
  onBlur(): void;
};

export function JobFormField<Value>({
  label,
  description,
  required,
  value,
  validate,
  forceValidation,
  children,
}: {
  label: string;
  description?: string;
  required?: boolean;
  value: Value;
  validate(value: Value): unknown;
  forceValidation: boolean;
  children(props: ControlProps): ReactNode;
}) {
  const id = useId();
  const [blurred, setBlurred] = useState(false);
  let error: string | undefined;
  if (forceValidation || blurred) {
    try {
      validate(value);
    } catch (cause) {
      error =
        cause instanceof Error
          ? cause.message
          : keystaticUiText("Check this value.");
    }
  }
  const describedBy = [description && `${id}-help`, error && `${id}-error`]
    .filter(Boolean)
    .join(" ");
  return (
    <Field data-invalid={!!error} className="min-w-0">
      <FieldLabel htmlFor={id}>
        {label}
        {required && <span aria-hidden="true">*</span>}
      </FieldLabel>
      {children({
        id,
        "aria-invalid": !!error,
        "aria-describedby": describedBy || undefined,
        onBlur: () => setBlurred(true),
      })}
      {description && (
        <FieldDescription id={`${id}-help`} className="m-0">
          {description}
        </FieldDescription>
      )}
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </Field>
  );
}
