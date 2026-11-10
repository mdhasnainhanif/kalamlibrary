import { revalidatePath } from "next/cache";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextRequest, NextResponse } from "next/server";

const NEVER = { "Cache-Control": "private, no-store" };
const DEFAULT_PATHS = ["/", "/kalams", "/lyrics", "/authors", "/trending", "/sitemap.xml"];

/** Page patterns under a purged prefix. revalidatePath needs the route shape for dynamic segments. */
const NESTED_PAGE_PATTERNS: Record<string, string[]> = {
  "/lyrics": ["/lyrics/[lang]"],
};
const MAX_OPERATIONS = 100;

/**
 * Workers Caching purge. `ctx.cache` exists on the Worker when `cache.enabled` is set.
 * It is absent under `next dev` / `next start`, which only have Next's own cache.
 */
type WorkersCachePurge = {
  purge: (options: {
    pathPrefixes?: string[];
    tags?: string[];
    purgeEverything?: boolean;
  }) => Promise<{ success: boolean; errors?: unknown[] }>;
};

/**
 * On-demand refresh after Supabase imports.
 * POST with header: x-revalidate-secret: <REVALIDATE_SECRET>
 * Body (optional): { "paths": ["/kalam/some-slug"] } or { "purgeEverything": true }
 *
 * revalidatePath refreshes Next's cache, which is what the Worker renders on a miss.
 * ctx.cache.purge removes the Workers Cache copy so the next request is a miss.
 * A path of "/" is purged by the `home` tag, because the prefix "/" matches every URL.
 */
export function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405, headers: NEVER });
}

export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "REVALIDATE_SECRET is not configured" }, { status: 503, headers: NEVER });
  }

  const provided =
    request.headers.get("x-revalidate-secret") ||
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    "";

  if (provided !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NEVER });
  }

  let paths = DEFAULT_PATHS;
  let purgeEverything = false;
  try {
    const body = await request.json();
    if (body?.purgeEverything === true) purgeEverything = true;
    if (Array.isArray(body?.paths) && body.paths.every((p: unknown) => typeof p === "string")) {
      paths = body.paths as string[];
    }
  } catch {
    /* empty body → defaults */
  }

  if (!purgeEverything && paths.length > MAX_OPERATIONS) {
    return NextResponse.json(
      { error: `At most ${MAX_OPERATIONS} paths per request` },
      { status: 400, headers: NEVER }
    );
  }

  const pathPrefixes: string[] = [];
  const tags: string[] = [];
  const rejected: string[] = [];
  if (!purgeEverything) {
    for (const path of paths) {
      if (path === "/") {
        tags.push("home");
        continue;
      }
      if (isSafePrefix(path)) pathPrefixes.push(path);
      else rejected.push(path);
    }
    if (paths.includes("/sitemap.xml") && !pathPrefixes.includes("/sitemaps")) {
      pathPrefixes.push("/sitemaps");
    }
  }

  for (const path of paths) {
    revalidatePath(path);
    for (const pattern of NESTED_PAGE_PATTERNS[path] ?? []) {
      revalidatePath(pattern, "page");
    }
  }

  const workersCache = await purgeWorkersCache(
    purgeEverything ? { purgeEverything: true } : { pathPrefixes, tags }
  );

  return NextResponse.json(
    {
      revalidated: true,
      paths,
      rejected,
      workersCache,
      at: new Date().toISOString(),
    },
    { headers: NEVER }
  );
}

function isSafePrefix(path: string): boolean {
  return path.startsWith("/") && path.length > 1 && !/[\s?#\\]/.test(path) && !path.includes("://");
}

async function purgeWorkersCache(options: {
  pathPrefixes?: string[];
  tags?: string[];
  purgeEverything?: boolean;
}) {
  const empty =
    !options.purgeEverything && !options.pathPrefixes?.length && !options.tags?.length;
  if (empty) return { purged: false, reason: "nothing to purge" };

  try {
    const { ctx } = getCloudflareContext();
    const cache = (ctx as { cache?: WorkersCachePurge }).cache;
    if (!cache) {
      return { purged: false, reason: "ctx.cache is not available in this runtime" };
    }
    const result = await cache.purge(options);
    return { purged: result.success, ...options, errors: result.errors };
  } catch (error) {
    return {
      purged: false,
      reason: error instanceof Error ? error.message : "Workers cache purge is unavailable",
    };
  }
}
