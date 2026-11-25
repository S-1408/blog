import { z } from "zod";

/** Cache tag for every list and detail fetch. Revalidating it refreshes all post data. */
export const POSTS_TAG = "posts";

/** Cache tag for one post's detail fetch. */
export function postTag(slug: string): `post:${string}` {
  return `post:${slug}`;
}

export const CacheTagSchema = z.union([
  z.literal(POSTS_TAG),
  z.string().regex(/^post:[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid post tag"),
]);

/** Body the API sends to the blog's POST /api/revalidate webhook. */
export const RevalidatePayloadSchema = z.object({
  tags: z.array(CacheTagSchema).min(1).max(20),
});

/** Header carrying the shared REVALIDATE_SECRET. */
export const REVALIDATE_SECRET_HEADER = "x-revalidate-secret";

export type CacheTag = z.infer<typeof CacheTagSchema>;
export type RevalidatePayload = z.infer<typeof RevalidatePayloadSchema>;
