-- TaskJar: zip code is optional on jobs (remote or "anywhere" tasks).
-- Helper offers already allow an empty zip list.

alter table public.needs alter column zip drop not null;
alter table public.needs drop constraint if exists needs_zip_check;
alter table public.needs add constraint needs_zip_check
  check (zip is null or zip ~ '^\d{5}$');
