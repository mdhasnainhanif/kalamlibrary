# Reader reviews — manual setup

## 1. Database

1. Open Supabase → SQL Editor.
2. Paste and run the full contents of `db/reviews.sql`.
3. Confirm table `reviews`, view `reviews_public`, and six sample rows exist.

**RLS model:** The base table has RLS enabled and no policies for `anon` (deny all). The `reviews_public` view exposes only `status = 'approved'` rows and safe columns; `grant select` on the view allows read-only public access if you ever query from the browser (the site uses server RSC + anon client against the view). All inserts and admin operations use `SUPABASE_SERVICE_ROLE_KEY` in Next.js only.

## 2. Supabase Auth admin user

1. Supabase → Authentication → Users → Add user (email + password).
2. Set `ADMIN_EMAILS` to that email (comma-separated list for multiple admins).
3. Deploy `ADMIN_EMAILS` as a **Worker secret** (not `NEXT_PUBLIC_`).

## 3. Cloudflare Turnstile

1. Cloudflare Dashboard → Turnstile → Create widget (managed recommended).
2. Add your site hostnames (localhost is supported for dev widget).
3. Set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` at **build time** (same as other `NEXT_PUBLIC_*`).
4. Set `TURNSTILE_SECRET_KEY` as a **Worker secret**.
5. Local dev: if secrets are missing, Turnstile verification is skipped when `NODE_ENV !== production`.

## 4. IP rate limiting

Set `REVIEW_IP_HASH_SALT` as a **Worker secret** (long random string). The API stores `sha256(salt + ip)` only — no raw IP in the database.

## 5. After deploy

Approve a test review at `/admin/reviews`. Public cache refreshes via `revalidateReviewSurfaces()` (Next ISR + Workers `ctx.cache.purge` when deployed on Cloudflare). Locally, purge reports `ctx.cache is not available`.

## 6. Optional notification email

Uses existing SMTP env vars (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASSWORD`, etc.). Failure to send email does not block saving the review.
