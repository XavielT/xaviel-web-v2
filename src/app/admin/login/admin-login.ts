import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

/**
 * Admin sign-in.
 *
 * Two things here are deliberate rather than incidental:
 *
 * 1. *One error message, always.* Supabase distinguishes "no such user" from
 *    "wrong password", and surfacing that difference turns this form into an
 *    oracle for which email addresses have accounts. Every credential failure
 *    collapses to the same sentence. Rate limiting is Supabase's (it returns
 *    429), and that one IS worth reporting accurately — telling somebody they
 *    typed the wrong password when the server refused to check is a lie that
 *    costs them the next ten minutes.
 *
 * 2. *Return to where they were sent from.* The guard puts the attempted URL in
 *    `redirectTo`; landing everyone on the dashboard would lose it.
 *
 * Spanish only, inline (ADR-05) — no `t` pipe, nothing added to the dictionaries.
 */
@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="wrap">
      <form class="card" (ngSubmit)="submit()">
        <h1>Administración</h1>
        <p class="sub">Acceso solo para el creador del sitio.</p>

        <label for="email">Correo</label>
        <input
          id="email"
          name="email"
          type="email"
          autocomplete="username"
          required
          [(ngModel)]="email"
          [disabled]="busy()"
        />

        <label for="password">Contraseña</label>
        <input
          id="password"
          name="password"
          type="password"
          autocomplete="current-password"
          required
          [(ngModel)]="password"
          [disabled]="busy()"
        />

        @if (error()) {
          <p class="error" role="alert">{{ error() }}</p>
        }

        <button type="submit" [disabled]="busy()">
          {{ busy() ? 'Entrando…' : 'Entrar' }}
        </button>

        <a class="back" href="/">Volver al sitio</a>
      </form>
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
      .wrap {
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 1.5rem;
      }
      .card {
        width: 100%;
        max-width: 360px;
        display: flex;
        flex-direction: column;
        gap: 0.45rem;
        padding: 1.6rem;
        border: 1px solid #1e293b;
        border-radius: 12px;
        background: #0f172a;
      }
      h1 {
        margin: 0;
        font-size: 1.15rem;
      }
      .sub {
        margin: 0 0 0.8rem;
        color: #94a3b8;
        font-size: 13px;
      }
      label {
        font-size: 12px;
        color: #94a3b8;
        margin-top: 0.4rem;
      }
      input {
        font: inherit;
        padding: 0.5rem 0.6rem;
        border-radius: 7px;
        border: 1px solid #475569;
        background: #1e293b;
        color: inherit;
      }
      button {
        margin-top: 1rem;
        font: inherit;
        cursor: pointer;
        padding: 0.55rem 0.7rem;
        border-radius: 7px;
        border: 1px solid #1d4ed8;
        background: #1d4ed8;
        color: #fff;
      }
      button:disabled {
        opacity: 0.6;
        cursor: default;
      }
      .error {
        margin: 0.6rem 0 0;
        padding: 0.5rem 0.6rem;
        border-radius: 7px;
        background: #3f1d1d;
        border: 1px solid #7f1d1d;
        color: #fecaca;
        font-size: 13px;
      }
      .back {
        margin-top: 0.9rem;
        text-align: center;
        color: #94a3b8;
        font-size: 13px;
        text-decoration: none;
      }
      .back:hover {
        color: #e2e8f0;
      }
    `,
  ],
})
export class AdminLogin {
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  protected email = '';
  protected password = '';
  protected readonly busy = signal(false);
  protected readonly error = signal('');

  protected async submit(): Promise<void> {
    if (this.busy()) return;
    this.busy.set(true);
    this.error.set('');

    const { error } = await this.auth.signIn(this.email.trim(), this.password);
    this.password = '';

    if (error) {
      this.busy.set(false);
      this.error.set(this.message(error));
      return;
    }

    // Signed in is not the same as allowed in. Ask the database before sending
    // them anywhere: a valid Music Hub account is a valid Supabase session, and
    // it is not an administrator of this site.
    const admin = await this.auth.refreshAdmin();
    this.busy.set(false);

    if (!admin) {
      await this.router.navigate(['/admin/denied']);
      return;
    }

    const target = this.route.snapshot.queryParamMap.get('redirectTo');
    // Only same-site paths. An absolute URL here would make this form an open
    // redirect that anybody could aim at their own domain.
    const safe = target && target.startsWith('/') && !target.startsWith('//') ? target : '/admin';
    await this.router.navigateByUrl(safe);
  }

  /**
   * One message for every credential failure, so the form cannot be used to
   * discover which addresses have accounts.
   */
  private message(error: { message?: string; status?: number }): string {
    if (error.status === 429 || /rate limit/i.test(error.message ?? '')) {
      return 'Demasiados intentos. Espera un momento y vuelve a intentarlo.';
    }
    return 'Credenciales inválidas.';
  }
}
