import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

interface NavItem {
  path: string;
  label: string;
  exact: boolean;
}

/**
 * The admin chrome: sidebar, signed-in indicator, sign-out, outlet.
 *
 * Deliberately shares nothing with the public site's layout — no navbar, no
 * footer, no portfolio styling. They are different products that happen to ship
 * in one bundle, and the public site must never grow a link into here
 * (admin-panel-spec.md: "Unlinked from the public site").
 *
 * Spanish only, written inline. ADR-05 exempts the admin from translation, so
 * these strings must NOT go into the i18n dictionaries and this component must
 * not use the `t` pipe.
 */
@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="admin">
      <aside class="sidebar" [class.open]="menuOpen()">
        <div class="brand">
          <span class="mark">XW</span>
          <span class="name">Administración</span>
        </div>

        <nav>
          @for (item of nav; track item.path) {
            <a
              [routerLink]="item.path"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: item.exact }"
              (click)="menuOpen.set(false)"
            >{{ item.label }}</a>
          }
        </nav>

        <div class="who">
          <span class="email" [title]="email()">{{ email() }}</span>
          <span class="badge">creador</span>
          <button type="button" (click)="signOut()" [disabled]="leaving()">
            {{ leaving() ? 'Saliendo…' : 'Cerrar sesión' }}
          </button>
        </div>
      </aside>

      <div class="main">
        <header class="topbar">
          <button class="hamburger" type="button" (click)="menuOpen.set(!menuOpen())"
                  [attr.aria-expanded]="menuOpen()" aria-label="Alternar menú">☰</button>
          <a class="to-site" href="/" title="Ver el sitio público">Ver sitio ↗</a>
        </header>
        <main class="content">
          <router-outlet />
        </main>
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
      .admin {
        display: flex;
        min-height: 100vh;
      }
      .sidebar {
        width: 232px;
        flex: 0 0 232px;
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
        padding: 1.1rem 0.9rem;
        background: #0f172a;
        border-right: 1px solid #1e293b;
      }
      .brand {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        padding: 0 0.35rem;
      }
      .mark {
        display: grid;
        place-items: center;
        width: 30px;
        height: 30px;
        border-radius: 7px;
        background: #f5a524;
        color: #0b1220;
        font-weight: 700;
        font-size: 12px;
      }
      .name {
        font-weight: 600;
        letter-spacing: 0.01em;
      }
      nav {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      nav a {
        padding: 0.5rem 0.6rem;
        border-radius: 7px;
        color: #94a3b8;
        text-decoration: none;
      }
      nav a:hover {
        background: #1e293b;
        color: #e2e8f0;
      }
      nav a.active {
        background: #1d4ed8;
        color: #fff;
      }
      .who {
        margin-top: auto;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.4rem;
        padding: 0.7rem 0.6rem;
        border-top: 1px solid #1e293b;
      }
      .email {
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #cbd5e1;
      }
      .badge {
        font-size: 11px;
        padding: 1px 7px;
        border-radius: 999px;
        background: #143a2a;
        color: #4ade80;
      }
      button {
        font: inherit;
        cursor: pointer;
        padding: 0.35rem 0.7rem;
        border-radius: 6px;
        border: 1px solid #475569;
        background: #1e293b;
        color: inherit;
      }
      button:disabled {
        opacity: 0.6;
        cursor: default;
      }
      .main {
        flex: 1 1 auto;
        min-width: 0;
        display: flex;
        flex-direction: column;
      }
      .topbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        padding: 0.6rem 1.1rem;
        border-bottom: 1px solid #1e293b;
      }
      .hamburger {
        display: none;
      }
      .to-site {
        margin-left: auto;
        color: #94a3b8;
        text-decoration: none;
        font-size: 13px;
      }
      .to-site:hover {
        color: #e2e8f0;
      }
      .content {
        padding: 1.4rem 1.1rem 2.5rem;
      }
      @media (max-width: 760px) {
        .sidebar {
          position: fixed;
          inset: 0 auto 0 0;
          z-index: 20;
          transform: translateX(-100%);
          transition: transform 0.18s ease;
        }
        .sidebar.open {
          transform: none;
        }
        .hamburger {
          display: inline-block;
        }
      }
    `,
  ],
})
export class AdminLayout {
  private auth = inject(AuthService);
  private router = inject(Router);

  protected readonly menuOpen = signal(false);
  protected readonly leaving = signal(false);

  protected readonly nav: NavItem[] = [
    { path: '/admin', label: 'Panel', exact: true },
    { path: '/admin/apps', label: 'Aplicaciones', exact: false },
    { path: '/admin/projects', label: 'Proyectos', exact: false },
    { path: '/admin/fuel-prices', label: 'Precios de combustible', exact: false },
  ];

  protected readonly email = computed(() => this.auth.user()?.email ?? '—');

  protected async signOut(): Promise<void> {
    this.leaving.set(true);
    await this.auth.signOut();
    await this.router.navigate(['/admin/login']);
    this.leaving.set(false);
  }
}
