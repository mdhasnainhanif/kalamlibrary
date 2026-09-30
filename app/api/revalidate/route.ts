import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const DEFAULT_PATHS = ["/", "/kalams", "/authors", "/trending", "/sitemap.xml"];

/**
 * On-demand ISR refresh after Supabase imports (optional).
 * POST with header: x-revalidate-secret: <REVALIDATE_SECRET>
 * Body (optional): { "paths": ["/kalams"] }
 */
export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "REVALIDATE_SECRET is not configured" }, { status: 503 });
  }

  const provided =
    request.headers.get("x-revalidate-secret") ||
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    "";

  if (provided !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let paths = DEFAULT_PATHS;
  try {
    const body = await request.json();
    if (Array.isArray(body?.paths) && body.paths.every((p: unknown) => typeof p === "string")) {
      paths = body.paths as string[];
    }
  } catch {
    /* empty body → defaults */
  }

  for (const path of paths) {
    revalidatePath(path);
  }

  // Kalam routes share data; layout revalidation covers nested pages on next request pattern
  revalidatePath("/", "layout");

  return NextResponse.json({
    revalidated: true,
    paths,
    at: new Date().toISOString(),
  });
}
