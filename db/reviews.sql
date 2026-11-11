-- Kalam Library — reader reviews (run manually in Supabase SQL editor)
-- Public access: use view `reviews_public` (approved only, safe columns). Anon has SELECT on the view only.
-- Writes / moderation: service role in Next.js API & admin (bypasses RLS).

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  city_or_country text,
  rating int not null check (rating >= 1 and rating <= 5),
  message text not null,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  is_sample boolean not null default false,
  is_featured boolean not null default false,
  source text not null default 'website',
  admin_note text,
  ip_hash text,
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  constraint reviews_name_len check (char_length(name) >= 2 and char_length(name) <= 60),
  constraint reviews_message_len check (char_length(message) >= 10 and char_length(message) <= 600),
  constraint reviews_email_len check (email is null or char_length(email) <= 254),
  constraint reviews_city_len check (city_or_country is null or char_length(city_or_country) <= 80)
);

create index if not exists reviews_status_created_idx on public.reviews (status, created_at desc);
create index if not exists reviews_ip_hash_created_idx on public.reviews (ip_hash, created_at desc)
  where ip_hash is not null;
create index if not exists reviews_public_list_idx on public.reviews (is_featured desc, approved_at desc nulls last)
  where status = 'approved';

comment on table public.reviews is 'Moderated reader testimonials; public site reads approved rows via reviews_public view.';

-- Safe public projection (no email, ip_hash, admin_note, status for pending/rejected)
-- Runs as view owner (not security_invoker) so anon can read the view without SELECT on base table.
create or replace view public.reviews_public as
select
  id,
  name,
  city_or_country,
  rating,
  message,
  is_sample,
  is_featured,
  created_at,
  approved_at,
  coalesce(approved_at, created_at) as display_at
from public.reviews
where status = 'approved';

alter table public.reviews enable row level security;

-- Anon/authenticated: no direct table access
revoke all on table public.reviews from anon, authenticated;

-- Anon may only read the public view
grant select on public.reviews_public to anon, authenticated;

-- Seed sample testimonials (clearly sample; generic names only)
insert into public.reviews (name, city_or_country, rating, message, status, is_sample, approved_at, source)
values
  (
    'Amina',
  'Pakistan',
    5,
    'I use Kalam Library almost every day to check naat lyrics before gatherings. The Urdu and Roman scripts side by side save me a lot of time.',
    'approved',
    true,
    now() - interval '120 days',
    'sample'
  ),
  (
    'Hassan',
    'UK',
    5,
    'Clean layout, easy search, and the poet pages are well organized. Exactly what I wanted for reading hamd and naat at home.',
    'approved',
    true,
    now() - interval '95 days',
    'sample'
  ),
  (
    'Fatima',
    'Canada',
    4,
    'The multi-language tabs are thoughtful. I share links with family who prefer Hindi while I read in Roman.',
    'approved',
    true,
    now() - interval '80 days',
    'sample'
  ),
  (
    'Yusuf',
    'India',
    5,
    'Reading on mobile is comfortable and the text size controls on kalam pages are helpful for older relatives.',
    'approved',
    true,
    now() - interval '60 days',
    'sample'
  ),
  (
    'Zainab',
    'UAE',
    5,
    'Glad this archive exists. I found several classics I had only heard orally, written clearly for the first time.',
    'approved',
    true,
    now() - interval '45 days',
    'sample'
  ),
  (
    'Omar',
    'USA',
    4,
    'Simple, respectful design without clutter. The focus stays on the poetry, which matters for spiritual reading.',
    'approved',
    true,
    now() - interval '30 days',
    'sample'
  );
