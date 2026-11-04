"use client";

import type { ReactNode } from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { FieldTrace } from "@/components/ui/field-trace";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type FormFieldProps = {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
};

export function FormField({
  id,
  label,
  required,
  error,
  children,
}: FormFieldProps) {
  return (
    <Field className="min-w-0" data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={id}>
        {label}
        {required && (
          <span aria-hidden="true" className="text-text-accent">
            *
          </span>
        )}
      </FieldLabel>
      <div className="group/control relative w-full">
        {children}
        <FieldTrace />
      </div>
      {error && (
        <FieldError id={`${id}-error`} className="flex items-start gap-2">
          <span
            aria-hidden="true"
            className="mt-0.5 inline-block size-5 shrink-0 bg-[url('/images/reques-for-quote/alert.svg')] bg-contain bg-center bg-no-repeat"
          />
          {error}
        </FieldError>
      )}
    </Field>
  );
}

type TextFormFieldProps = Omit<FormFieldProps, "children"> & {
  name: string;
  type?: "text" | "email" | "tel" | "textarea";
  placeholder?: string;
  autoComplete?: string;
  maxLength?: number;
  disabled?: boolean;
};

export function TextFormField({
  id,
  name,
  label,
  required,
  error,
  type = "text",
  ...props
}: TextFormFieldProps) {
  const controlProps = {
    ...props,
    id,
    name,
    required,
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? `${id}-error` : undefined,
  };

  return (
    <FormField id={id} label={label} required={required} error={error}>
      {type === "textarea" ? (
        <Textarea {...controlProps} />
      ) : (
        <Input {...controlProps} type={type} />
      )}
    </FormField>
  );
}
