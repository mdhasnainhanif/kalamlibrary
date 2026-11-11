-- Run this in Supabase SQL Editor if the site errors after creating reviews (permission denied for table reviews).
-- Fixes reviews_public so anon can query it without direct access to the reviews table.

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

grant select on public.reviews_public to anon, authenticated;
