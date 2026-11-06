import { fields } from "@keystatic/core";
import { JobContentInput } from "@/components/integrations/keystatic/job-content-input";
import { JOB_IMAGE_HELP, validateContentImages } from "./image-validation";

export function jobContentField() {
  const field = fields.markdoc.inline({
    label: "Hlavní text",
    description: `Podrobný popis pro budoucí stránku pozice. Zatím se na webu nezobrazuje. ${JOB_IMAGE_HELP}`,
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
      return <JobContentInput {...props} field={field} />;
    },
    validate(value: Parameters<typeof field.validate>[0]) {
      const validated = field.validate(value);
      validateContentImages(field.serialize(validated, { slug: undefined }));
      return validated;
    },
  };
}
