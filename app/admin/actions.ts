"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/utils/supabaseAdmin";
import {
  assertSameOriginAction,
  createSupabaseServerAuthClient,
  isAllowlistedAdmin,
  requireAdminUser,
} from "@/utils/adminAuth";
import { normalizeReviewFields, stripHtml } from "@/utils/reviewsContent";
import { revalidateReviewSurfaces } from "@/utils/revalidateReviews";

async function guardAdmin() {
  await assertSameOriginAction();
  return requireAdminUser();
}

export async function adminLoginAction(formData: FormData) {
  await assertSameOriginAction();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  if (!email || !password) {
    redirect("/admin/login?error=missing");
  }

  const supabase = await createSupabaseServerAuthClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect("/admin/login?error=credentials");

  const { data } = await supabase.auth.getUser();
  if (!isAllowlistedAdmin(data.user?.email)) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=forbidden");
  }

  redirect("/admin");
}

export async function adminLogoutAction() {
  await assertSameOriginAction();
  const supabase = await createSupabaseServerAuthClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function adminApproveReview(reviewId: string) {
  await guardAdmin();
  const admin = getSupabaseAdmin();
  const { error } = await admin
    .from("reviews")
    .update({ status: "approved", approved_at: new Date().toISOString() })
    .eq("id", reviewId)
    .eq("status", "pending");
  if (error) throw new Error("Approve failed");
  await revalidateReviewSurfaces();
  revalidatePath("/admin/reviews");
}

export async function adminRejectReview(reviewId: string) {
  await guardAdmin();
  const admin = getSupabaseAdmin();
  const { error } = await admin.from("reviews").update({ status: "rejected" }).eq("id", reviewId);
  if (error) throw new Error("Reject failed");
  revalidatePath("/admin/reviews");
}

export async function adminDeleteReview(reviewId: string) {
  await guardAdmin();
  const admin = getSupabaseAdmin();
  const { error } = await admin.from("reviews").delete().eq("id", reviewId);
  if (error) throw new Error("Delete failed");
  await revalidateReviewSurfaces();
  revalidatePath("/admin/reviews");
}

export async function adminEditReviewMessage(reviewId: string, message: string, note: string) {
  await guardAdmin();
  const clean = stripHtml(message).trim();
  if (clean.length < 10 || clean.length > 600) throw new Error("Invalid message");
  const admin = getSupabaseAdmin();
  const { error } = await admin
    .from("reviews")
    .update({
      message: clean,
      admin_note: note?.trim() ? `Edited: ${stripHtml(note).trim()}` : "Edited by admin",
    })
    .eq("id", reviewId);
  if (error) throw new Error("Edit failed");
  await revalidateReviewSurfaces();
  revalidatePath("/admin/reviews");
}

export async function adminToggleFeatured(reviewId: string, featured: boolean) {
  await guardAdmin();
  const admin = getSupabaseAdmin();
  const { error } = await admin.from("reviews").update({ is_featured: featured }).eq("id", reviewId);
  if (error) throw new Error("Featured toggle failed");
  await revalidateReviewSurfaces();
  revalidatePath("/admin/reviews");
}

export async function adminCreateManualReview(formData: FormData) {
  await guardAdmin();
  const fields = normalizeReviewFields({
    name: formData.get("name"),
    message: formData.get("message"),
    rating: Number(formData.get("rating")),
    city_or_country: formData.get("city_or_country"),
  });
  if (fields.name.length < 2 || fields.name.length > 60) throw new Error("Invalid name");
  if (fields.message.length < 10 || fields.message.length > 600) throw new Error("Invalid message");
  if (!Number.isInteger(fields.rating) || fields.rating < 1 || fields.rating > 5) throw new Error("Invalid rating");
  if (fields.city.length > 80) throw new Error("Location too long");
  const source = String(formData.get("source") || "whatsapp").slice(0, 40);

  const admin = getSupabaseAdmin();
  const { error } = await admin.from("reviews").insert({
    name: fields.name,
    message: fields.message,
    rating: fields.rating,
    city_or_country: fields.city || null,
    status: "approved",
    approved_at: new Date().toISOString(),
    is_sample: false,
    source,
  });
  if (error) throw new Error("Create failed");
  await revalidateReviewSurfaces();
  revalidatePath("/admin/reviews");
  redirect("/admin/reviews?status=approved");
}
