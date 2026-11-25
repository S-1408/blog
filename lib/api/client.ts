import type { z } from "zod";
import { ApiErrorBodySchema } from "@/lib/contracts";
import { ApiError } from "./errors";

const DEFAULT_TIMEOUT_MS = 8000;

type QueryValue = string | number | undefined;

export type ApiGetOptions = {
  query?: Record<string, QueryValue>;
  /** Next.js cache tags for on-demand revalidation. */
  tags?: string[];
  /** Seconds until the cached response is considered stale (time-based fallback). */
  revalidate?: number | false;
  timeoutMs?: number;
};

/**
 * API_URL is server-only on purpose (no NEXT_PUBLIC_ prefix): all reads happen in
 * Server Components, so the API's address is never shipped to the browser.
 */
function apiBaseUrl(path: string): string {
  const raw = process.env.API_URL?.trim();
  if (!raw) {
    throw new ApiError("config", "API_URL is not set. Add it to .env.local (see .env.example).", { path });
  }
  try {
    return new URL(raw).toString().replace(/\/+$/, "");
  } catch (cause) {
    throw new ApiError("config", `API_URL is not a valid URL: ${raw}`, { path, cause });
  }
}

function timeoutMs(override?: number): number {
  if (override) return override;
  const fromEnv = Number(process.env.API_TIMEOUT_MS);
  return Number.isFinite(fromEnv) && fromEnv > 0 ? fromEnv : DEFAULT_TIMEOUT_MS;
}

function buildUrl(path: string, query?: Record<string, QueryValue>): string {
  const url = new URL(`${apiBaseUrl(path)}${path}`);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  }
  return url.toString();
}

async function errorFromResponse(response: Response, path: string): Promise<ApiError> {
  const body: unknown = await response.json().catch(() => undefined);
  const parsed = ApiErrorBodySchema.safeParse(body);
  const message = parsed.success ? parsed.data.error : `API request failed with status ${response.status}`;
  return new ApiError("http", message, {
    path,
    status: response.status,
    details: parsed.success ? parsed.data.details : undefined,
  });
}

/** GET a JSON resource from the blog API and validate it against `schema`. */
export async function apiGet<T>(path: string, schema: z.ZodType<T>, options: ApiGetOptions = {}): Promise<T> {
  const url = buildUrl(path, options.query);
  const ms = timeoutMs(options.timeoutMs);

  let response: Response;
  try {
    response = await fetch(url, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(ms),
      next: { tags: options.tags, revalidate: options.revalidate },
    });
  } catch (cause) {
    if (cause instanceof DOMException && (cause.name === "TimeoutError" || cause.name === "AbortError")) {
      throw new ApiError("timeout", `API request timed out after ${ms}ms: GET ${path}`, { path, cause });
    }
    throw new ApiError("network", `Could not reach the API at ${url}`, { path, cause });
  }

  if (!response.ok) throw await errorFromResponse(response, path);

  const body: unknown = await response.json().catch((cause: unknown) => {
    throw new ApiError("validation", `API returned invalid JSON: GET ${path}`, { path, status: response.status, cause });
  });
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    throw new ApiError("validation", `API response did not match the contract: GET ${path}`, {
      path,
      status: response.status,
      details: parsed.error.issues.map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`),
      cause: parsed.error,
    });
  }
  return parsed.data;
}
