-- The first admin-writable table, and the thing Phase 3's negative test aims at.
--
-- WHY THIS EXISTS IN THE SHELL PHASE
--
-- Phase 3 builds no panels, so on the face of it it creates no data. But two of
-- its acceptance criteria are about data: "RLS policies using is_site_admin() on
-- admin-writable tables", and "a direct API call by a non-admin to an admin
-- table is denied — demonstrated". With no admin table in existence, neither can
-- be satisfied, and the lock would ship untested until Phase 6 put something
-- valuable behind it. ADR-04's whole point is that the guard is not the
-- protection; this table is what lets the real protection be proven.
--
-- It is also genuinely the P2 "Site settings" panel's table, so Phase 6 inherits
-- it rather than throwing it away.

create table if not exists public.site_settings (
  key        text primary key,
  value      jsonb       not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

comment on table public.site_settings is
  'Site-wide settings for xaviel-web-v2. Admin-only through the API: readable and '
  'writable solely by public.is_site_admin(). Created in Phase 3 so the admin lock '
  'could be tested against a real table.';

alter table public.site_settings enable row level security;

-- ---------------------------------------------------------------------------
-- Policies — explicit, not "RLS on and figure it out later"
-- ---------------------------------------------------------------------------
--
-- Admin-only for every verb, including SELECT. There is deliberately no public
-- read policy: nothing on the public site consumes these yet, and a table that
-- starts open is a table nobody ever closes. When Phase 6 needs a specific key
-- to be world-readable it adds a policy for that key, next to the code that
-- reads it.
--
-- Note how a denied SELECT behaves through PostgREST: it is not an error, it is
-- an empty array with 200. That is RLS working — the rows are invisible, not
-- forbidden — and it is why the phase's negative test checks a write as well.
-- A write refused by RLS does raise, with 42501.

drop policy if exists "site_settings: admin reads" on public.site_settings;
create policy "site_settings: admin reads"
  on public.site_settings
  for select
  to authenticated
  using (public.is_site_admin());

drop policy if exists "site_settings: admin writes" on public.site_settings;
create policy "site_settings: admin writes"
  on public.site_settings
  for all
  to authenticated
  using (public.is_site_admin())
  with check (public.is_site_admin());

-- `anon` gets no policy and no grant at all: a signed-out caller should not even
-- be able to ask. Revoked explicitly rather than left to the schema default,
-- for the same reason the Phase 2 migration revokes EXECUTE from anon by name —
-- Supabase's default privileges grant to anon directly, and relying on "we never
-- granted it" is how the is_site_admin() hole happened.
revoke all on table public.site_settings from anon;
grant select, insert, update, delete on table public.site_settings to authenticated;

-- One row so the table is not empty when the negative test reads it. An empty
-- table returns [] for an admin too, which would make the test unable to tell
-- "RLS filtered you" from "there was nothing there".
insert into public.site_settings (key, value)
values ('site.title', '{"es": "Xaviel Terrero", "en": "Xaviel Terrero"}'::jsonb)
on conflict (key) do nothing;
