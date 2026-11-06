export const JOB_IMAGE_MAX_BYTES = 500_000;
export const JOB_IMAGE_HELP =
  "PNG, JPG, JPEG nebo WEBP; nejvýše 0,5 MB na obrázek.";

const extensions = new Set(["png", "jpg", "jpeg", "webp"]);

export class JobImageError extends Error {
  constructor(
    filename: string,
    public readonly reason: string,
  ) {
    super(`${filename}: ${reason}`);
  }
}

export function validateJobImage(filename: string, data: Uint8Array) {
  const extension = filename.split(".").at(-1)?.toLowerCase() ?? "";
  if (!extensions.has(extension)) {
    throw new JobImageError(
      filename,
      "Povolené formáty jsou PNG, JPG, JPEG a WEBP.",
    );
  }
  if (data.byteLength === 0 || data.byteLength > JOB_IMAGE_MAX_BYTES) {
    throw new JobImageError(
      filename,
      "Obrázek musí mít velikost od 1 B do 0,5 MB.",
    );
  }

  const isPng = [137, 80, 78, 71, 13, 10, 26, 10].every(
    (byte, index) => data[index] === byte,
  );
  const isJpeg = data[0] === 255 && data[1] === 216 && data[2] === 255;
  const isWebp =
    String.fromCharCode(...data.subarray(0, 4)) === "RIFF" &&
    String.fromCharCode(...data.subarray(8, 12)) === "WEBP";

  if (!(
    (extension === "png" && isPng) ||
    ((extension === "jpg" || extension === "jpeg") && isJpeg) ||
    (extension === "webp" && isWebp)
  )) {
    throw new JobImageError(
      filename,
      "Obsah souboru neodpovídá formátu obrázku.",
    );
  }
}

export function validateContentImages(serialized: {
  other: ReadonlyMap<string, Uint8Array>;
  external: ReadonlyMap<string, ReadonlyMap<string, Uint8Array>>;
}) {
  for (const [filename, data] of serialized.other) {
    validateJobImage(filename, data);
  }
  for (const files of serialized.external.values()) {
    for (const [filename, data] of files) {
      validateJobImage(filename, data);
    }
  }
}
