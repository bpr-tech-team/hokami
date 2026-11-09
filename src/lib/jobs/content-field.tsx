import { fields } from "@keystatic/core";
import { JobContentInput } from "@/components/integrations/keystatic/job-content-input";
import { JOB_IMAGE_HELP, validateContentImages } from "./image-validation";
import { assertJobContent } from "./content";
import { jobContentComponents } from "./content-components";
import { prepareJobEditorState } from "./editor-layout";
import { assertJobLayout } from "./content-layout";
import { keystaticUiText } from "@/i18n/keystatic-ui";

export function jobContentField({
  required = false,
}: { required?: boolean } = {}) {
  const field = fields.markdoc.inline({
    label: `${keystaticUiText("Main description")}${required ? " *" : ""}`,
    description: `${keystaticUiText("Detailed description on the job page.")} ${keystaticUiText(required ? "The English description is required." : "An empty translation falls back to the English description.")} ${JOB_IMAGE_HELP}`,
    options: {
      heading: [2, 3, 4],
      image: {
        directory: "public/images/jobs",
        publicPath: "/images/jobs/",
        transformFilename: (filename) =>
          `${crypto.randomUUID()}.${filename.split(".").at(-1)?.toLowerCase() ?? ""}`,
        schema: {
          alt: fields.text({
            label: keystaticUiText("Alternative text"),
            validation: { isRequired: true },
          }),
          title: fields.text({ label: keystaticUiText("Caption") }),
        },
      },
    },
    components: jobContentComponents,
  });

  return {
    ...field,
    Input(props: Parameters<typeof field.Input>[0]) {
      return <JobContentInput {...props} field={field} required={required} />;
    },
    parse(...args: Parameters<typeof field.parse>) {
      return prepareJobEditorState(field.parse(...args), field);
    },
    serialize(
      value: Parameters<typeof field.serialize>[0],
      options: Parameters<typeof field.serialize>[1],
    ) {
      return field.serialize(prepareJobEditorState(value, field), options);
    },
    validate(value: Parameters<typeof field.validate>[0]) {
      const validated = field.validate(prepareJobEditorState(value, field));
      const serialized = field.serialize(validated, { slug: undefined });
      assertJobLayout(String(serialized.value ?? ""));
      if (required) assertJobContent(String(serialized.value ?? ""));
      validateContentImages(serialized);
      return validated;
    },
    reader: {
      parse(value: Parameters<typeof field.reader.parse>[0]) {
        assertJobLayout(typeof value === "string" ? value : "");
        if (required) assertJobContent(typeof value === "string" ? value : "");
        return field.reader.parse(value);
      },
    },
  };
}
