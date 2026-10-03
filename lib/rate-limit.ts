import "server-only";
import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { db } from "@/lib/db";
export class LimitError extends Error {}
export async function consumeLimit(key: string, limit: number, expires: Date) {
  // Mongo's unique key and atomic increment enforce limits across Vercel instances.
  let counter;
  try {
    counter = await db.usage.upsert({
      where: { key },
      create: { key, count: 1, expires },
      update: { count: { increment: 1 } },
    });
  } catch (e) {
    if ((e as { code?: string }).code !== "P2002") throw e;
    counter = await db.usage.update({ where: { key }, data: { count: { increment: 1 } } });
  }
  if (counter.count > limit)
    throw new LimitError("You have reached the request limit. Please try again later.");
}
export async function authLimit(action: string, email: string, max = 8) {
  const h = await headers();
  const ip = process.env.VERCEL
    ? (h.get("x-vercel-forwarded-for") || "unknown").split(",")[0].trim()
    : "local";
  const bucket = Math.floor(Date.now() / 3600000);
  const expires = new Date((bucket + 2) * 3600000);
  const hash = (v: string) => createHash("sha256").update(v).digest("hex");
  await consumeLimit(`auth:${action}:ip:${hash(ip)}:${bucket}`, max * 4, expires);
  await consumeLimit(`auth:${action}:email:${hash(email)}:${bucket}`, max, expires);
}
export async function reserveAI(userId: string, image = false) {
  const date = new Date().toISOString().slice(0, 10);
  const expires = new Date(`${date}T00:00:00Z`);
  expires.setUTCDate(expires.getUTCDate() + 2);
  const { dailyLimit, imageLimit, positiveInt } = await import("@/lib/config");
  const kind = image ? "image" : "text";
  await consumeLimit(`${kind}:${userId}:${date}`, image ? imageLimit() : dailyLimit(), expires);
  await consumeLimit(
    `${kind}:global:${date}`,
    positiveInt(
      image ? process.env.IMAGE_GLOBAL_DAILY_LIMIT : process.env.AI_GLOBAL_DAILY_LIMIT,
      image ? 20 : 1000,
    ),
    expires,
  );
}
export async function usageCount(userId: string, image = false) {
  const key = `${image ? "image" : "text"}:${userId}:${new Date().toISOString().slice(0, 10)}`;
  return (await db.usage.findUnique({ where: { key } }))?.count || 0;
}
