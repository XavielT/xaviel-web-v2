import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SupabaseService } from '../../services/supabase.service';
import { environment } from '../../../../environments/environment';

/**
 * Phase 2 verification harness. Not part of the site.
 *
 * The phase has to prove four things that only a real browser can show: that a
 * session survives a full page reload, that the access token refreshes instead
 * of expiring, that the namespaced schema answers a real query rather than
 * 404ing, and that `is_site_admin()` is callable and honest. None of those can
 * be demonstrated from SQL or from a build log, and until something imported
 * SupabaseService the whole client was tree-shaken out of the bundle — so the
 * "no service_role key in the bundle" check was passing only because there was
 * no Supabase code in there at all.
 *
 * It is reachable at /auth-probe, linked from nowhere, and lazily loaded so it
 * stays out of the initial chunk. Phase 3 builds the real sign-in screen; this
 * should be deleted then.
 *
 * Nothing here is a security boundary — it shows only what the signed-in
 * caller could already read, and RLS decides that, not this component.
 */
@Component({
  selector: 'app-auth-probe',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="probe">
      <h1>Phase 2 — auth &amp; schema probe</h1>

      <section>
        <h2>Session</h2>
        <dl>
          <dt>restored</dt>
          <dd>{{ auth.ready() ? 'yes' : 'waiting…' }}</dd>
          <dt>signed in</dt>
          <dd>{{ auth.signedIn() ? 'yes' : 'no' }}</dd>
          <dt>user</dt>
          <dd>{{ auth.user()?.email ?? '—' }}</dd>
          <dt>user id</dt>
          <dd>{{ auth.user()?.id ?? '—' }}</dd>
          <dt>token expires</dt>
          <dd>{{ expiresAt() }}</dd>
          <dt>storage</dt>
          <dd>{{ storageKind() }}</dd>
          <dt>profile</dt>
          <dd>{{ auth.profile()?.display_name || (auth.profile() ? '(blank)' : '—') }}</dd>
        </dl>
      </section>

      @if (!auth.signedIn()) {
        <section>
          <h2>Sign in</h2>
          <form (ngSubmit)="signIn()">
            <input
              name="email"
              type="email"
              placeholder="email"
              autocomplete="username"
              [(ngModel)]="email"
            />
            <input
              name="password"
              type="password"
              placeholder="password"
              autocomplete="current-password"
              [(ngModel)]="password"
            />
            <button type="submit" [disabled]="busy()">Sign in</button>
          </form>
        </section>
      } @else {
        <section>
          <button type="button" (click)="signOut()" [disabled]="busy()">Sign out</button>
        </section>
      }

      <section>
        <h2>Checks</h2>
        <button type="button" (click)="checkSchema()">Query {{ schema }}.schema_check</button>
        <button type="button" (click)="checkAdmin()">Call is_site_admin()</button>
        <button type="button" (click)="checkAllowlist()">Try to read site_admins</button>
        <pre>{{ log() || '(nothing run yet)' }}</pre>
      </section>
    </div>
  `,
  styles: [
    `
      .probe {
        position: relative;
        z-index: 10;
        margin: 1rem;
        padding: 1rem 1.25rem;
        border: 1px solid #334155;
        border-radius: 8px;
        background: #0f172a;
        color: #e2e8f0;
        font: 13px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace;
      }
      h1 {
        font-size: 15px;
        margin: 0 0 0.75rem;
      }
      h2 {
        font-size: 13px;
        margin: 1rem 0 0.35rem;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 0.06em;
      }
      dl {
        display: grid;
        grid-template-columns: max-content 1fr;
        gap: 0.15rem 1rem;
        margin: 0;
      }
      dt {
        color: #94a3b8;
      }
      dd {
        margin: 0;
        overflow-wrap: anywhere;
      }
      input,
      button {
        font: inherit;
        padding: 0.35rem 0.6rem;
        margin: 0.2rem 0.35rem 0.2rem 0;
        border-radius: 5px;
        border: 1px solid #475569;
        background: #1e293b;
        color: inherit;
      }
      button {
        cursor: pointer;
        background: #1d4ed8;
        border-color: #1d4ed8;
      }
      button:disabled {
        opacity: 0.5;
        cursor: default;
      }
      pre {
        margin: 0.5rem 0 0;
        padding: 0.6rem;
        background: #020617;
        border-radius: 5px;
        overflow-x: auto;
        white-space: pre-wrap;
        overflow-wrap: anywhere;
      }
    `,
  ],
})
export class AuthProbe {
  protected readonly auth = inject(AuthService);
  private readonly supabase = inject(SupabaseService);

  protected readonly schema = environment.appSchema;
  protected email = '';
  protected password = '';
  protected readonly busy = signal(false);
  protected readonly log = signal('');

  /**
   * Rendering the expiry is how token refresh is observed: leave the tab open
   * past this moment and it moves forward on its own, because
   * onAuthStateChange adopts the refreshed session.
   */
  protected readonly expiresAt = computed(() => {
    const seconds = this.auth.session()?.expires_at;
    if (!seconds) return '—';
    return new Date(seconds * 1000).toLocaleTimeString();
  });

  protected storageKind(): string {
    try {
      localStorage.getItem('probe');
      return 'localStorage';
    } catch {
      return 'in-memory fallback (localStorage unavailable)';
    }
  }

  protected async signIn(): Promise<void> {
    this.busy.set(true);
    const { error } = await this.auth.signIn(this.email.trim(), this.password);
    this.busy.set(false);
    this.password = '';
    this.write(error ? `sign-in failed: ${error.message}` : 'signed in');
  }

  protected async signOut(): Promise<void> {
    this.busy.set(true);
    const { error } = await this.auth.signOut();
    this.busy.set(false);
    this.write(error ? `sign-out failed: ${error.message}` : 'signed out');
  }

  /** The ADR-03 round trip: PGRST106 here means the schema is not exposed. */
  protected async checkSchema(): Promise<void> {
    const { data, error } = await this.supabase
      .appSchema()
      .from('schema_check')
      .select('*');
    this.write(
      error
        ? `${this.schema}.schema_check FAILED — ${error.code}: ${error.message}`
        : `${this.schema}.schema_check OK — ${JSON.stringify(data)}`,
    );
  }

  protected async checkAdmin(): Promise<void> {
    const { data, error } = await this.supabase.client.rpc('is_site_admin');
    this.write(
      error ? `is_site_admin() error — ${error.code}: ${error.message}` : `is_site_admin() → ${data}`,
    );
  }

  /** Expected to fail for everyone: the allowlist is invisible, not filtered. */
  protected async checkAllowlist(): Promise<void> {
    const { data, error } = await this.supabase.client.from('site_admins').select('*');
    this.write(
      error
        ? `site_admins refused (correct) — ${error.code}: ${error.message}`
        : `site_admins LEAKED ${JSON.stringify(data)}`,
    );
  }

  private write(line: string): void {
    const stamp = new Date().toLocaleTimeString();
    this.log.update((prev) => `${prev}${prev ? '\n' : ''}[${stamp}] ${line}`);
  }
}
