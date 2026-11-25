// Multi-Zones: set NEXT_PUBLIC_BASE_PATH=/blog when the blog is served under the portfolio's domain.
// Leave it unset to serve the blog at the root (local development, standalone deploys).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim().replace(/\/+$/, "") || undefined;

if (basePath && !basePath.startsWith("/")) {
  throw new Error(`NEXT_PUBLIC_BASE_PATH must start with "/" (got "${basePath}").`);
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(basePath ? { basePath } : {}),
};

export default nextConfig;
