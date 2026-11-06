import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { test } from "node:test";
import { unstable_doesMiddlewareMatch } from "next/experimental/testing/server";
import { config as proxyConfig } from "../src/proxy";

test("Keystatic bypasses locale routing without excluding unrelated paths", () => {
  const matches = (pathname: string) =>
    unstable_doesMiddlewareMatch({
      config: proxyConfig,
      url: `https://hokami.cz${pathname}`,
    });
  for (const pathname of [
    "/keystatic",
    "/keystatic/branch/main",
    "/api/keystatic/tree",
  ]) {
    assert.equal(matches(pathname), false, pathname);
  }
  for (const pathname of [
    "/jobs",
    "/cs/jobs",
    "/en/jobs",
    "/keystatic-other",
  ]) {
    assert.equal(matches(pathname), true, pathname);
  }
});

test("a production deployment never enables the local content writer", () => {
  const result = execFileSync(
    process.execPath,
    [
      "--import",
      "tsx",
      "-e",
      "const c = require('./keystatic.config.ts'); console.log(JSON.stringify({config: c.default, local: c.isLocalKeystatic}));",
    ],
    {
      encoding: "utf8",
      env: {
        ...process.env,
        NODE_ENV: "production",
        NEXT_PUBLIC_KEYSTATIC_LOCAL_MODE: "true",
        NEXT_PUBLIC_KEYSTATIC_CLOUD_PROJECT: "",
      },
    },
  );
  assert.deepEqual(JSON.parse(result), { config: null, local: false });
});
