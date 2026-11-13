// Reserve space for text fields and multipart headers above the 4 MB file limit.
export const MAX_FORM_REQUEST_BYTES = 4_200_000;

export function formResponse(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function readFormRequest(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    throw new Error("Invalid origin");
  if (request.headers.get("sec-fetch-site") === "cross-site")
    throw new Error("Invalid request site");
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("multipart/form-data;"))
    throw new Error("Invalid content type");
  if (
    Number(request.headers.get("content-length")) > MAX_FORM_REQUEST_BYTES ||
    !request.body
  )
    throw new Error("Request too large");

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_FORM_REQUEST_BYTES) {
        await reader.cancel();
        throw new Error("Request too large");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const body = Buffer.concat(chunks);
  const form = await new Response(body, {
    headers: { "Content-Type": contentType },
  }).formData();
  for (const key of form.keys()) {
    if (!["values", "locale", "recaptchaToken", "files"].includes(key))
      throw new Error("Unexpected form field");
  }
  const metadata: Record<string, string> = {};
  for (const key of ["values", "locale", "recaptchaToken"]) {
    const entries = form.getAll(key);
    if (entries.length !== 1 || typeof entries[0] !== "string")
      throw new Error("Invalid form field");
    metadata[key] = entries[0];
  }
  const files: File[] = [];
  for (const entry of form.getAll("files")) {
    if (!(entry instanceof File)) throw new Error("Invalid attachment");
    files.push(entry);
  }
  return {
    input: {
      values: JSON.parse(metadata.values) as unknown,
      locale: metadata.locale,
      recaptchaToken: metadata.recaptchaToken,
    },
    files,
  };
}
