import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[-\s]+/g, "-");
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  if (!query || query.trim().length < 2) {
    return NextResponse.json([]);
  }

  try {
    // Search translations by matching title or lyrics
    const { data, error } = await supabase
      .from("kalam_translations")
      .select("kalam_id, title, language, kalams(primary_title_roman, slug, authors(name_roman))")
      .or(`title.ilike.%${query}%,lyrics.ilike.%${query}%`)
      .limit(100);

    if (error) {
      throw error;
    }

    // Deduplicate results by kalam_id
    const seen = new Set();
    const results = [];

    if (data) {
      for (const item of data) {
        // Safe check for relation data
        const kalam = item.kalams as any;
        const authorData = kalam?.authors;
        const authorName = Array.isArray(authorData) 
          ? authorData[0]?.name_roman 
          : authorData?.name_roman;

        if (
          kalam &&
          !seen.has(item.kalam_id) &&
          kalam.primary_title_roman.toLowerCase().trim() !== "deegar" &&
          item.title?.toLowerCase().trim() !== "deegar" &&
          item.title?.trim() !== "دیگر" &&
          !kalam.slug.startsWith("deegar") &&
          !kalam.slug.startsWith("digar")
        ) {
          seen.add(item.kalam_id);
          results.push({
            kalam_id: item.kalam_id,
            title: kalam.primary_title_roman, // original roman title
            matched_title: item.title, // matching translated title
            language: item.language,
            slug: kalam.slug,
            author_name: authorName || "Unknown Poet",
            author_slug: authorName ? slugify(authorName) : ""
          });
        }
      }
    }

    // Return the first 10 unique results
    return NextResponse.json(results.slice(0, 10));
  } catch (err) {
    console.error("Search API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
