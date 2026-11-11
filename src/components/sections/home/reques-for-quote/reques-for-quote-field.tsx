"use client";

import { useTranslations } from "next-intl";
import { FormField, TextFormField } from "@/components/forms/text-form-field";
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
  autoComplete?: string;
  maxLength?: number;
  disabled?: boolean;
} & (
  | {
      type: "select";
      options: readonly { value: string; label: string }[];
      value: string | null;
      onValueChange: (value: string | null) => void;
    }
  | {
      type?: "text" | "email" | "textarea";
      options?: never;
      value?: never;
      onValueChange?: never;
    }
);

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
  value,
  onValueChange,
}: RequesForQuoteFieldProps) {
  const t = useTranslations("RequesForQuote.errors");
  const id = `reques-for-quote-${name}`;
  const errorText = error ? t(error) : undefined;
  if (type !== "select") {
    return (
      <TextFormField
        id={id}
        name={name}
        label={label}
        required={required}
        error={errorText}
        type={type}
        disabled={disabled}
        placeholder={placeholder}
        autoComplete={autoComplete}
        maxLength={maxLength}
      />
    );
  }
  const selectOptions = [
    { value: null, label: placeholder },
    ...(options ?? []),
  ];

  return (
    <FormField id={id} label={label} required={required} error={errorText}>
      <Select
        name={name}
        required={required}
        disabled={disabled}
        value={value}
        onValueChange={onValueChange}
        autoComplete="off"
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
    </FormField>
  );
}
