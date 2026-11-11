import { revalidatePath } from "next/cache";
import { getCloudflareContext } from "@opennextjs/cloudflare";

const REVIEW_PATHS = ["/", "/reviews"] as const;

type WorkersCachePurge = {
  purge: (options: {
    pathPrefixes?: string[];
    tags?: string[];
    purgeEverything?: boolean;
  }) => Promise<{ success: boolean; errors?: unknown[] }>;
};

/** After moderation changes: refresh ISR pages and purge Workers cache when available. */
export async function revalidateReviewSurfaces(extraPaginatedPaths: string[] = []) {
  revalidatePath("/");
  revalidatePath("/reviews");
  for (const p of extraPaginatedPaths) {
    if (p.startsWith("/reviews/page/")) revalidatePath(p);
  }

  const pathPrefixes = ["/reviews", ...extraPaginatedPaths.filter((p) => p.startsWith("/reviews/"))];
  const tags: string[] = ["home"];

  try {
    const { ctx } = getCloudflareContext();
    const cache = (ctx as { cache?: WorkersCachePurge }).cache;
    if (!cache) {
      return { paths: [...REVIEW_PATHS, ...extraPaginatedPaths], workersCache: { purged: false, reason: "local runtime" } };
    }
    const result = await cache.purge({ pathPrefixes, tags });
    return {
      paths: [...REVIEW_PATHS, ...extraPaginatedPaths],
      workersCache: { purged: result.success, pathPrefixes, tags, errors: result.errors },
    };
  } catch (error) {
    return {
      paths: [...REVIEW_PATHS, ...extraPaginatedPaths],
      workersCache: {
        purged: false,
        reason: error instanceof Error ? error.message : "purge unavailable",
      },
    };
  }
}
