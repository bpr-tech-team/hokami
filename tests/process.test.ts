import assert from "node:assert/strict";
import { before, test } from "node:test";
import { registerHooks } from "node:module";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createTranslator } from "next-intl";
import {
  getProcessScrollProgress,
  getProcessScrollRange,
  getProcessScrollState,
} from "../src/components/sections/process/process-scroll-timeline";
import {
  getProcessNode,
  getProcessTimeline,
} from "../src/components/sections/process/process-timeline";
import cs from "../messages/cs.json";
import en from "../messages/en.json";
import de from "../messages/de.json";
import fi from "../messages/fi.json";
import pl from "../messages/pl.json";

let ProcessSection: typeof import("../src/components/sections/process/process-section").ProcessSection;

before(async () => {
  // Server markup checks do not execute the browser's CSS timeline.
  const css = registerHooks({
    load(url, context, nextLoad) {
      return url.endsWith("/process-scroll.css")
        ? {
            format: "module",
            source: "",
            shortCircuit: true,
          }
        : nextLoad(url, context);
    },
  });
  try {
    ({ ProcessSection } =
      await import("../src/components/sections/process/process-section"));
  } finally {
    css.deregister();
  }
});

const stepIds = [
  "documentation",
  "assessment",
  "prototype",
  "production",
] as const;

function getContent(locale: keyof typeof catalogs = "cs") {
  const t = createTranslator({
    locale,
    messages: catalogs[locale],
    namespace: "Process",
    onError(error) {
      throw error;
    },
  });
  return {
    id: "process",
    eyebrow: t("eyebrow"),
    title: t("title"),
    steps: stepIds.map((id, index) => ({
      id,
      label: t("step", { number: String(index + 1).padStart(2, "0") }),
      title: t(`steps.${id}.title`),
      description: t(`steps.${id}.description`),
    })),
  };
}

const catalogs = { cs, en, de, fi, pl };

test("every step has four seconds and the animation finishes on the last step", () => {
  for (let count = 2; count <= 6; count++) {
    const timeline = getProcessTimeline(count);
    assert.equal(timeline.duration, count * 4000);
    assert.equal(timeline.steps.length, count);
    assert.equal(timeline.nodes.length, count);
    assert.equal(timeline.orbit[0].transform, "rotate(0deg)");
    assert.equal(timeline.orbit.at(-1)?.transform, "rotate(360deg)");
    assert.equal(timeline.progress[0]["--process-angle"], "0deg");
    assert.equal(timeline.progress.at(-1)?.["--process-angle"], "360deg");
    timeline.progress.forEach((frame, index) => {
      assert.equal(
        timeline.orbit[index].transform,
        `rotate(${frame["--process-angle"]})`,
      );
      assert.equal(frame.offset, timeline.orbit[index].offset);
      assert.equal(frame.easing, timeline.orbit[index].easing);
    });

    for (const frames of [
      timeline.orbit,
      timeline.progress,
      ...timeline.steps,
      ...timeline.nodes,
    ]) {
      assert.equal(frames[0].offset, 0);
      assert.equal(frames.at(-1)?.offset, 1);
      frames.forEach((frame, index) => {
        assert.ok(Number.isFinite(frame.offset));
        assert.ok(frame.offset! >= 0 && frame.offset! <= 1);
        if (index) assert.ok(frame.offset! >= frames[index - 1].offset!);
      });
    }

    timeline.steps.forEach((frames, index) => {
      assert.equal(frames.at(-1)?.opacity, index === count - 1 ? 1 : 0);
    });
    timeline.nodes.forEach((frames) => {
      assert.equal(frames.at(-1)?.opacity, 1);
    });

    // A second into each step, exactly its text is fully visible.
    for (let active = 0; active < count; active++) {
      const offset = (active * 4000 + 1000) / timeline.duration;
      timeline.steps.forEach((frames, index) => {
        const before = frames.findLast((frame) => frame.offset! <= offset)!;
        const after = frames.find((frame) => frame.offset! > offset)!;
        assert.equal(before.opacity, index === active ? 1 : 0);
        assert.equal(after.opacity, index === active ? 1 : 0);
      });
    }
  }
});

test("nodes stay on the same circle, start at twelve o'clock and advance clockwise", () => {
  for (const count of [2, 3, 4, 5, 6]) {
    for (let index = 0; index < count; index++) {
      const node = getProcessNode(index, count);
      assert.ok(
        Math.abs(Math.hypot(node.x - 310, node.y - 310) - 268.667) < 0.0001,
      );
    }
    const top = getProcessNode(0, count);
    assert.equal(top.x, 310);
    assert.ok(Math.abs(top.y - 41.333) < 0.0001);
  }
  assert.ok(getProcessNode(1, 4).x > 578);
  assert.ok(getProcessNode(2, 4).y > 578);
  assert.ok(getProcessNode(3, 4).x < 42);
});

test("all five locales render every step in the server HTML without requiring JavaScript", () => {
  for (const locale of Object.keys(catalogs) as (keyof typeof catalogs)[]) {
    const props = getContent(locale);
    const markup = renderToStaticMarkup(createElement(ProcessSection, props));
    assert.match(
      markup,
      /<section[^>]*id="process"[^>]*aria-labelledby="process-heading"/,
    );
    assert.equal((markup.match(/<li>/g) ?? []).length, 4);
    assert.equal((markup.match(/<ol /g) ?? []).length, 1);
    assert.ok(!markup.includes('data-enhanced="true"'));
    for (const step of props.steps) {
      assert.ok(step.title.length > 0);
      assert.ok(step.description.length > 0);
      assert.ok(markup.includes(step.description));
      assert.ok(step.label.includes("0"));
      assert.ok(!step.title.startsWith("Process."));
    }
  }
});

test("empty, single-step and multiple independent process sections render safely", () => {
  const props = getContent();
  assert.equal(
    renderToStaticMarkup(
      createElement(ProcessSection, { ...props, steps: [] }),
    ),
    "",
  );
  const single = renderToStaticMarkup(
    createElement(ProcessSection, { ...props, steps: props.steps.slice(0, 1) }),
  );
  assert.equal((single.match(/data-process-node=/g) ?? []).length, 1);
  assert.ok(!single.includes('data-slot="button"'));

  const markup = renderToStaticMarkup(
    createElement(
      "div",
      null,
      createElement(ProcessSection, {
        ...props,
        id: "first",
        steps: props.steps.slice(0, 3),
      }),
      createElement(ProcessSection, {
        ...props,
        id: "second",
        steps: [...props.steps, { ...props.steps[0], id: "fifth" }],
      }),
    ),
  );
  const ids = Array.from(
    markup.matchAll(/\sid="([^"]+)"/g),
    (match) => match[1],
  );
  assert.equal(new Set(ids).size, ids.length);
  assert.equal((markup.match(/data-process-node=/g) ?? []).length, 8);
});

test("scroll progress is local to the track and clamps outside its sticky interval", () => {
  assert.equal(getProcessScrollProgress(500, 1000, 1200), 0);
  assert.equal(getProcessScrollProgress(1000, 1000, 1200), 0);
  assert.equal(getProcessScrollProgress(1300, 1000, 1200), 0.25);
  assert.equal(getProcessScrollProgress(1600, 1000, 1200), 0.5);
  assert.equal(getProcessScrollProgress(2200, 1000, 1200), 1);
  assert.equal(getProcessScrollProgress(3000, 1000, 1200), 1);
  assert.equal(getProcessScrollProgress(3000, 1000, 0), 0);
});

test("scroll boundaries synchronize the text, orbit, progress and cumulative nodes", () => {
  for (let count = 2; count <= 6; count++) {
    for (let index = 0; index < count; index++) {
      const state = getProcessScrollState(index / count, count);
      assert.equal(state.active, index);
      assert.equal(state.angle, (360 * index) / count);
      assert.deepEqual(
        state.nodes,
        Array.from({ length: count }, (_, node) => (node <= index ? 1 : 0)),
      );
      state.steps.forEach((step, stepIndex) => {
        assert.ok(
          Math.abs(step.enter * step.exit - (stepIndex === index ? 1 : 0)) <
            0.000001,
        );
      });
    }
    const end = getProcessScrollState(1, count);
    assert.equal(end.angle, 360);
    assert.equal(end.active, count - 1);
    assert.ok(end.nodes.every((opacity) => opacity === 1));
    assert.equal(end.steps.at(-1)?.enter, 1);
    assert.equal(end.steps.at(-1)?.exit, 1);
  }
});

test("scroll text crossfades only adjacent steps", () => {
  for (let count = 2; count <= 6; count++) {
    for (let index = 1; index < count; index++) {
      const range = getProcessScrollRange(index, count);
      const middle = (range.enterStart + range.enterEnd) / 2;
      const state = getProcessScrollState(middle, count);
      const opacities = state.steps.map((step) => step.enter * step.exit);
      assert.ok(Math.abs(opacities[index - 1] - 0.5) < 0.000001);
      assert.ok(Math.abs(opacities[index] - 0.5) < 0.000001);
      assert.equal(opacities.filter((opacity) => opacity > 0).length, 2);
    }
  }
});

test("reduced motion switches complete steps without continuous movement or text offsets", () => {
  for (const position of [0, 0.1, 0.235, 0.25, 0.49, 0.5, 0.75, 0.99, 1]) {
    const state = getProcessScrollState(position, 4, true);
    assert.equal(state.angle, Math.floor(position * 4) * 90);
    state.steps.forEach((step, index) => {
      assert.equal(step.enter, index === state.active ? 1 : 0);
      assert.equal(step.exit, 1);
      assert.equal(step.enterY, 0);
      assert.equal(step.exitY, 0);
    });
  }
});

test("scroll sections render all translations inside the ring with a native no-JS step choice", () => {
  for (const locale of Object.keys(catalogs) as (keyof typeof catalogs)[]) {
    const props = getContent(locale);
    const markup = renderToStaticMarkup(
      createElement(ProcessSection, { ...props, motion: "scroll" }),
    );
    assert.ok(markup.includes('data-slot="process-scroll"'));
    assert.ok(markup.includes('aria-labelledby="process-heading"'));
    assert.equal((markup.match(/type="radio"/g) ?? []).length, 4);
    assert.equal((markup.match(/data-process-scroll-step=/g) ?? []).length, 4);
    assert.ok(!markup.includes("<ol"));
    assert.ok(!markup.includes("<li>"));
    assert.ok(!markup.includes('data-enhanced="true"'));
    for (const step of props.steps) {
      assert.ok(markup.includes(step.description));
    }
  }
});

test("scroll and time sections have independent IDs, including their native radio groups", () => {
  const props = getContent();
  const markup = renderToStaticMarkup(
    createElement(
      "div",
      null,
      createElement(ProcessSection, {
        ...props,
        id: "process-scroll",
        motion: "scroll",
      }),
      createElement(ProcessSection, props),
      createElement(ProcessSection, {
        ...props,
        id: "another-scroll",
        motion: "scroll",
      }),
    ),
  );
  const ids = Array.from(
    markup.matchAll(/\sid="([^"]+)"/g),
    (match) => match[1],
  );
  assert.equal(new Set(ids).size, ids.length);
  const radioGroups = Array.from(
    markup.matchAll(/<input[^>]*type="radio"[^>]*>/g),
    (match) => match[0].match(/\sname="([^"]+)"/)?.[1],
  );
  assert.equal(new Set(radioGroups).size, 2);

  const single = renderToStaticMarkup(
    createElement(ProcessSection, {
      ...props,
      motion: "scroll",
      steps: props.steps.slice(0, 1),
    }),
  );
  assert.ok(single.includes('data-static="true"'));
  assert.ok(!single.includes("<label"));
  assert.equal(
    renderToStaticMarkup(
      createElement(ProcessSection, { ...props, motion: "scroll", steps: [] }),
    ),
    "",
  );
});
