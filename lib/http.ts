import { NextResponse } from "next/server";

/**
 * Generous for every form on the site (the largest, Contact, tops out
 * around 1 KB), while stopping anyone from making a route handler buffer
 * and parse megabytes of JSON.
 */
export const MAX_JSON_BODY_BYTES = 8 * 1024;

type JsonBodyResult =
  | { ok: true; data: unknown }
  | { ok: false; response: NextResponse };

function fail(error: string, status: number): JsonBodyResult {
  return { ok: false, response: NextResponse.json({ error }, { status }) };
}

/**
 * Reads a public form's JSON body with a hard size cap. Route handlers have
 * no body limit of their own (Vercel allows ~4.5 MB), and `request.json()`
 * buffers whatever it's sent, so every public POST route reads through
 * this instead. The cap is enforced on the bytes actually received, not
 * just the Content-Length header, which a client can omit or understate.
 */
export async function readJsonBody(
  request: Request,
  maxBytes = MAX_JSON_BODY_BYTES,
): Promise<JsonBodyResult> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return fail("Unsupported content type.", 415);
  }

  const declaredLength = Number(request.headers.get("content-length"));
  if (declaredLength > maxBytes) {
    return fail("Request is too large.", 413);
  }

  if (!request.body) return fail("Invalid request body", 400);

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    received += value.byteLength;
    if (received > maxBytes) {
      await reader.cancel();
      return fail("Request is too large.", 413);
    }
    chunks.push(value);
  }

  const bytes = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    return { ok: true, data: JSON.parse(new TextDecoder().decode(bytes)) };
  } catch {
    return fail("Invalid request body", 400);
  }
}
