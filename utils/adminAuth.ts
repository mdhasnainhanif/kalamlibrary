import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { User } from "@supabase/supabase-js";

export function parseAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS?.trim() || "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowlistedAdmin(email: string | undefined | null): boolean {
  if (!email) return false;
  const list = parseAdminEmails();
  return list.includes(email.trim().toLowerCase());
}

export async function createSupabaseServerAuthClient() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anon =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    "";

  if (!url || !anon) {
    throw new Error("Supabase auth is not configured");
  }

  return createServerClient(url, anon, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          /* RSC read-only */
        }
      },
    },
  });
}

export async function getAdminSessionUser(): Promise<User | null> {
  const supabase = await createSupabaseServerAuthClient();
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

export async function requireAdminUser(): Promise<User> {
  const user = await getAdminSessionUser();
  if (!user) throw new Error("UNAUTHORIZED");
  if (!isAllowlistedAdmin(user.email)) throw new Error("FORBIDDEN");
  return user;
}

export async function assertSameOriginAction() {
  const { headers } = await import("next/headers");
  const h = await headers();
  const origin = h.get("origin");
  const host = h.get("x-forwarded-host") || h.get("host");
  if (!origin || !host) return;
  if (!origin.includes(host)) throw new Error("Invalid origin");
}
