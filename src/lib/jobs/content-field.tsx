import { fields } from "@keystatic/core";
import { JobContentInput } from "@/components/integrations/keystatic/job-content-input";
import { JOB_IMAGE_HELP, validateContentImages } from "./image-validation";
import { assertJobContent } from "./content";

export function jobContentField({ required = false } = {}) {
  const field = fields.markdoc.inline({
    label: required ? "Hlavní text (anglicky) *" : "Hlavní text",
    description: `Podrobný popis na stránce pozice. ${required ? "Anglický text je povinný." : "Prázdný překlad se nahradí anglickým textem."} ${JOB_IMAGE_HELP}`,
    options: {
      heading: [2, 3, 4],
      image: {
        directory: "public/images/jobs",
        publicPath: "/images/jobs/",
        transformFilename: (filename) =>
          `${crypto.randomUUID()}.${filename.split(".").at(-1)?.toLowerCase() ?? ""}`,
        schema: {
          alt: fields.text({
            label: "Alternativní text",
            validation: { isRequired: true },
          }),
          title: fields.text({ label: "Popisek" }),
        },
      },
    },
  });

  return {
    ...field,
    Input(props: Parameters<typeof field.Input>[0]) {
      return <JobContentInput {...props} field={field} required={required} />;
    },
    validate(value: Parameters<typeof field.validate>[0]) {
      const validated = field.validate(value);
      const serialized = field.serialize(validated, { slug: undefined });
      if (required) assertJobContent(String(serialized.value ?? ""));
      validateContentImages(serialized);
      return validated;
    },
    reader: {
      parse(value: Parameters<typeof field.reader.parse>[0]) {
        if (required) assertJobContent(typeof value === "string" ? value : "");
        return field.reader.parse(value);
      },
    },
  };
}
