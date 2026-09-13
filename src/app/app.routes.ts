import { Routes } from '@angular/router';
import { Home } from './pages/home/home';

export const routes: Routes = [
  // The public portfolio, imported eagerly: it is the page essentially every
  // visitor wants, and making it a lazy chunk would buy a round trip before
  // first paint in exchange for nothing.
  { path: '', component: Home },

  // The admin area, lazy on purpose — it is one person's tool, and there is no
  // reason for every visitor to download it alongside the portfolio.
  //
  // Lazy loading is NOT a security measure. The chunk is public and anyone can
  // fetch it; ADR-04 is explicit that on a client-rendered SPA the whole bundle,
  // admin components included, is downloadable by anybody. What protects the
  // data is RLS in the database. This split is about weight, not secrecy.
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES),
  },

  // Unknown public paths go home. Unknown /admin/* paths are handled inside the
  // admin routes instead, so they get the admin's own not-found page.
  { path: '**', redirectTo: '' },
];
