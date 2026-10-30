"use client";

import { useTranslations } from "next-intl";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { FieldTrace } from "@/components/ui/field-trace";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  RequesForQuoteErrorKey,
  RequesForQuoteFieldName,
} from "@/lib/reques-for-quote/validation";

type RequesForQuoteFieldProps = {
  name: RequesForQuoteFieldName;
  label: string;
  placeholder?: string;
  required?: boolean;
  error?: RequesForQuoteErrorKey;
  type?: "text" | "email" | "select" | "textarea";
  autoComplete?: string;
  maxLength?: number;
  disabled?: boolean;
  options?: readonly { value: string; label: string }[];
};

export function RequesForQuoteField({
  name,
  label,
  placeholder,
  required,
  error,
  type = "text",
  autoComplete,
  maxLength,
  disabled,
  options,
}: RequesForQuoteFieldProps) {
  const t = useTranslations("RequesForQuote.errors");
  const id = `reques-for-quote-${name}`;
  const props = {
    id,
    name,
    required,
    disabled,
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? `${id}-error` : undefined,
  };
  const selectOptions = [
    { value: null, label: placeholder },
    ...(options ?? []),
  ];

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
        {type === "textarea" ? (
          <Textarea
            {...props}
            placeholder={placeholder}
            maxLength={maxLength}
          />
        ) : type === "select" ? (
          <Select
            name={name}
            required={required}
            disabled={disabled}
            defaultValue={null}
            items={selectOptions}
          >
            <SelectTrigger
              id={id}
              data-field-name={name}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? `${id}-error` : undefined}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {selectOptions.map(({ value, label }) => (
                <SelectItem key={value ?? "placeholder"} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            {...props}
            type={type}
            placeholder={placeholder}
            autoComplete={autoComplete}
            maxLength={maxLength}
          />
        )}
        <FieldTrace />
      </div>
      {error && (
        <FieldError id={`${id}-error`} className="flex items-start gap-2">
          <span
            aria-hidden="true"
            className="mt-0.5 inline-block size-5 shrink-0 bg-[url('/images/reques-for-quote/alert.svg')] bg-contain bg-center bg-no-repeat"
          />
          {t(error)}
        </FieldError>
      )}
    </Field>
  );
}
