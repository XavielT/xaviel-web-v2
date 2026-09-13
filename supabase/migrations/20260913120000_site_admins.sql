-- Site administrator identity for xaviel-web-v2.
--
-- WHY THIS IS NOT public.is_admin()
--
-- x-core already has public.is_admin(). Music Hub created it, and it resolves to
-- profiles.role = 'admin', which in that app means "owns the shared music
-- library". Music Hub's admin panel can promote any invited member to that role.
-- Reusing it here would mean: anyone trusted to manage songs becomes an
-- administrator of the website, able to edit portfolio content in Phase 6.
--
-- Those are different trust levels, so they get different helpers. Music Hub's
-- is_admin() is left exactly as it is — this migration does not touch it.
--
-- (ADR-04 currently says is_admin() is "the single source of truth ... it already
-- exists in x-core". That line was written from Music Hub's code without checking
-- what it means. It needs correcting; see the phase report.)

-- ---------------------------------------------------------------------------
-- The allowlist
-- ---------------------------------------------------------------------------

create table if not exists public.site_admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  note       text not null default '',
  created_at timestamptz not null default now()
);

comment on table public.site_admins is
  'Who may administer xaviel-web-v2. Deliberately separate from Music Hub''s '
  'profiles.role. Not readable through the API by anyone — see the RLS note below.';

-- RLS ON WITH ZERO POLICIES. This is intentional and is the same shape Music Hub
-- uses for allowed_emails: with RLS enabled and no policy granting anything,
-- PostgREST can never return a row here to anon or authenticated, so the
-- allowlist is not merely filtered — it is invisible. The only door is a
-- security-definer function that checks membership itself (below).
alter table public.site_admins enable row level security;

-- Belt and braces: even without policies, no API role should hold a grant.
revoke all on table public.site_admins from anon, authenticated;

-- ---------------------------------------------------------------------------
-- The helper RLS policies call
-- ---------------------------------------------------------------------------

-- SECURITY DEFINER so it can read site_admins, which the caller cannot. Without
-- it this returns false for everyone — including a real admin — because the
-- caller's own RLS hides every row from the function body too. That is the
-- classic way this pattern silently fails closed.
--
-- search_path is pinned to empty and every name below is schema-qualified. A
-- definer function that resolves names through the caller's search_path can be
-- tricked into running someone else's table or operator with the owner's
-- rights; pinning it removes that.
--
-- STABLE, not VOLATILE: it is read-only within a statement, which lets the
-- planner call it once per query rather than once per row when it appears in a
-- policy over a large table.
create or replace function public.is_site_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.site_admins sa
    where sa.user_id = (select auth.uid())
  );
$$;

comment on function public.is_site_admin() is
  'True when the caller is an administrator of xaviel-web-v2. Distinct from '
  'public.is_admin(), which is Music Hub''s library-admin check.';

-- The function is safe to expose precisely because it answers only about the
-- caller and returns a boolean, never the list.
revoke all on function public.is_site_admin() from public;

-- `revoke ... from public` is NOT enough here, and this is the trap.
--
-- Supabase ships a default privilege on schema public that grants EXECUTE on
-- every newly created function to anon, authenticated and service_role:
--
--   pg_default_acl → public/f → {postgres=X, anon=X, authenticated=X, service_role=X}
--
-- That is a *direct* grant to the anon role, not one inherited through PUBLIC,
-- so revoking from PUBLIC leaves it untouched. The first version of this
-- migration did exactly that and shipped an anon-executable SECURITY DEFINER
-- function; Supabase's own linter caught it (lint 0028), and
-- has_function_privilege('anon', ...) confirmed it. The revoke below is the
-- part that actually does the work.
revoke all on function public.is_site_admin() from anon;

grant execute on function public.is_site_admin() to authenticated;

-- Not granted to anon on purpose: a signed-out visitor is never an admin, and
-- leaving it unexecutable means an anonymous probe gets "permission denied"
-- rather than a cheerful false it could use to fingerprint the deployment.
-- Verify with:
--   select has_function_privilege('anon', 'public.is_site_admin()', 'EXECUTE');
-- which must be false. Music Hub's public.is_admin() has the same ACL shape:
--   {postgres=X/postgres, authenticated=X/postgres, service_role=X/postgres}
