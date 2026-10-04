import nextEnv from "@next/env";
import { PrismaClient } from "@prisma/client";

nextEnv.loadEnvConfig(process.cwd());
const db = new PrismaClient();
let failed = false;
function fail(message: string) {
  failed = true;
  console.error(message);
}

// Read-only checks. Never send emails or print credentials/account data.
try {
  // Read full records: selecting only id hides legacy data conversion errors.
  await db.user.findMany();
  const topology = await db.$runCommandRaw({ hello: 1 });
  if (!topology.setName && topology.msg !== "isdbgrid")
    fail("MongoDB needs a replica set for account verification and password reset transactions.");
  for (const [collection, key] of [
    ["User", "email"],
    ["Usage", "key"],
    ["Token", "hash"],
  ]) {
    const result = await db.$runCommandRaw({ listIndexes: collection });
    const cursor = result.cursor as unknown as {
      firstBatch: { key: Record<string, number>; unique?: boolean; expireAfterSeconds?: number }[];
    };
    if (
      !cursor.firstBatch.some(
        (index) => index.unique && index.key[key] === 1 && Object.keys(index.key).length === 1,
      )
    )
      fail(`${collection}.${key} needs a unique index. Run npm run db:push.`);
    if (
      collection !== "User" &&
      !cursor.firstBatch.some((index) => index.key.expires === 1 && index.expireAfterSeconds === 0)
    )
      fail(`${collection} needs an expiration index. Run npm run db:push, then npm run db:ttl.`);
  }
  console.log("Database connectivity and auth index checks completed.");
} catch (error) {
  if ((error as { code?: string }).code === "P2032")
    fail(
      "Existing User records contain values incompatible with the Prisma schema. Run npm run db:repair-users to backfill null/missing default fields.",
    );
  else
    fail(
      "Database check failed. Check DATABASE_URL, Atlas network access, and run npm run db:push.",
    );
} finally {
  await db.$disconnect();
}

if (!process.env.AUTH_SECRET?.trim()) fail("AUTH_SECRET is required for login sessions.");
if (!process.env.RESEND_API_KEY?.trim() || !process.env.EMAIL_FROM?.trim()) {
  fail("RESEND_API_KEY and EMAIL_FROM are required for account emails.");
} else if (/@resend\.dev(?:>|\s|$)/i.test(process.env.EMAIL_FROM)) {
  fail(
    "EMAIL_FROM uses Resend's testing sender. Only the Resend account owner's email can receive links. Set EMAIL_FROM to an address on your verified Resend domain.",
  );
} else {
  try {
    const response = await fetch("https://api.resend.com/domains", {
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
      signal: AbortSignal.timeout(15000),
    });
    if (response.status === 403) {
      console.warn(
        "Cannot inspect domains with a sending-only API key. Check sender verification in the Resend dashboard.",
      );
    } else if (!response.ok) {
      fail(
        `Resend domain check failed (HTTP ${response.status}). Check the API key and permissions.`,
      );
    } else {
      const body = (await response.json()) as { data?: { name: string; status: string }[] };
      const domain = process.env.EMAIL_FROM.match(/@([^>\s]+)/)?.[1]?.toLowerCase();
      if (
        !body.data?.some((item) => item.name.toLowerCase() === domain && item.status === "verified")
      )
        fail("EMAIL_FROM does not match a verified domain in this Resend account.");
      else console.log("Resend sender domain is verified. Actual delivery has not been tested.");
    }
  } catch {
    fail("Resend is unreachable. Check network access and retry.");
  }
}

try {
  const origin = new URL(process.env.APP_URL || "");
  if (
    !["http:", "https:"].includes(origin.protocol) ||
    origin.pathname !== "/" ||
    origin.search ||
    origin.hash ||
    origin.username ||
    origin.password
  )
    fail("APP_URL must be an HTTP(S) origin without a path, query, or credentials.");
  if (["localhost", "127.0.0.1", "[::1]"].includes(origin.hostname))
    console.warn(
      "APP_URL is local. Confirmation and reset links will open localhost; change it for deployment.",
    );
} catch {
  fail("APP_URL must be the origin where users open Postloom.");
}
process.exitCode = failed ? 1 : 0;
