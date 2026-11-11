/** Select state takes precedence over browser-restored or autofilled DOM values. */
export function readFormValues(
  data: FormData,
  selectValues: Readonly<Record<string, string>>,
) {
  return { ...Object.fromEntries(data), ...selectValues };
}
