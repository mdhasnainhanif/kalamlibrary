import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "";

/** True when real Supabase env vars are present (build + runtime). */
export const supabaseConfigured =
  supabaseUrl.length > 0 && !supabaseUrl.includes("placeholder-please-set") && supabaseAnonKey.length > 0;

if (!supabaseConfigured) {
  console.warn(
    "WARNING: Supabase is not configured (NEXT_PUBLIC_SUPABASE_URL / key). DB features will no-op until env vars are set."
  );
}

/** In-memory stub when env is missing — avoids DNS hangs to placeholder hosts during CI build. */
export const supabase = supabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient("http://127.0.0.1:1", "build-stub-key", {
      auth: { persistSession: false, autoRefreshToken: false },
    });
