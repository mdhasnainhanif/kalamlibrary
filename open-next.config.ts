import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Next's incremental cache stays the dummy store. The edge cache is Workers Caching,
// enabled in wrangler.jsonc (`cache.enabled`), not an OpenNext binding.
export default defineCloudflareConfig();
