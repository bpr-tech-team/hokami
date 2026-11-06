import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { checkJobImages } from "../src/lib/jobs/check-images";
import {
  JOB_IMAGE_MAX_BYTES,
  validateContentImages,
  validateJobImage,
} from "../src/lib/jobs/image-validation";

const png = Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10]);
const jpeg = Uint8Array.from([255, 216, 255, 224]);
const webp = new TextEncoder().encode("RIFF0000WEBP");

test("job images accept PNG, JPG, JPEG and WEBP with matching signatures", () => {
  for (const [filename, data] of [
    ["image.png", png],
    ["image.JPG", jpeg],
    ["image.jpeg", jpeg],
    ["image.webp", webp],
  ] as const) {
    assert.doesNotThrow(() => validateJobImage(filename, data));
  }
});

test("the image limit is exactly 0.5 MB and rejects empty files", () => {
  const atLimit = new Uint8Array(JOB_IMAGE_MAX_BYTES);
  atLimit.set(png);
  assert.doesNotThrow(() => validateJobImage("image.png", atLimit));
  const overLimit = new Uint8Array(JOB_IMAGE_MAX_BYTES + 1);
  overLimit.set(png);
  assert.throws(() => validateJobImage("image.png", overLimit), /0,5 MB/);
  assert.throws(
    () => validateJobImage("image.png", new Uint8Array()),
    /0,5 MB/,
  );
});

test("disallowed formats and renamed files cannot pass image validation", () => {
  for (const filename of [
    "image.svg",
    "image.gif",
    "image.avif",
    "image.pdf",
  ]) {
    assert.throws(() => validateJobImage(filename, png), /formáty/);
  }
  assert.throws(() => validateJobImage("image.webp", png), /neodpovídá/);
  assert.throws(() => validateJobImage("image.jpg", png), /neodpovídá/);
  assert.throws(
    () =>
      validateJobImage("image.png", new TextEncoder().encode("not an image")),
    /neodpovídá/,
  );
});

test("WYSIWYG asset validation checks every image before committing changes", () => {
  assert.throws(
    () =>
      validateContentImages({
        other: new Map(),
        external: new Map([
          [
            "public/images/jobs",
            new Map([
              ["valid.png", png],
              ["invalid.svg", png],
            ]),
          ],
        ]),
      }),
    /invalid.svg/,
  );
});

test("build validation also rejects invalid files added directly to the repo", async () => {
  const directory = await mkdtemp(join(tmpdir(), "hokami-job-images-"));
  try {
    await writeFile(join(directory, "valid.png"), png);
    assert.equal(await checkJobImages(directory), 1);
    await writeFile(join(directory, "invalid.gif"), png);
    await assert.rejects(checkJobImages(directory), /invalid.gif/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
