import { createHash, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { REVALIDATE_SECRET_HEADER, RevalidatePayloadSchema } from "@/lib/contracts";

function secretsMatch(provided: string, expected: string): boolean {
  // Hash both sides so the comparison is constant-time regardless of length.
  const a = createHash("sha256").update(provided).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

/**
 * Called by the blog API after a post is created, updated or deleted.
 *   POST /api/revalidate
 *   x-revalidate-secret: <REVALIDATE_SECRET>
 *   { "tags": ["posts", "post:the-art-of-noticing"] }
 */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Revalidation is disabled until REVALIDATE_SECRET is configured." }, { status: 503 });
  }

  const provided = request.headers.get(REVALIDATE_SECRET_HEADER);
  if (!provided || !secretsMatch(provided, secret)) {
    return NextResponse.json({ error: "Invalid revalidation secret." }, { status: 401 });
  }

  const body: unknown = await request.json().catch(() => undefined);
  const parsed = RevalidatePayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid revalidation payload.", details: parsed.error.issues.map((issue) => issue.message) },
      { status: 400 },
    );
  }

  const tags = [...new Set(parsed.data.tags)];
  // { expire: 0 }: content changed outside Next.js (webhook), so stale pages must not be served.
  for (const tag of tags) revalidateTag(tag, { expire: 0 });

  return NextResponse.json({ revalidated: true, tags, now: Date.now() });
}
