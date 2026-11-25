import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/posts";
import { absoluteUrl } from "@/lib/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["/", "/writing", "/about"].map((route) => ({ url: absoluteUrl(route) }));
  const postRoutes = (await getPosts()).map((post) => ({
    url: absoluteUrl(`/writing/${post.slug}`),
    lastModified: post.isoDate,
  }));

  return [...staticRoutes, ...postRoutes];
}
