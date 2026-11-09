import { fields } from "@keystatic/core";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { JobFormField } from "@/components/integrations/keystatic/job-form-field";

// Keep Keystatic's data contract, readers and validation; replace only controls.
export function jobTextField(options: Parameters<typeof fields.text>[0]) {
  const field = fields.text(options);
  return {
    ...field,
    Input(props: Parameters<typeof field.Input>[0]) {
      const Control = options.multiline ? Textarea : Input;
      return (
        <JobFormField
          {...options}
          required={options.validation?.isRequired}
          value={props.value}
          validate={(value) => field.validate(value, undefined)}
          forceValidation={props.forceValidation}
        >
          {(control) => (
            <Control
              {...control}
              value={props.value}
              autoFocus={props.autoFocus}
              aria-required={options.validation?.isRequired}
              onChange={(event) => props.onChange(event.target.value)}
              className="box-border"
            />
          )}
        </JobFormField>
      );
    },
  };
}

export function jobIntegerField<IsRequired extends boolean | undefined>(
  options: Parameters<typeof fields.integer<IsRequired>>[0],
) {
  const field = fields.integer(options);
  return {
    ...field,
    Input(props: Parameters<typeof field.Input>[0]) {
      return (
        <JobFormField
          {...options}
          required={options.validation?.isRequired}
          value={props.value}
          validate={field.validate}
          forceValidation={props.forceValidation}
        >
          {(control) => (
            <Input
              {...control}
              type="number"
              step={1}
              min={options.validation?.min}
              max={options.validation?.max}
              value={props.value ?? ""}
              autoFocus={props.autoFocus}
              aria-required={options.validation?.isRequired}
              onChange={(event) =>
                props.onChange(
                  event.target.value === "" ? null : Number(event.target.value),
                )
              }
              className="box-border"
            />
          )}
        </JobFormField>
      );
    },
  };
}

export function jobSelectField<
  const Option extends { label: string; value: string },
>(options: Parameters<typeof fields.select<Option>>[0]) {
  const field = fields.select(options);
  return {
    ...field,
    Input(props: Parameters<typeof field.Input>[0]) {
      return (
        <JobFormField
          {...options}
          value={props.value}
          validate={field.validate}
          forceValidation={props.forceValidation}
        >
          {(control) => (
            <NativeSelect
              {...control}
              value={props.value}
              autoFocus={props.autoFocus}
              onChange={(event) => {
                const option = field.options.find(
                  ({ value }) => value === event.target.value,
                );
                if (option) props.onChange(option.value);
              }}
              className="[&_select]:box-border"
            >
              {field.options.map(({ label, value }) => (
                <NativeSelectOption key={value} value={value}>
                  {label}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          )}
        </JobFormField>
      );
    },
  };
}
