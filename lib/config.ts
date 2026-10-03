export function positiveInt(value: string | undefined, fallback: number) {
  const number = Number(value);
  return Number.isSafeInteger(number) && number > 0 ? number : fallback;
}
export const dailyLimit = () => positiveInt(process.env.AI_DAILY_LIMIT, 20);
export const imageLimit = () => positiveInt(process.env.IMAGE_DAILY_LIMIT, 2);
export function appUrl() {
  return (
    process.env.APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  );
}
export function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error("This service is not configured yet. Please contact support.");
  return value;
}
