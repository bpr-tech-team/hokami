import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createTranslator } from "next-intl";
import { VideoSection } from "../src/components/sections/video/video-section";
import cs from "../messages/cs.json";
import en from "../messages/en.json";
import de from "../messages/de.json";
import fi from "../messages/fi.json";
import pl from "../messages/pl.json";
import {
  getVideoRevealGeometry,
  getVideoRevealProgress,
  hasVideoRevealLayoutChanged,
} from "../src/components/sections/video/video-reveal";

const desktop = {
  top: 640,
  width: 1360,
  height: 765,
  viewportHeight: 900,
  viewportWidth: 1440,
  bottomGap: 40,
  topOffset: 72,
  compact: false,
  previewInset: 80,
};

test("moving mobile browser toolbars does not rebuild an unchanged video stage", () => {
  const initial = {
    top: 553,
    width: 350,
    height: 196.875,
    viewportHeight: 844,
    viewportWidth: 390,
    bottomGap: 20,
    topOffset: 64,
    compact: true,
    reducedMotion: false,
  };
  assert.equal(hasVideoRevealLayoutChanged(undefined, initial), true);
  for (const viewportHeight of [800, 844, 900, 928, 844]) {
    assert.equal(
      hasVideoRevealLayoutChanged(initial, { ...initial, viewportHeight }),
      false,
    );
  }
});

test("video layout still refreshes for real resizing, content and motion changes", () => {
  const initial = { ...desktop, reducedMotion: false };
  for (const change of [
    { width: 1280 },
    { height: 688, viewportHeight: 800 },
    { viewportWidth: 1360 },
    { width: 824, height: 306, viewportWidth: 844, viewportHeight: 390 },
    { top: 900 },
    { bottomGap: 20 },
    { topOffset: 64 },
    { compact: true },
    { previewInset: 40 },
    { reducedMotion: true },
  ]) {
    assert.equal(
      hasVideoRevealLayoutChanged(initial, { ...initial, ...change }),
      true,
    );
  }
});

test("desktop preview occupies its own slot below the hero actions and aligns with the text", () => {
  const geometry = getVideoRevealGeometry(desktop);
  assert.equal(geometry.previewWidth, 320);
  assert.equal(geometry.previewHeight, 180);
  assert.equal(geometry.previewInset, 80);
  assert.equal(geometry.clip, "inset(0px 960px 585px 80px)");
  assert.equal(
    geometry.mediaStart,
    "translate(80px, 0px) scale(0.23529411764705882)",
  );
  assert.equal(getVideoRevealProgress(geometry, 0), 0);
});

test("the expanded frame reaches the header then scrolls away in normal flow", () => {
  const geometry = getVideoRevealGeometry(desktop);
  assert.equal(getVideoRevealProgress(geometry, geometry.end), 1);
  assert.equal(desktop.top - geometry.end, 72);
  assert.equal(getVideoRevealProgress(geometry, geometry.end + 200), 1);
  assert.equal(desktop.top - (geometry.end + 200), -128);
});

test("mobile preview stays below the actions and unfolds into a 16:9 hero slot", () => {
  const geometry = getVideoRevealGeometry({
    top: 553,
    width: 350,
    height: 196.875,
    viewportHeight: 844,
    viewportWidth: 390,
    bottomGap: 20,
    topOffset: 64,
    compact: true,
  });
  assert.equal(geometry.previewWidth, 312);
  assert.equal(geometry.previewHeight, 175.5);
  assert.equal(geometry.previewInset, 0);
  assert.equal(geometry.clip, "inset(0px 38px 21.375px 0px)");
  assert.equal(getVideoRevealProgress(geometry, 0), 0);
  assert.equal(553 - geometry.end, 64);
  assert.equal(geometry.mediaEnd, "translate(0px, 0px) scale(1)");
});

test("a reused section further down the page stays below the viewport until approached", () => {
  const geometry = getVideoRevealGeometry({ ...desktop, top: 3000 });
  assert.equal(getVideoRevealProgress(geometry, 0), 0);
  assert.equal(geometry.start, 2320);
  assert.equal(3000 - geometry.start + geometry.previewHeight, 860);
  assert.equal(getVideoRevealProgress(geometry, geometry.start), 0);
});

test("progress reverses with scrolling and clamps at the bounds", () => {
  const geometry = getVideoRevealGeometry(desktop);
  const halfway = (geometry.start + geometry.end) / 2;
  assert.equal(getVideoRevealProgress(geometry, halfway), 0.5);
  assert.equal(getVideoRevealProgress(geometry, -30), 0);
  assert.equal(getVideoRevealProgress(geometry, 0), 0);
  assert.equal(getVideoRevealProgress(geometry, 10000), 1);
});

test("all locales have accessible video controls and no initial video downloads in server HTML", () => {
  const catalogs = { cs, en, de, fi, pl };
  for (const locale of Object.keys(catalogs) as (keyof typeof catalogs)[]) {
    const messages = catalogs[locale];
    const t = createTranslator({
      locale,
      messages,
      namespace: "Video",
      onError(error) {
        throw error;
      },
    });
    const html = renderToStaticMarkup(
      createElement(VideoSection, {
        id: `video-${locale}`,
        src: "/full.mp4",
        mobileSrc: "/mobile.mp4",
        previewSrc: "/preview.mp4",
        poster: "/poster.webp",
        labels: {
          title: t("title"),
          caption: t("caption", { duration: "0:41" }),
          play: t("play"),
          pausePreview: t("pausePreview"),
          resumePreview: t("resumePreview"),
          close: t("close"),
          error: t("error"),
          openFile: t("openFile"),
        },
      }),
    );
    assert.ok(html.includes(`aria-label="${t("title")}"`));
    assert.ok(html.includes(t("play")));
    assert.ok(html.includes("0:41"));
    assert.match(html, /<noscript>.*href="\/full.mp4"/);
    assert.doesNotMatch(html, /src="[^\"]*\.mp4"/);
    assert.doesNotMatch(html, /autoPlay|autoplay/);
  }
});
