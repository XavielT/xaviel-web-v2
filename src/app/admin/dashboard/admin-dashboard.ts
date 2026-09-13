import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

/**
 * Landing page after sign-in. Not analytics (admin-panel-spec.md).
 *
 * The counts the spec asks for — apps published, projects — are deliberately
 * absent rather than faked: they live in hand-written arrays in the Home
 * component today, and reading them here would hard-code the same data twice.
 * Phase 6 moves them into tables, and that is when a count means something.
 */
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h1>Panel</h1>
    <p class="lead">Sesión iniciada como <strong>{{ email() }}</strong>.</p>

    <section class="cards">
      @for (panel of panels; track panel.path) {
        <a class="card" [routerLink]="panel.path">
          <span class="tag">{{ panel.priority }}</span>
          <h2>{{ panel.title }}</h2>
          <p>{{ panel.summary }}</p>
        </a>
      }
    </section>

    <section class="note">
      <h3>Estado</h3>
      <p>
        Esta es la carcasa de administración: rutas, control de acceso y sesión. Los paneles
        se construyen en la fase 6. Lo que impide el acceso a los datos no es esta pantalla
        sino las políticas RLS de la base de datos — el bundle completo es público.
      </p>
    </section>
  `,
  styles: [
    `
      :host { display: block; max-width: 900px; }
      h1 { margin: 0 0 0.25rem; font-size: 1.3rem; }
      .lead { margin: 0 0 1.5rem; color: #94a3b8; }
      .cards {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
        gap: 0.9rem;
      }
      .card {
        display: block;
        padding: 0.9rem 1rem;
        border: 1px solid #1e293b;
        border-radius: 10px;
        background: #0f172a;
        color: inherit;
        text-decoration: none;
      }
      .card:hover { border-color: #1d4ed8; }
      .tag {
        display: inline-block;
        font-size: 11px;
        padding: 1px 7px;
        border-radius: 999px;
        background: #1e293b;
        color: #94a3b8;
      }
      .card h2 { margin: 0.5rem 0 0.3rem; font-size: 0.98rem; }
      .card p { margin: 0; font-size: 13px; color: #94a3b8; }
      .note {
        margin-top: 2rem;
        padding: 0.9rem 1rem;
        border-left: 3px solid #f5a524;
        background: #131c2e;
        border-radius: 0 8px 8px 0;
      }
      .note h3 { margin: 0 0 0.35rem; font-size: 0.9rem; }
      .note p { margin: 0; font-size: 13px; color: #cbd5e1; }
    `,
  ],
})
export class AdminDashboard {
  private auth = inject(AuthService);
  protected readonly email = computed(() => this.auth.user()?.email ?? '—');

  protected readonly panels = [
    {
      path: '/admin/apps',
      title: 'Aplicaciones',
      priority: 'P0',
      summary: 'Catálogo de apps propias.',
    },
    {
      path: '/admin/projects',
      title: 'Proyectos',
      priority: 'P1',
      summary: 'Contenido del portafolio.',
    },
    {
      path: '/admin/fuel-prices',
      title: 'Precios de combustible',
      priority: 'P1',
      summary: 'Requiere la fase 5.',
    },
  ];
}
