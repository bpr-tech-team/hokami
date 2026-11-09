import { config } from "@keystatic/core";
import { KeystaticBrandMark } from "./src/components/integrations/keystatic/brand-mark";
import { jobsCollection } from "./src/lib/jobs/collection";
import {
  getKeystaticUiLocale,
  keystaticUiLocales,
  keystaticUiText,
} from "./src/i18n/keystatic-ui";

const cloudProject = process.env.NEXT_PUBLIC_KEYSTATIC_CLOUD_PROJECT?.trim();

export const isLocalKeystatic =
  process.env.NODE_ENV === "development" &&
  process.env.NEXT_PUBLIC_KEYSTATIC_LOCAL_MODE === "true";

const common = {
  locale: keystaticUiLocales[getKeystaticUiLocale()],
  ui: {
    brand: {
      name: keystaticUiText("Administration"),
      mark: KeystaticBrandMark,
    },
    navigation: ["jobs" as const],
  },
  collections: { jobs: jobsCollection },
};

// An unconfigured deployment must never expose the local filesystem writer.
const keystaticConfig = isLocalKeystatic
  ? config({ ...common, storage: { kind: "local" } })
  : cloudProject
    ? config({
        ...common,
        storage: { kind: "cloud" },
        cloud: { project: cloudProject },
      })
    : null;

export default keystaticConfig;
