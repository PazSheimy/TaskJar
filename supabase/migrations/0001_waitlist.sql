-- TaskJar: waitlist table for the landing page.
--
-- How to run: Supabase dashboard -> SQL Editor -> New query -> paste this -> Run.

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  role text not null check (role in ('need', 'earn', 'both')),
  zip text,
  created_at timestamptz not null default now()
);

-- Lock the table down. With row level security on and no policies,
-- the public (anon) key can neither read nor write it. Only the server,
-- using the secret key, inserts rows. You can still see everything in
-- the dashboard under Table Editor -> waitlist.
alter table public.waitlist enable row level security;
