import assert from "node:assert/strict";
import { test } from "node:test";
import { jobsCollection } from "../src/lib/jobs/collection";
import { createJobLocaleStore } from "../src/lib/jobs/editor-locales";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Window as TestWindow } from "happy-dom";
import { scrollToJobDescription } from "../src/lib/jobs/editor-navigation";

test("publishing controls lead the schema and obsolete link-label fields are removed", () => {
  assert.deepEqual(Object.keys(jobsCollection.schema).slice(0, 2), [
    "status",
    "order",
  ]);
  assert.ok(!("linkLabel" in jobsCollection.schema));
  for (const field of Object.values(jobsCollection.schema.translations.fields))
    assert.ok(!("linkLabel" in field.fields));
});

test("locale visibility synchronizes subscribers without mutating the original selection", () => {
  const original = ["en", "cs"] as const;
  const store = createJobLocaleStore(original);
  let calls = 0;
  const stop = store.subscribe(() => {
    calls++;
  });
  store.set(["en"]);
  assert.deepEqual(store.getSnapshot(), ["en"]);
  assert.deepEqual(original, ["en", "cs"]);
  store.set(["en"]);
  assert.equal(calls, 1);
  store.set(original);
  assert.deepEqual(store.getSnapshot(), original);
  assert.equal(calls, 2);
  stop();
  store.set([]);
  assert.equal(calls, 2);
});

test("language navigation scrolls smoothly, preserves URL state and respects reduced motion", async () => {
  const view = new TestWindow({
    url: "http://127.0.0.1:3000/keystatic/branch/main/collection/jobs/item/buyer?tag=one&tag=two&source=%2Fjobs",
  });
  const target = view.document.createElement("section");
  target.id = "job-language-de";
  target.tabIndex = -1;
  view.document.body.appendChild(target);
  const calls: unknown[] = [];
  target.scrollIntoView = (options) => {
    calls.push(options);
  };
  const nativeView = view as unknown as Window;
  const search = view.location.search;
  const state = { keystatic: true };
  view.history.replaceState(state, "");
  assert.equal(scrollToJobDescription("de", nativeView), true);
  assert.deepEqual(calls, [{ behavior: "smooth", block: "start" }]);
  assert.equal(view.location.search, search);
  assert.equal(view.location.hash, "#job-language-de");
  assert.deepEqual(view.history.state, state);
  assert.equal(view.document.activeElement, target);
  const historyLength = view.history.length;
  view.happyDOM.settings.device.prefersReducedMotion = "reduce";
  scrollToJobDescription("de", nativeView);
  assert.deepEqual(calls[1], { behavior: "instant", block: "start" });
  assert.equal(view.history.length, historyLength);
  target.hidden = true;
  assert.equal(scrollToJobDescription("de", nativeView), false);
  assert.equal(scrollToJobDescription("cs", nativeView), false);
  assert.equal(calls.length, 2);
  await view.happyDOM.close();
});

test("job fields keep labels and native validation associated with their own controls", async () => {
  const view = new TestWindow();
  view.document.body.innerHTML = renderToStaticMarkup(
    createElement(
      "div",
      null,
      createElement(jobsCollection.schema.department.Input, {
        value: " ",
        onChange: () => {},
        autoFocus: false,
        forceValidation: true,
      }),
      createElement(jobsCollection.schema.description.Input, {
        value: "Description",
        onChange: () => {},
        autoFocus: false,
        forceValidation: true,
      }),
      createElement(jobsCollection.schema.order.Input, {
        value: -1,
        onChange: () => {},
        autoFocus: false,
        forceValidation: true,
      }),
    ),
  );
  const labels = view.document.querySelectorAll('[data-slot="field-label"]');
  assert.equal(labels.length, 3);
  const ids = new Set<string>();
  for (const label of labels) {
    const control = view.document.getElementById(
      label.getAttribute("for") ?? "",
    );
    assert.ok(control);
    assert.equal(
      label.closest('[data-slot="field"]'),
      control.closest('[data-slot="field"]'),
    );
    assert.equal(ids.has(control.id), false);
    ids.add(control.id);
  }
  const invalidControls = view.document.querySelectorAll(
    '[aria-invalid="true"]',
  );
  assert.equal(invalidControls.length, 2);
  for (const control of invalidControls) {
    const error = view.document.getElementById(
      control.getAttribute("aria-describedby")!.split(" ").at(-1)!,
    );
    assert.equal(error?.getAttribute("role"), "alert");
    assert.ok(error?.textContent);
  }
  assert.equal(view.document.querySelector("textarea")?.value, "Description");
  await view.happyDOM.close();
});
