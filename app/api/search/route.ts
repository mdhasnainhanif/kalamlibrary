import { NextRequest, NextResponse } from "next/server";
import { searchKalams } from "@/utils/searchHelper";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  if (!query || query.trim().length < 1) {
    return NextResponse.json([]);
  }

  try {
    const results = await searchKalams(query, 12);
    return NextResponse.json(results);
  } catch (err) {
    console.error("Search API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
