import { Routes } from '@angular/router';
import { adminGuard, loginGuard } from './admin.guard';
import { AdminLayout } from './layout/admin-layout';

/**
 * Everything under /admin.
 *
 * Login and the denied page sit OUTSIDE the guarded layout on purpose: a person
 * who cannot get in still has to be able to see why, and putting them inside
 * would mean the guard redirecting to a page the guard itself blocks.
 *
 * No locale segments here, and there must never be any — ADR-05 keeps the
 * language in application state rather than the URL, and the admin is Spanish
 * only regardless.
 */
export const ADMIN_ROUTES: Routes = [
  {
    path: 'login',
    canActivate: [loginGuard],
    loadComponent: () => import('./login/admin-login').then(m => m.AdminLogin),
  },
  {
    path: 'denied',
    loadComponent: () => import('./denied/admin-denied').then(m => m.AdminDenied),
  },
  {
    path: '',
    component: AdminLayout,
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./dashboard/admin-dashboard').then(m => m.AdminDashboard),
      },
      {
        path: 'apps',
        loadComponent: () => import('./panels/panel-placeholder').then(m => m.PanelPlaceholder),
        data: {
          title: 'Aplicaciones',
          priority: 'P0',
          summary: 'Catálogo de apps propias: la lista donde aparecen Music Hub y Tu Combustible RD.',
        },
      },
      {
        path: 'projects',
        loadComponent: () => import('./panels/panel-placeholder').then(m => m.PanelPlaceholder),
        data: {
          title: 'Proyectos',
          priority: 'P1',
          summary: 'Contenido del portafolio. Hoy vive escrito a mano en el componente Home.',
        },
      },
      {
        path: 'fuel-prices',
        loadComponent: () => import('./panels/panel-placeholder').then(m => m.PanelPlaceholder),
        data: {
          title: 'Precios de combustible',
          priority: 'P1',
          summary: 'Depende de la fase 5: la tabla vive en el esquema tucombustible, no en public.',
        },
      },
      // P2 and P3 panels (ajustes, media, mensajes) are deliberately not stubbed:
      // admin-panel-spec.md says to confirm they are wanted before building them,
      // and an empty menu entry is a promise the shell has no business making.
      {
        path: '**',
        loadComponent: () => import('./not-found/admin-not-found').then(m => m.AdminNotFound),
      },
    ],
  },
];
