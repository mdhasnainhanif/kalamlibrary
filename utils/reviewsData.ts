import { cache } from "react";
import { supabase } from "@/utils/supabase";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/utils/supabaseAdmin";
import { throwIfFailed } from "@/utils/kalamData";

export type PublicReview = {
  id: string;
  name: string;
  city_or_country: string | null;
  rating: number;
  message: string;
  is_sample: boolean;
  is_featured: boolean;
  display_at: string;
};

export const REVIEWS_PAGE_SIZE = 12;
export const REVIEWS_HOME_MAX = 6;
export const REVIEWS_REAL_HIDE_SAMPLES_AT = 6;

/** Table/view not created yet (run db/reviews.sql) — not treated as a live-site outage. */
export function isReviewsSchemaMissing(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  const msg = (error.message || "").toLowerCase();
  return (
    error.code === "PGRST205" ||
    error.code === "42P01" ||
    (msg.includes("reviews_public") && (msg.includes("does not exist") || msg.includes("could not find"))) ||
    (msg.includes("relation") && msg.includes("reviews") && msg.includes("does not exist"))
  );
}

export const getApprovedReviewsPublic = cache(async (): Promise<PublicReview[]> => {
  const { data, error } = await supabase
    .from("reviews_public")
    .select("id, name, city_or_country, rating, message, is_sample, is_featured, display_at")
    .order("is_featured", { ascending: false })
    .order("display_at", { ascending: false });

  if (isReviewsSchemaMissing(error)) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[reviews] reviews_public missing — run db/reviews.sql in Supabase.");
    }
    return [];
  }

  throwIfFailed(error, "reviews_public");
  return (data || []) as PublicReview[];
});

export type ReviewStats = {
  realCount: number;
  averageRating: number | null;
};

export function computeReviewStats(rows: PublicReview[]): ReviewStats {
  const real = rows.filter((r) => !r.is_sample);
  const realCount = real.length;
  if (realCount === 0) return { realCount: 0, averageRating: null };
  const sum = real.reduce((acc, r) => acc + r.rating, 0);
  return { realCount, averageRating: Math.round((sum / realCount) * 10) / 10 };
}

/** Home / listing display: real reviews first; fill with samples only while realCount < 6. */
export function pickDisplayReviews(all: PublicReview[], limit: number): PublicReview[] {
  const real = all.filter((r) => !r.is_sample);
  const samples = all.filter((r) => r.is_sample);

  if (real.length >= REVIEWS_REAL_HIDE_SAMPLES_AT) {
    return real.slice(0, limit);
  }

  const out = [...real];
  for (const s of samples) {
    if (out.length >= limit) break;
    out.push(s);
  }
  return out;
}

export type AdminReviewRow = {
  id: string;
  name: string;
  email: string | null;
  city_or_country: string | null;
  rating: number;
  message: string;
  status: "pending" | "approved" | "rejected";
  is_sample: boolean;
  is_featured: boolean;
  source: string;
  admin_note: string | null;
  created_at: string;
  approved_at: string | null;
};

export async function getReviewStatusCounts() {
  const admin = getSupabaseAdmin();
  const statuses = ["pending", "approved", "rejected"] as const;
  const counts: Record<(typeof statuses)[number], number> = {
    pending: 0,
    approved: 0,
    rejected: 0,
  };
  for (const status of statuses) {
    const { count, error } = await admin
      .from("reviews")
      .select("*", { count: "exact", head: true })
      .eq("status", status);
    throwIfFailed(error, `reviews count ${status}`);
    counts[status] = count ?? 0;
  }
  return counts;
}

export async function listAdminReviews(options: {
  status: "pending" | "approved" | "rejected";
  page: number;
  pageSize: number;
  search?: string;
}) {
  const admin = getSupabaseAdmin();
  const from = (options.page - 1) * options.pageSize;
  const to = from + options.pageSize - 1;

  let query = admin
    .from("reviews")
    .select(
      "id, name, email, city_or_country, rating, message, status, is_sample, is_featured, source, admin_note, created_at, approved_at",
      { count: "exact" }
    )
    .eq("status", options.status)
    .order("created_at", { ascending: false })
    .range(from, to);

  const q = options.search?.trim().replace(/[%_]/g, "");
  if (q) {
    query = query.or(`name.ilike.%${q}%,message.ilike.%${q}%,city_or_country.ilike.%${q}%`);
  }

  const { data, error, count } = await query;
  throwIfFailed(error, "admin reviews list");
  return { rows: (data || []) as AdminReviewRow[], total: count ?? 0 };
}

export function assertReviewsReadable(): void {
  if (!isSupabaseAdminConfigured()) {
    throw new Error("Reviews require Supabase configuration");
  }
}
