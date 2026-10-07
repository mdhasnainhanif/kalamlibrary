/**
 * Cloudflare Workers assets reject absolute URLs in public/_redirects.
 * Stale build cache can leave an old _redirects under .open-next/assets — remove before deploy.
 */
import fs from "node:fs";
import path from "node:path";

const assetsRedirects = path.join(".open-next", "assets", "_redirects");

if (fs.existsSync(assetsRedirects)) {
  fs.unlinkSync(assetsRedirects);
  console.log("Removed .open-next/assets/_redirects (invalid for Workers deploy)");
}
