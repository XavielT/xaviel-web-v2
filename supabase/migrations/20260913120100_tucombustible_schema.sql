-- The namespaced schema for Tu Combustible RD (ADR-03).
--
-- Phase 2 creates the schema and its grants only. The app's real tables —
-- vehicles, fill_ups, expenses, reminders, user_settings, fuel_prices — are
-- Phase 5's job and are not created here.
--
-- NOTE ON EXISTING CONVENTION: Music Hub, the only current tenant of x-core,
-- puts everything in public (profiles, songs, playlists, app_settings —
-- confirmed by probing the REST API). So this schema is a new convention for
-- this project rather than a continuation of one, which is what ADR-03 decided
-- and is recorded here so the divergence is not mistaken for an accident.

create schema if not exists tucombustible;

comment on schema tucombustible is
  'Tu Combustible RD. Namespaced per ADR-03 so app boundaries stay legible and '
  'generic table names (settings, entries) cannot collide in public.';

-- PostgREST reaches a schema only if the API roles can see into it. Usage alone
-- grants nothing on the objects inside; each table still needs its own grants
-- and its own RLS policies, which is what Phase 5 will add per table.
grant usage on schema tucombustible to anon, authenticated;

-- Default privileges for tables Phase 5 creates, so a new table is reachable
-- without remembering to re-grant. RLS still decides every row: a grant says
-- "you may ask", a policy says "you may see". Phase 5 must enable RLS on every
-- table it adds — a granted table with RLS off is world-readable.
alter default privileges in schema tucombustible
  grant select, insert, update, delete on tables to authenticated;

alter default privileges in schema tucombustible
  grant select on tables to anon;

-- ---------------------------------------------------------------------------
-- Exposure probe
-- ---------------------------------------------------------------------------
--
-- ADR-03 calls the exposed-schemas trap the single most common way this setup
-- silently 404s, and the phase prompt refuses to accept the schema as working
-- without a real query returning from it. An empty schema cannot be queried, so
-- this one table exists to be that round trip.
--
-- It is not application data and Phase 5 may drop it once a real table is
-- readable. Kept deliberately trivial.
create table if not exists tucombustible.schema_check (
  id         smallint primary key default 1,
  checked_at timestamptz not null default now(),
  constraint schema_check_single_row check (id = 1)
);

comment on table tucombustible.schema_check is
  'Phase 2 exposure probe: proves the schema is reachable through PostgREST. '
  'Not application data. Safe for Phase 5 to drop.';

insert into tucombustible.schema_check (id) values (1)
on conflict (id) do nothing;

-- RLS on, with an explicit policy rather than a table left open "for now"
-- (requirement 8). This row is a health check containing no information, so
-- world-readable is the correct, stated intent — not an oversight.
alter table tucombustible.schema_check enable row level security;

drop policy if exists "schema_check: readable by anyone" on tucombustible.schema_check;
create policy "schema_check: readable by anyone"
  on tucombustible.schema_check
  for select
  to anon, authenticated
  using (true);

-- No insert/update/delete policy: nobody writes this through the API.
