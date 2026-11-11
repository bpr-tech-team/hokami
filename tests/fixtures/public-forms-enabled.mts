import { registerHooks } from "node:module";

// Isolate the restoration scenario without changing production configuration.
const availability = new URL(
  "../../src/lib/forms/availability.ts",
  import.meta.url,
);
const enabled = new URL("./public-forms-availability.mjs", import.meta.url);
registerHooks({
  resolve(specifier, context, nextResolve) {
    const result = nextResolve(specifier, context);
    if (result.url.split("?")[0] === availability.href)
      return {
        url: enabled.href,
        format: "module",
        shortCircuit: true,
      };
    return result;
  },
});
