import { NextResponse } from "next/server";
import { createSupabaseServerAuthClient } from "@/utils/adminAuth";

const NEVER = { "Cache-Control": "private, no-store" };

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/admin";

  if (!code) {
    return NextResponse.redirect(new URL("/admin/login?error=auth", url.origin));
  }

  const supabase = await createSupabaseServerAuthClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(new URL("/admin/login?error=auth", url.origin));
  }

  return NextResponse.redirect(new URL(next, url.origin), { headers: NEVER });
}
