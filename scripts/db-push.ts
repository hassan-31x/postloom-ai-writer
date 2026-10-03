import { loadEnvConfig } from "@next/env";
import { spawnSync } from "node:child_process";
loadEnvConfig(process.cwd());
const result = spawnSync(process.execPath, ["node_modules/prisma/build/index.js", "db", "push"], {
  stdio: "inherit",
  env: process.env,
});
process.exitCode = result.status ?? 1;
