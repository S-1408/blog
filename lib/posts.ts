import { cache } from "react";
import { apiGet, isApiError } from "@/lib/api";
import {
  CategoryListResponseSchema,
  POSTS_TAG,
  PostListResponseSchema,
  PostResponseSchema,
  SlugSchema,
  postTag,
  tagSlug,
  type Post,
  type PostListResponse,
  type PostSummary,
  type Tag,
} from "@/lib/contracts";

export type { Post, PostSummary, Tag } from "@/lib/contracts";

/**
 * Time-based fallback. Normal updates arrive instantly through the
 * /api/revalidate webhook; this only matters if a webhook call is missed.
 */
const REVALIDATE_SECONDS = 3600;
/** The API's maximum page size. */
const MAX_PAGE_SIZE = 100;

type PostFilter = { category?: string; search?: string };

/** One page of post summaries, newest first. */
export async function getPostsPage(
  { page = 1, limit = 20, ...filter }: PostFilter & { page?: number; limit?: number } = {},
): Promise<PostListResponse> {
  return apiGet("/api/posts", PostListResponseSchema, {
    query: { page, limit, category: filter.category, search: filter.search },
    tags: [POSTS_TAG],
    revalidate: REVALIDATE_SECONDS,
  });
}

// cache() keys on argument identity, so it takes primitives rather than the filter object.
const getAllPages = cache(async (category?: string, search?: string): Promise<PostSummary[]> => {
  const filter = { category, search };
  const first = await getPostsPage({ ...filter, page: 1, limit: MAX_PAGE_SIZE });
  const rest = await Promise.all(
    Array.from({ length: Math.max(0, first.pagination.totalPages - 1) }, (_, index) =>
      getPostsPage({ ...filter, page: index + 2, limit: MAX_PAGE_SIZE }),
    ),
  );
  return [first, ...rest].flatMap((result) => result.data);
});

/** Every post summary (all pages), newest first. */
export function getPosts(filter: PostFilter = {}): Promise<PostSummary[]> {
  return getAllPages(filter.category, filter.search);
}

/** One post with its rendered HTML, or `null` if it doesn't exist. Other API failures throw. */
export const getPost = cache(async (slug: string): Promise<Post | null> => {
  if (!SlugSchema.safeParse(slug).success) return null;
  try {
    const { data } = await apiGet(`/api/posts/${slug}`, PostResponseSchema, {
      // Tagged with POSTS_TAG too: a post's `number` shifts when another post is added or removed.
      tags: [POSTS_TAG, postTag(slug)],
      revalidate: REVALIDATE_SECONDS,
    });
    return data;
  } catch (error) {
    if (isApiError(error) && error.isNotFound) return null;
    throw error;
  }
});

export async function getPostSlugs(): Promise<string[]> {
  return (await getPosts()).map((post) => post.slug);
}

/** Up to `count` other posts, newest first. */
export async function getRelatedPosts(slug: string, count = 2): Promise<PostSummary[]> {
  return (await getPosts()).filter((post) => post.slug !== slug).slice(0, count);
}

/** Post categories, presented as tags. */
export const getTags = cache(async (): Promise<Tag[]> => {
  const { data } = await apiGet("/api/categories", CategoryListResponseSchema, {
    tags: [POSTS_TAG],
    revalidate: REVALIDATE_SECONDS,
  });
  return data.map((name) => ({ name, slug: tagSlug(name) }));
});

export async function getTag(slug: string): Promise<Tag | null> {
  return (await getTags()).find((tag) => tag.slug === slug) ?? null;
}

/** Posts in the tag with this slug; empty if the tag doesn't exist. */
export async function getPostsByTag(slug: string): Promise<PostSummary[]> {
  const tag = await getTag(slug);
  return tag ? getPosts({ category: tag.name }) : [];
}
