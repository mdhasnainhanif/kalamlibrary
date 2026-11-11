import { createHash } from "crypto";

/** Salted SHA-256 of client IP — stored only for rate limiting, never displayed. */
export function hashClientIp(ip: string): string | null {
  const salt = process.env.REVIEW_IP_HASH_SALT?.trim();
  if (!salt || !ip) return null;
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

export function getClientIp(request: Request): string {
  const cf = request.headers.get("cf-connecting-ip");
  if (cf?.trim()) return cf.trim();
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() || "";
  const realIp = request.headers.get("x-real-ip");
  return realIp?.trim() || "unknown";
}
