import { registerHooks } from "node:module";
import { translateSource } from "../../scripts/keystatic-ui-loader.cjs";
import "./keystatic-ui-require.cjs";

// The Node export intentionally stubs Keystatic's editor. Exercise its actual
// browser implementation without mounting a view, with the same ESM resolution
// used by Next.js. y-provider's published package omits its advertised CJS file.
registerHooks({
  load(url, context, nextLoad) {
    const result = nextLoad(url, context);
    if (
      decodeURIComponent(url).includes("/node_modules/@keystatic/core/dist/") &&
      new URL(url).pathname.endsWith(".js") &&
      result.source != null
    ) {
      return {
        ...result,
        source: translateSource(
          typeof result.source === "string"
            ? result.source
            : new TextDecoder().decode(result.source),
          process.env.KEYSTATIC_TEST_UI_LOCALE ?? "cs",
        ),
      };
    }
    return result;
  },
  resolve(specifier, context, nextResolve) {
    return nextResolve(
      specifier,
      ["@keystatic/core", "y-provider"].includes(specifier)
        ? {
            ...context,
            conditions: [
              "import",
              ...context.conditions.filter(
                (condition) =>
                  !["node", "require", "react-server", "worker"].includes(
                    condition,
                  ),
              ),
            ],
          }
        : context,
    );
  },
});
