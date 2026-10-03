import { loadEnvConfig } from "@next/env";
import { PrismaClient } from "@prisma/client";
loadEnvConfig(process.cwd());
const db = new PrismaClient();
try {
  for (const collection of ["Usage", "Token"])
    await db.$runCommandRaw({
      collMod: collection,
      index: { name: `${collection}_expires_idx`, expireAfterSeconds: 0 },
    });
  console.log("Expiration indexes are installed.");
} finally {
  await db.$disconnect();
}
