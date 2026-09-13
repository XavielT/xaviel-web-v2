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

The admin identity is a database row on purpose. It is not in `src/environments/`, not in
a build-time constant, and not in any variable the browser can read (ADR-04) — the whole
Angular bundle is public.

## `public.profiles` is shared

Music Hub created it and its signup trigger. This site reads it for identity and **does not
own it**. Two consequences worth knowing before Phase 5:

- A Tu Combustible RD user who signs up gets a row in the same table Music Hub's members
  are in, and will appear in Music Hub's admin user list.
- Music Hub gates signup with an `allowed_emails` allowlist. **If that gate is enforced by
  a trigger on `auth.users` rather than only in Music Hub's UI, public signup for Tu
  Combustible RD will be rejected** — which would block G4. Untested; see the phase report.
