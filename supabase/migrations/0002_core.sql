-- TaskJar: core tables for version 1.
-- profiles, contacts, needs (jobs), offers (skills), responses, threads, messages.
--
-- How to run: Supabase dashboard -> SQL Editor -> New query -> paste this -> Run.
-- Safe to run more than once.

-- ---------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------

-- One public profile per user. Created automatically on signup (see trigger below).
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default '',
  zip text,
  bio text,
  created_at timestamptz not null default now()
);

-- Private contact info. Only the owner reads it directly; matched people
-- get it through the contact_for() function below.
create table if not exists public.contacts (
  user_id uuid primary key references auth.users (id) on delete cascade,
  phone text
);

-- A job someone needs done.
create table if not exists public.needs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  title text not null check (char_length(title) between 3 and 100),
  category text not null,
  description text not null check (char_length(description) between 10 and 2000),
  zip text not null check (zip ~ '^\d{5}$'),
  area text,
  pay_type text not null check (pay_type in ('fixed', 'hourly', 'offer')),
  pay_amount integer check (pay_amount is null or pay_amount between 1 and 100000),
  when_text text,
  status text not null default 'open' check (status in ('open', 'taken', 'done', 'cancelled')),
  helper_id uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists needs_status_created on public.needs (status, created_at desc);
create index if not exists needs_owner on public.needs (owner_id);

-- A skill someone offers. One per user.
create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references public.profiles (id) on delete cascade,
  headline text not null check (char_length(headline) between 3 and 100),
  categories text[] not null default '{}',
  description text not null check (char_length(description) between 10 and 2000),
  rate_text text,
  zips text[] not null default '{}',
  availability text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- "I can do this" on a need.
create table if not exists public.responses (
  id uuid primary key default gen_random_uuid(),
  need_id uuid not null references public.needs (id) on delete cascade,
  helper_id uuid not null references public.profiles (id) on delete cascade,
  message text not null check (char_length(message) between 1 and 1000),
  status text not null default 'pending' check (status in ('pending', 'picked', 'declined')),
  created_at timestamptz not null default now(),
  unique (need_id, helper_id)
);

-- A conversation between two people, optionally about one need.
-- a_id is always the smaller uuid so each pair has one row per need.
create table if not exists public.threads (
  id uuid primary key default gen_random_uuid(),
  need_id uuid references public.needs (id) on delete set null,
  a_id uuid not null references public.profiles (id) on delete cascade,
  b_id uuid not null references public.profiles (id) on delete cascade,
  last_message_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  check (a_id < b_id)
);
create unique index if not exists threads_pair_need on public.threads (
  a_id,
  b_id,
  (coalesce(need_id, '00000000-0000-0000-0000-000000000000'::uuid))
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.threads (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index if not exists messages_thread_created on public.messages (thread_id, created_at);

-- ---------------------------------------------------------------
-- Functions and triggers
-- ---------------------------------------------------------------

-- Create the profile and contact rows the moment a user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'name', ''), split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;

  insert into public.contacts (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep threads sorted by most recent message.
create or replace function public.touch_thread()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.threads set last_message_at = new.created_at where id = new.thread_id;
  return new;
end
$$;

drop trigger if exists on_message_created on public.messages;
create trigger on_message_created
  after insert on public.messages
  for each row execute function public.touch_thread();

-- True when the caller is one of the two people in a thread.
create or replace function public.is_thread_party(t_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.threads
    where id = t_id and (a_id = auth.uid() or b_id = auth.uid())
  );
$$;

-- True when the caller posted the need.
create or replace function public.owns_need(n_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.needs where id = n_id and owner_id = auth.uid()
  );
$$;

-- Another person's phone number, but only once you are matched with them
-- on a need that is taken or done. Returns null otherwise.
create or replace function public.contact_for(other uuid)
returns text
language sql
security definer
stable
set search_path = public
as $$
  select c.phone
  from public.contacts c
  where c.user_id = other
    and exists (
      select 1 from public.needs n
      where n.status in ('taken', 'done')
        and (
          (n.owner_id = auth.uid() and n.helper_id = other)
          or (n.helper_id = auth.uid() and n.owner_id = other)
        )
    );
$$;

-- ---------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.contacts enable row level security;
alter table public.needs enable row level security;
alter table public.offers enable row level security;
alter table public.responses enable row level security;
alter table public.threads enable row level security;
alter table public.messages enable row level security;

-- profiles: anyone can read, only you can change yours.
drop policy if exists "profiles are public" on public.profiles;
create policy "profiles are public" on public.profiles
  for select using (true);
drop policy if exists "insert own profile" on public.profiles;
create policy "insert own profile" on public.profiles
  for insert with check (auth.uid() = id);
drop policy if exists "update own profile" on public.profiles;
create policy "update own profile" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- contacts: only you.
drop policy if exists "read own contact" on public.contacts;
create policy "read own contact" on public.contacts
  for select using (auth.uid() = user_id);
drop policy if exists "insert own contact" on public.contacts;
create policy "insert own contact" on public.contacts
  for insert with check (auth.uid() = user_id);
drop policy if exists "update own contact" on public.contacts;
create policy "update own contact" on public.contacts
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- needs: public to browse (except cancelled), only the owner edits.
drop policy if exists "needs are public" on public.needs;
create policy "needs are public" on public.needs
  for select using (status <> 'cancelled' or owner_id = auth.uid());
drop policy if exists "post own need" on public.needs;
create policy "post own need" on public.needs
  for insert with check (auth.uid() = owner_id);
drop policy if exists "edit own need" on public.needs;
create policy "edit own need" on public.needs
  for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- offers: public while active, only the owner edits.
drop policy if exists "active offers are public" on public.offers;
create policy "active offers are public" on public.offers
  for select using (active or owner_id = auth.uid());
drop policy if exists "post own offer" on public.offers;
create policy "post own offer" on public.offers
  for insert with check (auth.uid() = owner_id);
drop policy if exists "edit own offer" on public.offers;
create policy "edit own offer" on public.offers
  for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- responses: visible to the helper and the need owner.
drop policy if exists "see responses you are part of" on public.responses;
create policy "see responses you are part of" on public.responses
  for select using (helper_id = auth.uid() or public.owns_need(need_id));
drop policy if exists "respond to open needs" on public.responses;
create policy "respond to open needs" on public.responses
  for insert with check (
    helper_id = auth.uid()
    and exists (
      select 1 from public.needs n
      where n.id = need_id and n.status = 'open' and n.owner_id <> auth.uid()
    )
  );
drop policy if exists "need owner updates responses" on public.responses;
create policy "need owner updates responses" on public.responses
  for update using (public.owns_need(need_id)) with check (public.owns_need(need_id));

-- threads and messages: only the two people in them.
drop policy if exists "see own threads" on public.threads;
create policy "see own threads" on public.threads
  for select using (a_id = auth.uid() or b_id = auth.uid());
drop policy if exists "start a thread you are in" on public.threads;
create policy "start a thread you are in" on public.threads
  for insert with check (a_id = auth.uid() or b_id = auth.uid());

drop policy if exists "read messages in your threads" on public.messages;
create policy "read messages in your threads" on public.messages
  for select using (public.is_thread_party(thread_id));
drop policy if exists "send messages in your threads" on public.messages;
create policy "send messages in your threads" on public.messages
  for insert with check (sender_id = auth.uid() and public.is_thread_party(thread_id));

-- ---------------------------------------------------------------
-- Backfill: anyone who signed up before this migration ran.
-- ---------------------------------------------------------------

insert into public.profiles (id, name)
select u.id, coalesce(nullif(u.raw_user_meta_data ->> 'name', ''), split_part(u.email, '@', 1))
from auth.users u
on conflict (id) do nothing;

insert into public.contacts (user_id)
select id from auth.users
on conflict (user_id) do nothing;
