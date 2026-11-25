/**
 * API contracts shared between the blog and the blog API.
 *
 * This folder is self-contained on purpose: it depends only on `zod` and uses
 * relative imports, so it can be moved to a shared package unchanged.
 * Do not import from "@/..." or from Next.js here.
 */
export * from "./posts";
export * from "./responses";
export * from "./revalidation";
