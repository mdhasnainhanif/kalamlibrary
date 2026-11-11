import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function readSupabaseEnv() {
  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    "";
  const configured =
    supabaseUrl.length > 0 &&
    !supabaseUrl.includes("placeholder-please-set") &&
    supabaseAnonKey.length > 0;
  return { supabaseUrl, supabaseAnonKey, configured };
}

/** True when real Supabase env vars are present (read at call time — safe in `next dev`). */
export function isSupabaseConfigured() {
  return readSupabaseEnv().configured;
}

let cachedClient: SupabaseClient | null = null;
let cachedSignature = "";

function getSupabaseClient(): SupabaseClient {
  const { supabaseUrl, supabaseAnonKey, configured } = readSupabaseEnv();
  const signature = configured ? `${supabaseUrl}\0${supabaseAnonKey}` : "stub";

  if (cachedClient && cachedSignature === signature) {
    return cachedClient;
  }

  if (!configured) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "WARNING: Supabase is not configured (NEXT_PUBLIC_SUPABASE_URL / key). DB features will no-op until env vars are set.",
      );
    }
    cachedClient = createClient("http://127.0.0.1:1", "build-stub-key", {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  } else {
    cachedClient = createClient(supabaseUrl, supabaseAnonKey);
  }

  cachedSignature = signature;
  return cachedClient;
}

/** Lazy client — env is read on first query, not at bundle load (fixes local dev 404s). */
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseClient();
    const value = client[prop as keyof SupabaseClient];
    return typeof value === "function" ? (value as (...args: unknown[]) => unknown).bind(client) : value;
  },
});
