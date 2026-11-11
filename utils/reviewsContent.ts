const URL_RE =
  /\b(?:https?:\/\/|www\.)[^\s]+|\b[a-z0-9-]+\.(com|net|org|me|io|co|pk|info|xyz)\b/i;

const PROFANITY = [
  "fuck",
  "shit",
  "bitch",
  "asshole",
  "bastard",
  "cunt",
  "nigger",
  "faggot",
  "whore",
];

export function stripHtml(input: string): string {
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .trim();
}

export function containsUrl(text: string): boolean {
  return URL_RE.test(text);
}

export function containsProfanity(text: string): boolean {
  const lower = text.toLowerCase();
  return PROFANITY.some((w) => lower.includes(w));
}

export function escapeReviewText(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function normalizeReviewFields(body: {
  name?: unknown;
  email?: unknown;
  city_or_country?: unknown;
  message?: unknown;
  rating?: unknown;
}) {
  const name = typeof body.name === "string" ? stripHtml(body.name).trim() : "";
  const email = typeof body.email === "string" ? stripHtml(body.email).trim() : "";
  const city = typeof body.city_or_country === "string" ? stripHtml(body.city_or_country).trim() : "";
  const message = typeof body.message === "string" ? stripHtml(body.message).trim() : "";
  const rating =
    typeof body.rating === "number"
      ? body.rating
      : typeof body.rating === "string"
        ? parseInt(body.rating, 10)
        : NaN;
  return { name, email, city, message, rating };
}

export function validateReviewSubmission(fields: ReturnType<typeof normalizeReviewFields>): string | null {
  if (fields.name.length < 2 || fields.name.length > 60) return "Invalid name.";
  if (fields.message.length < 10 || fields.message.length > 600) return "Invalid message.";
  if (!Number.isInteger(fields.rating) || fields.rating < 1 || fields.rating > 5) return "Invalid rating.";
  if (fields.email && (fields.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))) {
    return "Invalid email.";
  }
  if (fields.city.length > 80) return "Location is too long.";
  if (containsUrl(fields.message)) return "Links are not allowed in reviews.";
  if (containsProfanity(fields.message) || containsProfanity(fields.name)) return "Review could not be accepted.";
  return null;
}
