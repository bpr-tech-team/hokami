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
  getVideoRevealPosition,
} from "../src/components/sections/video/video-reveal";

const desktop = {
  top: 812,
  width: 1360,
  height: 788,
  viewportHeight: 900,
  viewportWidth: 1440,
  bottomGap: 40,
  compact: false,
};

test("desktop preview starts 40 px above the viewport bottom without changing the hero", () => {
  const geometry = getVideoRevealGeometry(desktop);
  const position = getVideoRevealPosition(geometry, 0);
  assert.equal(geometry.previewWidth, 320);
  assert.equal(geometry.previewHeight, 180);
  assert.equal(
    desktop.top + desktop.height + position.translateY - geometry.previewHeight,
    680,
  );
  assert.equal(position.progress, 0);
});

test("the expanded frame reaches the header then scrolls away in normal flow", () => {
  const geometry = getVideoRevealGeometry(desktop);
  const expanded = getVideoRevealPosition(geometry, geometry.end);
  assert.equal(expanded.progress, 1);
  assert.equal(expanded.translateY, 0);
  assert.equal(desktop.top - geometry.end, 72);
  const after = getVideoRevealPosition(geometry, geometry.end + 200);
  assert.equal(after.translateY, 0);
  assert.equal(after.progress, 1);
  assert.equal(desktop.top - (geometry.end + 200), -128);
});

test("mobile preview keeps 16:9 and unfolds into its own tall slot", () => {
  const geometry = getVideoRevealGeometry({
    top: 553,
    width: 350,
    height: 760,
    viewportHeight: 844,
    viewportWidth: 390,
    bottomGap: 20,
    compact: true,
  });
  assert.equal(geometry.previewWidth, 312);
  assert.equal(geometry.previewHeight, 175.5);
  const initial = getVideoRevealPosition(geometry, 0);
  assert.equal(553 + 760 + initial.translateY - geometry.previewHeight, 648.5);
  assert.equal(553 - geometry.end, 64);
  assert.match(geometry.mediaEnd, /scale\(3\.860/);
});

test("a reused section further down the page stays below the viewport until approached", () => {
  const geometry = getVideoRevealGeometry({ ...desktop, top: 3000 });
  const initial = getVideoRevealPosition(geometry, 0);
  assert.ok(
    3000 + desktop.height + initial.translateY - geometry.previewHeight >
      desktop.viewportHeight,
  );
  assert.equal(getVideoRevealPosition(geometry, geometry.start).progress, 0);
});

test("progress reverses with scrolling and clamps at the bounds", () => {
  const geometry = getVideoRevealGeometry(desktop);
  const halfway = getVideoRevealPosition(geometry, geometry.end / 2);
  assert.equal(halfway.progress, 0.5);
  assert.equal(getVideoRevealPosition(geometry, -30).progress, 0);
  assert.deepEqual(getVideoRevealPosition(geometry, 0), {
    progress: 0,
    translateY: -740,
  });
  assert.equal(getVideoRevealPosition(geometry, 10000).progress, 1);
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
