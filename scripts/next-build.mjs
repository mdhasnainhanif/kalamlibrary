/**
 * Wraps `next build` so static-generation workers inherit KALAM_LIBRARY_NEXT_BUILD.
 * OpenNext / Cloudflare invoke `npm run build` (not `next build` directly).
 */
import { spawnSync } from "node:child_process";

process.env.KALAM_LIBRARY_NEXT_BUILD = "1";

const result = spawnSync("next", ["build"], {
  stdio: "inherit",
  env: process.env,
  shell: process.platform === "win32",
});

process.exit(result.status === null ? 1 : result.status);
