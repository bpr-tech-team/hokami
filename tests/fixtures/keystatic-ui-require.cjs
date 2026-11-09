/* eslint-disable @typescript-eslint/no-require-imports */
const Module = require("node:module");
const { translateSource } = require("../../scripts/keystatic-ui-loader.cjs");

// tsx compiles the app's TSX imports through its CommonJS extension handler,
// bypassing Node's ESM load hook. Apply the production transform at that seam
// too, keeping one copy of React, ProseMirror and Keystatic in this fixture.
const loadJavaScript = Module._extensions[".js"];
Module._extensions[".js"] = function (module, filename) {
  if (!filename.includes("/node_modules/@keystatic/core/dist/")) {
    return loadJavaScript.call(this, module, filename);
  }
  const compile = module._compile;
  module._compile = function (source, file) {
    return compile.call(
      this,
      translateSource(source, process.env.KEYSTATIC_TEST_UI_LOCALE ?? "cs"),
      file,
    );
  };
  try {
    return loadJavaScript.call(this, module, filename);
  } finally {
    module._compile = compile;
  }
};
