import assert from "node:assert/strict";
import { test } from "node:test";
import { resolveGoogleMeasurementConfig } from "../src/lib/analytics/google-tag-manager";

const config = {
  containerId: "GTM-TEST123",
  measurementId: "G-TEST456",
};

test("Google measurement requires both valid environment IDs and a production hostname", (t) => {
  const keys = ["NEXT_PUBLIC_GTM_ID", "NEXT_PUBLIC_GA4_ID"] as const;
  const previous = keys.map((key) => [key, process.env[key]] as const);
  t.after(() => {
    for (const [key, value] of previous) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });
  for (const key of keys) delete process.env[key];
  assert.equal(resolveGoogleMeasurementConfig("hokami.cz"), undefined);
  process.env.NEXT_PUBLIC_GTM_ID = config.containerId;
  assert.equal(resolveGoogleMeasurementConfig("hokami.cz"), undefined);
  process.env.NEXT_PUBLIC_GA4_ID = config.measurementId;
  assert.deepEqual(resolveGoogleMeasurementConfig("hokami.cz"), config);
  for (const host of ["hokami.cz", "www.hokami.cz"])
    assert.deepEqual(
      resolveGoogleMeasurementConfig(
        host,
        config.containerId,
        config.measurementId,
      ),
      config,
    );
  for (const host of [
    "localhost",
    "127.0.0.1",
    "hokami-preview.vercel.app",
    "evilhokami.cz",
  ])
    assert.equal(
      resolveGoogleMeasurementConfig(
        host,
        config.containerId,
        config.measurementId,
      ),
      undefined,
    );
  for (const id of ["", "G-TEST456", "GTM-<script>"])
    assert.equal(
      resolveGoogleMeasurementConfig("hokami.cz", id, config.measurementId),
      undefined,
    );
  for (const id of ["", "GTM-TEST123", "G-<script>"])
    assert.equal(
      resolveGoogleMeasurementConfig("hokami.cz", config.containerId, id),
      undefined,
    );
});
