import "server-only";
import { randomBytes, createHash } from "node:crypto";
import { db } from "@/lib/db";
import { appUrl, requiredEnv } from "@/lib/config";
import { AccountEmailError, reportAccountError } from "@/lib/account-errors";
export const tokenHash = (token: string) => createHash("sha256").update(token).digest("hex");
export async function sendAccountEmail(email: string, purpose: "verify" | "reset") {
  let apiKey: string;
  let from: string;
  try {
    apiKey = requiredEnv("RESEND_API_KEY");
    from = requiredEnv("EMAIL_FROM");
  } catch {
    throw new AccountEmailError("missing_email_configuration");
  }
  const token = randomBytes(32).toString("hex");
  const record = await db.token.create({
    data: { email, purpose, hash: tokenHash(token), expires: new Date(Date.now() + 3600000) },
  });
  const link = `${appUrl()}/auth/${purpose === "verify" ? "verify-email" : "new-password"}?token=${token}`;
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [email],
        subject:
          purpose === "verify" ? "Confirm your Postloom email" : "Reset your Postloom password",
        html: `<div style="font-family:system-ui;max-width:540px;margin:auto;padding:32px"><h1>Postloom</h1><p>${purpose === "verify" ? "Confirm your email to start creating." : "You requested a password reset."}</p><p><a href="${link}">${purpose === "verify" ? "Confirm email" : "Reset password"}</a></p><p>This link expires in one hour. If you did not request this, you can ignore this email.</p></div>`,
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) {
      const detail = (await response.json().catch(() => null)) as {
        name?: string;
        message?: string;
      } | null;
      const reason =
        response.status === 403 && /testing emails|verify a domain/i.test(detail?.message || "")
          ? "sender_domain_not_verified_or_testing_recipient_restricted"
          : response.status === 401
            ? "invalid_api_key"
            : `provider_rejected_${response.status}`;
      throw new AccountEmailError(reason, response.status);
    }
  } catch (error) {
    // A rejected/undelivered email must not leave a usable orphan token.
    await db.token.deleteMany({ where: { id: record.id } }).catch((cleanupError) => {
      reportAccountError("email-token-cleanup", cleanupError);
    });
    if (error instanceof AccountEmailError) throw error;
    throw new AccountEmailError("provider_unreachable_or_timed_out");
  }
}
