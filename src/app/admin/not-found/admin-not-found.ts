import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

/**
 * Admin 404. Unlike the public site, this one may show the real path — the only
 * people who reach it have already passed the guard (ADR-04 layer a), so detail
 * here costs nothing and saves a guess.
 */
@Component({
  selector: 'app-admin-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h1>Página no encontrada</h1>
    <p class="lead">No existe ninguna sección de administración en esta ruta.</p>
    <pre>{{ path }}</pre>
    <a routerLink="/admin">Volver al panel</a>
  `,
  styles: [
    `
      :host { display: block; max-width: 700px; }
      h1 { margin: 0 0 0.3rem; font-size: 1.3rem; }
      .lead { margin: 0 0 1rem; color: #94a3b8; }
      pre {
        margin: 0 0 1.2rem;
        padding: 0.6rem 0.8rem;
        border-radius: 8px;
        background: #020617;
        color: #fca5a5;
        overflow-x: auto;
      }
      a { color: #93c5fd; }
    `,
  ],
})
export class AdminNotFound {
  protected readonly path = inject(Router).url;
}
