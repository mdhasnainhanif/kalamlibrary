import { NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/utils/supabaseAdmin";
import { normalizeReviewFields, validateReviewSubmission } from "@/utils/reviewsContent";
import { verifyTurnstileToken } from "@/utils/turnstile";
import { getClientIp, hashClientIp } from "@/utils/reviewIpHash";
import { notifyAdminNewReview } from "@/utils/reviewNotify";

const NEVER = { "Cache-Control": "private, no-store" };

export function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405, headers: NEVER });
}

export async function POST(request: Request) {
  try {
    if (!isSupabaseAdminConfigured()) {
      return NextResponse.json({ error: "Service unavailable." }, { status: 503, headers: NEVER });
    }

    const body = await request.json();
    const honeypot = typeof body.website === "string" ? body.website.trim() : "";
    if (honeypot) {
      return NextResponse.json({ success: true }, { headers: NEVER });
    }

    const fields = normalizeReviewFields(body);
    const validationError = validateReviewSubmission(fields);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400, headers: NEVER });
    }

    const ip = getClientIp(request);
    const ipHash = hashClientIp(ip);

    const turnstileOk = await verifyTurnstileToken(
      typeof body.turnstileToken === "string" ? body.turnstileToken : "",
      ip
    );
    if (!turnstileOk) {
      return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 400, headers: NEVER });
    }

    const admin = getSupabaseAdmin();

    if (ipHash) {
      const minuteAgo = new Date(Date.now() - 60_000).toISOString();
      const { count: minuteCount, error: minuteErr } = await admin
        .from("reviews")
        .select("*", { count: "exact", head: true })
        .eq("ip_hash", ipHash)
        .gte("created_at", minuteAgo);
      if (minuteErr) {
        console.error("Rate limit check failed:", minuteErr.message);
        return NextResponse.json({ error: "Could not submit review." }, { status: 503, headers: NEVER });
      }
      if ((minuteCount ?? 0) >= 1) {
        return NextResponse.json({ error: "Please wait a moment before submitting again." }, { status: 429, headers: NEVER });
      }

      const dayAgo = new Date(Date.now() - 86_400_000).toISOString();
      const { count: dayCount, error: dayErr } = await admin
        .from("reviews")
        .select("*", { count: "exact", head: true })
        .eq("ip_hash", ipHash)
        .gte("created_at", dayAgo);
      if (dayErr) {
        console.error("Rate limit check failed:", dayErr.message);
        return NextResponse.json({ error: "Could not submit review." }, { status: 503, headers: NEVER });
      }
      if ((dayCount ?? 0) >= 3) {
        return NextResponse.json({ error: "Daily submission limit reached." }, { status: 429, headers: NEVER });
      }
    }

    const { data, error } = await admin
      .from("reviews")
      .insert({
        name: fields.name,
        email: fields.email || null,
        city_or_country: fields.city || null,
        rating: fields.rating,
        message: fields.message,
        status: "pending",
        is_sample: false,
        source: "website",
        ip_hash: ipHash,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Review insert failed:", error.message);
      return NextResponse.json({ error: "Could not submit review." }, { status: 500, headers: NEVER });
    }

    void notifyAdminNewReview(data.id);

    return NextResponse.json({ success: true }, { headers: NEVER });
  } catch (err) {
    console.error("Review API error:", err);
    return NextResponse.json({ error: "Could not submit review." }, { status: 500, headers: NEVER });
  }
}
