import { z } from "zod";
import { PostSchema, PostSummarySchema } from "./posts";

export const PaginationSchema = z.object({
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});

/** Every error response from the API. */
export const ApiErrorBodySchema = z.object({
  error: z.string(),
  details: z.array(z.string()).optional(),
});

/** GET /api/posts */
export const PostListResponseSchema = z.object({
  data: z.array(PostSummarySchema),
  pagination: PaginationSchema,
});

/** GET /api/posts/:slug, and the body of POST/PUT responses. */
export const PostResponseSchema = z.object({
  data: PostSchema,
});

/** GET /api/categories */
export const CategoryListResponseSchema = z.object({
  data: z.array(z.string().min(1)),
});

/** GET /api/health */
export const HealthResponseSchema = z.object({
  status: z.literal("ok"),
});

export type Pagination = z.infer<typeof PaginationSchema>;
export type ApiErrorBody = z.infer<typeof ApiErrorBodySchema>;
export type PostListResponse = z.infer<typeof PostListResponseSchema>;
export type PostResponse = z.infer<typeof PostResponseSchema>;
export type CategoryListResponse = z.infer<typeof CategoryListResponseSchema>;
