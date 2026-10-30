const MAX_JSON_BYTES = 64 * 1024;

export function requesForQuoteResponse(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function readRequesForQuoteRequest(
  request: Request,
): Promise<unknown> {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    throw new Error("Invalid origin");
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    throw new Error("Invalid content type");
  if (
    Number(request.headers.get("content-length")) > MAX_JSON_BYTES ||
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
      if (size > MAX_JSON_BYTES) {
        await reader.cancel();
        throw new Error("Request too large");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}
