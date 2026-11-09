import { fields } from "@keystatic/core";
import { block, repeating, wrapper } from "@keystatic/core/content-components";
import {
  AppWindow,
  ImageIcon,
  ListChecks,
  Columns2,
  Quote,
  Minus,
} from "lucide-react";
import { FactList } from "@/components/sections/fact-list/fact-list";
import { JobSectionInput } from "@/components/integrations/keystatic/job-section-input";
import { JobPhotoPreview } from "@/components/integrations/keystatic/job-photo-preview";
import { JobEmbedPreview } from "@/components/integrations/keystatic/job-embed-preview";
import { jobEmbedSource } from "./embed";
import { keystaticUiText } from "@/i18n/keystatic-ui";

const embedSourceField = fields.text({
  label: keystaticUiText("URL or iframe code"),
  multiline: true,
  validation: { isRequired: true, length: { max: 8000 } },
});

export const jobContentComponents = {
  JobEmbed: block({
    label: keystaticUiText("Embedded content"),
    icon: <AppWindow />,
    schema: {
      src: {
        ...embedSourceField,
        validate(value: string) {
          embedSourceField.validate(value, undefined);
          jobEmbedSource(value);
          return value;
        },
      },
      title: fields.text({
        label: keystaticUiText("Embedded content title"),
        defaultValue: "Vložený obsah",
        validation: { isRequired: true, length: { max: 200 } },
      }),
    },
    ContentView: JobEmbedPreview,
  }),
  JobDivider: block({
    label: keystaticUiText("Divider"),
    icon: <Minus />,
    schema: {},
  }),
  JobQuote: wrapper({
    label: keystaticUiText("Quote"),
    icon: <Quote />,
    schema: {},
  }),
  JobSection: repeating({
    label: keystaticUiText("One column"),
    description: keystaticUiText(
      "One or two independently editable content areas.",
    ),
    icon: <Columns2 />,
    schema: {
      id: fields.text({ label: keystaticUiText("Section identifier") }),
      tone: fields.select({
        label: keystaticUiText("Background"),
        options: [
          { label: keystaticUiText("White"), value: "default" },
          { label: keystaticUiText("Subtle"), value: "subtle" },
        ],
        defaultValue: "default",
      }),
    },
    children: "JobColumn",
    validation: { children: { min: 1, max: 2 } },
    NodeView: JobSectionInput,
  }),
  JobTwoColumns: block({
    label: keystaticUiText("Two columns"),
    icon: <Columns2 />,
    schema: {},
  }),
  JobDuties: block({
    label: keystaticUiText("Duties and photo"),
    icon: <ImageIcon />,
    schema: {},
  }),
  JobRequirements: block({
    label: keystaticUiText("Requirements and offer"),
    icon: <ListChecks />,
    schema: {},
  }),
  JobColumn: wrapper({
    label: keystaticUiText("Column"),
    forSpecificLocations: true,
    schema: {},
    NodeView: ({ children }) => (
      <div data-job-column className="min-w-0">
        {children}
      </div>
    ),
  }),
  JobChecklist: wrapper({
    label: keystaticUiText("Checklist"),
    description: keystaticUiText(
      "A checklist with separators. Write directly in each item.",
    ),
    icon: <ListChecks />,
    schema: {},
    ContentView: ({ children }) => <FactList>{children}</FactList>,
  }),
  JobPhoto: block({
    label: keystaticUiText("Image"),
    icon: <ImageIcon />,
    schema: {
      src: fields.image({
        label: keystaticUiText("Photograph"),
        directory: "public/images/jobs",
        publicPath: "/images/jobs/",
        transformFilename: (name) =>
          `${crypto.randomUUID()}.${name.split(".").at(-1)?.toLowerCase() ?? ""}`,
        validation: { isRequired: true },
      }),
      alt: fields.text({
        label: keystaticUiText("Alternative text"),
        validation: { isRequired: true },
      }),
    },
    ContentView: JobPhotoPreview,
  }),
};
