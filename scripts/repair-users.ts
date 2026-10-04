import nextEnv from "@next/env";
import { PrismaClient } from "@prisma/client";

nextEnv.loadEnvConfig(process.cwd());
const db = new PrismaClient();
try {
  // Prisma defaults apply to new documents, not explicit nulls in existing MongoDB records.
  // Recover creation time from the ObjectId, rather than pretending the account was created today.
  // Passwords, verification state, and non-null values are never changed.
  const result = await db.$runCommandRaw({
    update: "User",
    updates: [
      {
        q: { $or: [{ createdAt: null }, { sessionVersion: null }, { voice: null }] },
        u: [
          {
            $set: {
              createdAt: {
                $ifNull: [
                  "$createdAt",
                  { $convert: { input: "$_id", to: "date", onError: "$$NOW", onNull: "$$NOW" } },
                ],
              },
              sessionVersion: { $ifNull: ["$sessionVersion", 0] },
              voice: { $ifNull: ["$voice", ""] },
            },
          },
        ],
        multi: true,
      },
    ],
  });
  if (result.writeErrors || result.writeConcernError || result.ok !== 1)
    throw new Error("User backfill failed.");
  console.log(`User default fields repaired: ${result.nModified ?? 0} records.`);
  const users = await db.user.findMany();
  console.log(`Full Prisma account reads passed for ${users.length} records.`);
} catch (error) {
  console.error("User repair failed", { code: (error as { code?: string }).code || "unknown" });
  process.exitCode = 1;
} finally {
  await db.$disconnect();
}
