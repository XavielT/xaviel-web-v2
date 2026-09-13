import { Injectable, computed, inject, signal } from '@angular/core';
import { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';

/**
 * A row of `public.profiles`.
 *
 * NOTE: this table is shared with Music Hub, which created it — the columns
 * below are its shape, not one this site chose. `role`, `is_admin` and
 * `disabled` describe a member's standing *in the music library*. This site
 * reads the row for identity only; see the admin-identity note in
 * `supabase/migrations/README.md` before treating `is_admin` as authorisation
 * for anything here.
 */
export interface Profile {
  id: string;
  display_name: string;
  created_at: string;
  is_admin: boolean;
  role: 'admin' | 'member' | 'listener';
  disabled: boolean;
  language: 'es' | 'en' | null;
  onboarded_at: string | null;
}

const PROFILE_COLUMNS =
  'id, display_name, created_at, is_admin, role, disabled, language, onboarded_at';

/**
 * Session state for the site.
 *
 * Holds who is signed in and nothing more. It deliberately answers no
 * authorisation question — "may this person do X" is decided by RLS in the
 * database, and a signal here that said otherwise would be a lie any visitor
 * could edit, since the whole bundle is public (ADR-04).
 *
 * `ready` exists because the session is restored asynchronously on boot. A
 * guard that reads `session()` before the restore finishes sees null and would
 * bounce a signed-in creator to the login screen, so consumers wait on `ready`
 * rather than on the first value.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private supabase = inject(SupabaseService);

  private _session = signal<Session | null>(null);
  readonly session = this._session.asReadonly();

  private _profile = signal<Profile | null>(null);
  readonly profile = this._profile.asReadonly();

  /**
   * Whether the signed-in user administers THIS site.
   *
   * The answer comes from `public.is_site_admin()` in the database, never from
   * anything the browser holds. It is cached per session only to avoid an RPC on
   * every guard activation — it is not a security decision. ADR-04: the whole
   * bundle is public, so a signal saying `true` proves nothing. RLS is what
   * refuses the data; this only decides which screen to draw.
   *
   * Deliberately NOT `profiles.is_admin`, which is Music Hub's library-admin
   * column and means something else entirely.
   */
  private _isSiteAdmin = signal(false);
  readonly isSiteAdmin = this._isSiteAdmin.asReadonly();

  /** False until the stored session has been restored (or found absent). */
  private _ready = signal(false);
  readonly ready = this._ready.asReadonly();

  /**
   * Resolves once the stored session has been restored, or found absent.
   *
   * The route guard needs to *wait* rather than poll: for the first tick after a
   * reload `session()` is null whether or not anyone is signed in, so a guard
   * that read it immediately would bounce every hard refresh of /admin to the
   * login screen.
   */
  private restored!: Promise<void>;
  whenReady(): Promise<void> {
    return this.restored;
  }

  readonly user = computed<User | null>(() => this._session()?.user ?? null);
  readonly signedIn = computed(() => this._session() !== null);

  constructor() {
    // getSession() reads the persisted session and refreshes it if the access
    // token has expired, so a reload inside the refresh-token's lifetime comes
    // back signed in.
    this.restored = this.supabase.client.auth
      .getSession()
      .then(({ data }) => this.adopt(data.session))
      .catch(() => this.adopt(null))
      .finally(() => this._ready.set(true));

    // Fires on sign-in, sign-out and every silent token refresh, which is what
    // keeps a long-lived tab from holding a stale access token.
    this.supabase.client.auth.onAuthStateChange((_event: AuthChangeEvent, session) => {
      this.adopt(session);
    });
  }

  async signIn(email: string, password: string) {
    const { error } = await this.supabase.client.auth.signInWithPassword({ email, password });
    // onAuthStateChange adopts the session; returning the error lets the caller
    // show it without this service owning any UI vocabulary.
    return { error };
  }

  async signOut() {
    const { error } = await this.supabase.client.auth.signOut();
    return { error };
  }

  /**
   * Ask the database whether the current user administers this site.
   *
   * Returns false for every failure, and that is the point: signed out, the RPC
   * comes back `42501 permission denied for function` because EXECUTE is granted
   * to `authenticated` only. Treating an error as "not an admin" is the correct
   * reading of every case — refused, offline, or genuinely false.
   */
  async refreshAdmin(): Promise<boolean> {
    if (!this.session()) {
      this._isSiteAdmin.set(false);
      return false;
    }
    const { data, error } = await this.supabase.client.rpc('is_site_admin');
    const admin = !error && data === true;
    this._isSiteAdmin.set(admin);
    return admin;
  }

  /**
   * Re-reads the current user's profile row. Returns null when signed out, and
   * also when RLS refuses the row — which is not an error worth surfacing, it
   * is the policy doing its job.
   */
  async loadProfile(): Promise<Profile | null> {
    const id = this.user()?.id;
    if (!id) {
      this._profile.set(null);
      return null;
    }

    const { data } = await this.supabase.client
      .from('profiles')
      .select(PROFILE_COLUMNS)
      .eq('id', id)
      .maybeSingle();

    const profile = (data as Profile | null) ?? null;
    this._profile.set(profile);
    return profile;
  }

  private adopt(session: Session | null): void {
    this._session.set(session);
    if (!session) {
      this._profile.set(null);
      this._isSiteAdmin.set(false);
      return;
    }
    void this.loadProfile();
    void this.refreshAdmin();
  }
}
