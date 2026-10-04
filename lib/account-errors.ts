export class AccountEmailError extends Error {
  constructor(
    public readonly reason: string,
    public readonly status?: number,
  ) {
    super("We could not send the email. Please try again shortly or contact support.");
  }
}

export function reportAccountError(mode: string, error: unknown) {
  // Never log raw errors: database URLs and provider responses can contain secrets or email addresses.
  const detail = error as { name?: string; code?: string; type?: string } | null;
  console.error("[account] Request failed", {
    mode,
    name: detail?.name || "UnknownError",
    code: detail?.code,
    type: detail?.type,
    ...(error instanceof AccountEmailError ? { reason: error.reason, status: error.status } : {}),
  });
}
