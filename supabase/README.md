# Supabase — `x-core`

Schema for this site lives here as migration files, not as dashboard clicks.

**Project:** `x-core`, ref `nakgrkcqyuycadeuenuw`.
**Shared.** Music Hub is the other tenant and owns `public.profiles`, `public.songs`,
`public.playlists`, `public.app_settings`, `public.is_admin()` and its invite/admin RPCs.
**Do not modify or drop anything this repo did not create.**

## Applying migrations

Needs a Supabase personal access token — create one at
<https://supabase.com/dashboard/account/tokens>. It is a developer-machine credential;
it is not needed to build or deploy, and it must not be committed.

```bash
export SUPABASE_ACCESS_TOKEN=sbp_...
npx supabase link --project-ref nakgrkcqyuycadeuenuw
npx supabase db push          # or: npm run db:push
npm run types:gen             # regenerate src/app/shared/services/database.types.ts
```

## One step the CLI cannot do

**Project Settings → API → Exposed schemas: add `tucombustible`.**

This is a dashboard-only setting. Creating the schema and granting `usage` on it is not
enough — until it is in that list, every request against it fails with:

```
PGRST106  Invalid schema: tucombustible
          Only the following schemas are exposed: public, graphql_public
```

ADR-03 calls this the single most common way the setup silently 404s. The error is worth
learning to read, because it distinguishes the two failures:

| Response | Meaning |
|---|---|
| `PGRST106` "Invalid schema" | Schema not in the exposed list — do the dashboard step |
| `PGRST205` "Could not find the table" | Schema **is** exposed; the table is missing |
| `200` with rows | Exposed, table present, RLS allows the read |

Verify after doing it:

```bash
curl -s "https://nakgrkcqyuycadeuenuw.supabase.co/rest/v1/schema_check?select=*" \
  -H "apikey: <anon key from src/environments/environment.ts>" \
  -H "Accept-Profile: tucombustible"
# expected: [{"id":1,"checked_at":"..."}]
```

## Migrations in this repo

| File | What it does |
|---|---|
| `20260913120000_site_admins.sql` | `public.site_admins` allowlist + `public.is_site_admin()` |
| `20260913120100_tucombustible_schema.sql` | `tucombustible` schema, grants, and an exposure probe table |

## Admin identity — read before touching

`public.is_admin()` already existed when this phase started. **It is Music Hub's**, and it
means *"owns the shared music library"* (`profiles.role = 'admin'`). Music Hub's admin
panel can promote any invited member to that role.

So this site uses a separate allowlist, `public.site_admins`, behind
`public.is_site_admin()`. Promoting someone in the music app must never make them an
administrator of the website. Every RLS policy this site writes calls
**`public.is_site_admin()`**, never `public.is_admin()`.

`site_admins` has RLS enabled and **no policies at all**, plus grants revoked — so the list
is not filtered, it is invisible through the API. The only door is the security-definer
function, which answers about the caller and returns a boolean, never the list. Same shape
Music Hub uses for its `allowed_emails`.

### Seeding the first admin

Chicken-and-egg: nothing can insert into `site_admins` through the API. Run this once in
the SQL editor, as the owner:

```sql
insert into public.site_admins (user_id, note)
select id, 'creator' from auth.users where email = 'you@example.com'
on conflict (user_id) do nothing;
```

**Already done** for the creator's account, `note = 'creator'`. It is deliberately *not* a
migration file: that would put a personal email address into the repo, and this repo may
go public. The allowlist is one row of data, seeded once, not schema.

The admin identity is a database row on purpose. It is not in `src/environments/`, not in
a build-time constant, and not in any variable the browser can read (ADR-04) — the whole
Angular bundle is public.

## `public.profiles` is shared

Music Hub created it and its signup trigger. This site reads it for identity and **does not
own it**. Three consequences, all confirmed against the live database:

- The signup trigger is `on_auth_user_created` → `public.handle_new_user()`, which inserts
  `(id, display_name)` into `public.profiles`. It already satisfies this cycle's
  "profiles row auto-created on signup" requirement, so no second trigger was added.
- A Tu Combustible RD user who signs up gets a row in the same table Music Hub's members
  are in, and will appear in Music Hub's admin user list.
- **`profiles` SELECT is `using (true)` for `authenticated`** — any signed-in user reads
  every profile row. Phase 2 asked for own-row-only reads; that was not applied, because
  the policy is Music Hub's and narrowing it would break its member list. Writes are
  already correct: `update` is `id = auth.uid() or is_admin()`, and `insert` is
  `id = auth.uid()`. If Tu Combustible ever stores anything private on a profile, it needs
  its own table in `tucombustible`, not a column here.

### Signup is invite-only, globally — this blocks G4

`auth.users` carries a Music Hub trigger, `enforce_invite_only`, which raises
`P0001 'Sign-ups are invite-only. Ask Xaviel for an invite.'` unless the email is already
in `public.allowed_emails`. It is a database trigger, not a UI check, so it applies to
**every** signup against x-core — including Tu Combustible RD's in Phase 5.

Phase 5 has to decide this deliberately. Roughly:

- make the trigger app-aware (e.g. skip the check when `raw_user_meta_data->>'app'` is
  `tucombustible`) — touches Music Hub's trigger, so it is Music Hub's call;
- or give Tu Combustible RD its own Supabase project;
- or keep Tu Combustible invite-only too, and accept that.

Not decided here. Flagged so it is not discovered as a mystery 500 mid-Phase-5.

## Two repos, one migration history

`supabase_migrations.schema_migrations` is shared with Music Hub — it already held 33 of
its migrations when this phase started. This repo's two migrations are timestamped after
all of them, so they append cleanly.

The thing to know: `supabase migration list` run from *either* repo shows the other's
migrations as remote-only, and that is expected, not drift. Keep new migration timestamps
genuinely current in both repos and they stay ordered; a back-dated file will trip the
CLI's out-of-order check.

## The anon default-grant trap

Supabase sets a default privilege on schema `public` granting `EXECUTE` on every **newly
created function** to `anon`, `authenticated` and `service_role`:

```sql
select defaclacl from pg_default_acl d
join pg_namespace n on n.oid = d.defaclnamespace
where n.nspname = 'public' and d.defaclobjtype = 'f';
-- {postgres=X/…, anon=X/…, authenticated=X/…, service_role=X/…}
```

That is a **direct grant to `anon`**, not one inherited through `PUBLIC`. So
`revoke all on function … from public` does not remove it — the first version of
`is_site_admin()` was anon-executable despite exactly that revoke. Always follow with:

```sql
revoke all on function public.<fn>() from anon;
select has_function_privilege('anon', 'public.<fn>()', 'EXECUTE');  -- must be false
```

`supabase--get_advisors` (lint `0028_anon_security_definer_function_executable`) catches
this. Run it after every migration that adds a function.
