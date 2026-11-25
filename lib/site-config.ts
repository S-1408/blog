const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const vercelHost = process.env.VERCEL_URL;

/**
 * Canonical public URL of the blog, including any Multi-Zones base path
 * (e.g. "https://example.com/blog"), without a trailing slash.
 * localhost is only a development fallback; set NEXT_PUBLIC_SITE_URL everywhere else.
 */
export const siteUrl = (
  configuredSiteUrl || (vercelHost ? `https://${vercelHost}` : "http://localhost:3001")
).replace(/\/+$/, "");
export const siteBaseUrl = new URL(`${siteUrl}/`);
export const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();

/**
 * Absolute URL for a path inside the blog. Unlike `new URL("/x", base)`, this keeps
 * the base path: absoluteUrl("/writing") -> "https://example.com/blog/writing".
 */
export function absoluteUrl(path = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return normalized === "/" ? siteUrl : `${siteUrl}${normalized}`;
}
