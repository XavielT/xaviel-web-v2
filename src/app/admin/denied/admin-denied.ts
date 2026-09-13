import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

/**
 * Shown to somebody who is signed in but is not an administrator of this site.
 *
 * Distinct from the login page on purpose. "Sign in" is the wrong instruction
 * for a person who already did — most likely a Music Hub member, since both apps
 * share the x-core project and therefore share accounts. Telling them plainly
 * that their account is fine but not for this site saves a loop of retyping a
 * correct password.
 */
@Component({
  selector: 'app-admin-denied',
  standalone: true,
  template: `
    <div class="wrap">
      <div class="card">
        <h1>Sin acceso</h1>
        <p>
          La sesión de <strong>{{ email() }}</strong> es válida, pero esa cuenta no administra
          este sitio.
        </p>
        <p class="hint">
          Las cuentas se comparten con otras apps del mismo proyecto de Supabase, así que
          iniciar sesión correctamente no implica acceso a esta sección.
        </p>
        <div class="actions">
          <button type="button" (click)="signOut()" [disabled]="leaving()">
            {{ leaving() ? 'Saliendo…' : 'Cerrar sesión' }}
          </button>
          <a href="/">Volver al sitio</a>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
        background: #0b1220;
        color: #e2e8f0;
        font: 14px/1.55 system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
      }
      .wrap { min-height: 100vh; display: grid; place-items: center; padding: 1.5rem; }
      .card {
        max-width: 430px;
        padding: 1.6rem;
        border: 1px solid #1e293b;
        border-radius: 12px;
        background: #0f172a;
      }
      h1 { margin: 0 0 0.6rem; font-size: 1.15rem; }
      p { margin: 0 0 0.7rem; }
      .hint { color: #94a3b8; font-size: 13px; }
      .actions { display: flex; align-items: center; gap: 1rem; margin-top: 1.2rem; }
      button {
        font: inherit;
        cursor: pointer;
        padding: 0.45rem 0.8rem;
        border-radius: 7px;
        border: 1px solid #475569;
        background: #1e293b;
        color: inherit;
      }
      button:disabled { opacity: 0.6; cursor: default; }
      a { color: #94a3b8; font-size: 13px; }
    `,
  ],
})
export class AdminDenied {
  private auth = inject(AuthService);
  private router = inject(Router);

  protected readonly leaving = signal(false);
  protected readonly email = computed(() => this.auth.user()?.email ?? 'esta sesión');

  protected async signOut(): Promise<void> {
    this.leaving.set(true);
    await this.auth.signOut();
    await this.router.navigate(['/admin/login']);
    this.leaving.set(false);
  }
}
