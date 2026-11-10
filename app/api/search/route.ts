import { NextRequest, NextResponse } from "next/server";
import { MIN_SEARCH_LENGTH, SEARCH_CACHE_CONTROL, sanitizeSearchQuery, searchKalams } from "@/utils/searchHelper";

const HEADERS = { "Cache-Control": SEARCH_CACHE_CONTROL };

export async function GET(request: NextRequest) {
  const query = sanitizeSearchQuery(new URL(request.url).searchParams.get("q") || "");

  if (query.length < MIN_SEARCH_LENGTH) {
    return NextResponse.json({ kalams: [], poets: [] }, { headers: HEADERS });
  }

  try {
    const results = await searchKalams(query);
    return NextResponse.json(results, { headers: HEADERS });
  } catch (err) {
    console.error("Search API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
