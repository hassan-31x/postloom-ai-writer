import "server-only";
import { requiredEnv, appUrl } from "@/lib/config";
export class ProviderError extends Error {}
export async function openrouter(path: string, body: Record<string, unknown>, timeout = 45000) {
  const response = await fetch(`https://openrouter.ai/api/v1/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${requiredEnv("OPENROUTER_API_KEY")}`,
      "Content-Type": "application/json",
      "HTTP-Referer": appUrl(),
      "X-Title": "Postloom",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(timeout),
    cache: "no-store",
  });
  if (!response.ok) {
    console.error("OpenRouter request failed", { status: response.status });
    throw new ProviderError(
      response.status === 429
        ? "The writing service is busy. Please try again shortly."
        : "The writing service could not complete your request. Please try again.",
    );
  }
  return response.json();
}
