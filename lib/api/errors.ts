export type ApiErrorKind =
  /** API_URL is missing or invalid. */
  | "config"
  /** The request did not finish within the timeout. */
  | "timeout"
  /** The API could not be reached (DNS, refused connection, TLS...). */
  | "network"
  /** The API answered with a non-2xx status. */
  | "http"
  /** The API answered 2xx, but the body did not match the contract. */
  | "validation";

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly path: string;
  readonly status?: number;
  readonly details?: string[];

  constructor(
    kind: ApiErrorKind,
    message: string,
    options: { path: string; status?: number; details?: string[]; cause?: unknown },
  ) {
    super(message, { cause: options.cause });
    this.name = "ApiError";
    this.kind = kind;
    this.path = options.path;
    this.status = options.status;
    this.details = options.details;
  }

  get isNotFound(): boolean {
    return this.kind === "http" && this.status === 404;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
