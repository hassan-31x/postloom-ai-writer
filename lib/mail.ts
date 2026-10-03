import "server-only";
import { randomBytes, createHash } from "node:crypto";
import { db } from "@/lib/db";
import { appUrl, requiredEnv } from "@/lib/config";
export const tokenHash = (token: string) => createHash("sha256").update(token).digest("hex");
export async function sendAccountEmail(email: string, purpose: "verify" | "reset") {
  const apiKey = requiredEnv("RESEND_API_KEY");
  const from = requiredEnv("EMAIL_FROM");
  const token = randomBytes(32).toString("hex");
  await db.token.create({
    data: { email, purpose, hash: tokenHash(token), expires: new Date(Date.now() + 3600000) },
  });
  const link = `${appUrl()}/auth/${purpose === "verify" ? "verify-email" : "new-password"}?token=${token}`;
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
  if (!response.ok) throw new Error("We could not send the email. Please try again shortly.");
}
