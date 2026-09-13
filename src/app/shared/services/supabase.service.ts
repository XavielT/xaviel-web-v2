import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, SupabaseClientOptions } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

/**
 * Key supabase-js persists the session under. Namespaced so an installed Music
 * Hub (`music-hub-auth`) and this site never read each other's session.
 */
export const AUTH_STORAGE_KEY = 'xaviel-web-auth';

/**
 * A `Storage` that degrades instead of throwing.
 *
 * `localStorage` is not merely empty in a private window or with site data
 * blocked — *touching* it throws a SecurityError, and an uncaught one during
 * client construction takes the whole app down before it paints. Confirmed in
 * this environment: reading `localStorage` on the dev-server origin threw
 * rather than returning null.
 *
 * The trade-off is deliberate: when storage is unavailable the session lives in
 * memory for the tab and is gone on reload. That is the correct failure — a
 * visitor who has blocked storage has asked not to be remembered.
 */
const safeStorage: Storage = {
  getItem(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return memory.get(key) ?? null;
    }
  },
  setItem(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      memory.set(key, value);
    }
  },
  removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch {
      memory.delete(key);
    }
  },
  clear() {
    try {
      localStorage.clear();
    } catch {
      memory.clear();
    }
  },
  key(index) {
    try {
      return localStorage.key(index);
    } catch {
      return [...memory.keys()][index] ?? null;
    }
  },
  get length() {
    try {
      return localStorage.length;
    } catch {
      return memory.size;
    }
  },
};

const memory = new Map<string, string>();

const options: SupabaseClientOptions<'public'> = {
  auth: {
    persistSession: true,
    autoRefreshToken: true,

    // There is no OAuth provider and no email link that returns to this origin
    // (password reset is out of scope this phase), so there is nothing in the
    // URL to detect. Leaving it on would have supabase-js parse and rewrite the
    // fragment of every page load for nothing.
    //
    // PHASE 5 MUST REVISIT THIS. The moment sign-up sends a confirmation email,
    // the link comes back to this origin as `?code=...` and, under PKCE, has to
    // be exchanged for a session. With this false, supabase-js ignores it and
    // the user lands on the site still signed out, with no error anywhere — the
    // confirmation silently does nothing. Either set it true then, or call
    // exchangeCodeForSession() explicitly on the landing route.
    detectSessionInUrl: false,

    // PKCE, which is supabase-js's default, rather than the 'implicit' flow
    // Music Hub uses. Music Hub's choice was forced by two things this site does
    // not have: a Capacitor WebView whose origin is https://localhost, and a
    // password-reset link opened in the phone's mail app rather than the browser
    // that requested it — under PKCE the code verifier is bound to the
    // requesting browser's storage, so that flow breaks. Neither applies here,
    // and PKCE does not put tokens in a URL fragment, so it is the safer default.
    flowType: 'pkce',

    storage: safeStorage,
    storageKey: AUTH_STORAGE_KEY,
  },
};

/**
 * The single `SupabaseClient` for the whole site.
 *
 * One client, root-provided. Anything needing Supabase injects this; nothing
 * calls `createClient` a second time. Two clients against one project means two
 * session stores racing each other on refresh.
 *
 * The client defaults to the `public` schema because that is where auth and
 * `profiles` live. Tu Combustible RD's tables are namespaced per ADR-03 and are
 * reached with `appSchema()` below, which is a per-query switch on the same
 * client rather than a second one.
 *
 * Nothing here is a security boundary. The anon key and this whole bundle are
 * public; RLS in the database is what decides what any of it may read or write
 * (ADR-04).
 */
@Injectable({ providedIn: 'root' })
export class SupabaseService {
  readonly client: SupabaseClient = createClient(
    environment.supabaseUrl,
    environment.supabaseAnonKey,
    options,
  );

  /**
   * Query builder scoped to Tu Combustible RD's namespaced schema.
   *
   * Returns 404 with `PGRST106` until the schema is both created *and* added to
   * Project Settings → API → Exposed schemas. ADR-03 flags that as the way this
   * setup silently fails; both steps are required, not either.
   *
   * DEVIATION FROM ADR-03, which says to configure the client with
   * `db: { schema: 'tucombustible' }`. That would make the namespaced schema the
   * default for *every* query on this client — including `public.profiles`,
   * which AuthService reads, and which would then 404. The schema is a
   * per-query switch instead, so `public` stays the default where auth lives.
   * Same end state ADR-03 wants; one client, not two.
   */
  appSchema() {
    return this.client.schema(environment.appSchema as never);
  }
}
