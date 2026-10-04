import nextEnv from "@next/env";
nextEnv.loadEnvConfig(process.cwd());
const errors: string[] = [];
for (const key of [
  "DATABASE_URL",
  "AUTH_SECRET",
  "APP_URL",
  "RESEND_API_KEY",
  "EMAIL_FROM",
  "OPENROUTER_API_KEY",
  "SUPPORT_EMAIL",
])
  if (!process.env[key]?.trim()) errors.push(`${key} is required.`);
if (process.env.AUTH_SECRET && process.env.AUTH_SECRET.length < 32)
  errors.push("AUTH_SECRET must be at least 32 characters.");
if (process.env.DATABASE_URL && !/^mongodb(?:\+srv)?:\/\//.test(process.env.DATABASE_URL))
  errors.push("DATABASE_URL must be a MongoDB connection string.");
if (process.env.APP_URL) {
  try {
    const u = new URL(process.env.APP_URL);
    if (!["http:", "https:"].includes(u.protocol) || u.username || u.password || u.pathname !== "/")
      errors.push("APP_URL must be an HTTP(S) origin without a path or credentials.");
    if (process.env.NODE_ENV === "production" && u.protocol !== "https:")
      errors.push("Production APP_URL must use HTTPS.");
  } catch {
    errors.push("APP_URL must be a valid URL.");
  }
}
for (const key of [
  "AI_DAILY_LIMIT",
  "AI_GLOBAL_DAILY_LIMIT",
  "IMAGE_DAILY_LIMIT",
  "IMAGE_GLOBAL_DAILY_LIMIT",
]) {
  const v = process.env[key];
  if (v && (!Number.isSafeInteger(Number(v)) || Number(v) <= 0))
    errors.push(`${key} must be a positive integer.`);
}
if (process.env.ENABLE_IMAGE_GENERATION === "true" && !process.env.OPENROUTER_IMAGE_MODEL)
  errors.push("OPENROUTER_IMAGE_MODEL is required when images are enabled.");
if (errors.length) {
  console.error("Environment setup needs attention:\n" + errors.map((e) => `• ${e}`).join("\n"));
  process.exitCode = 1;
} else
  console.log(
    "Required deployment variables are configured. This checks configuration, not service connectivity.",
  );
